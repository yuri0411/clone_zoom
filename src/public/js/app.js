const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
// 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

// 서버 연결 떄
socket.addEventListener("open", (e) => {
  console.log("Connected to Server");
});

// 서버에서 메세지를 받을 떼
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  console.log(message);
  li.innerText = message.data;
  messageList.append(li);
});

// 서버와 연결이 끊겼을 때
socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

function handleSubmit(e) {
  e.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}

function handleNickSubmit(e) {
  e.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
