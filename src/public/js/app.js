const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  console.log(message);
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () =>
    addMessage(`You: ${value}`),
  );
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerHTML = `Room ${roomName}`;

  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = form.querySelector("input");

  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
});

socket.on("welcome", () => {
  addMessage("Someone joined!");
});

socket.on("bye", () => {
  addMessage("Someone left ㅠㅠ!");
});

socket.on("new_message", addMessage);
