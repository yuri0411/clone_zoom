const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
// 서버로의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

// 서버 연결 떄
socket.addEventListener("open", (e) => {
  console.log("Connected to Server");
});

// 서버에서 메세지를 받을 떼
socket.addEventListener("message", (message) => {
  console.log(`New message: ${message.data}`);
});

// 서버와 연결이 끊겼을 때
socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
});
