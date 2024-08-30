import http from "http";
// import { WebSocketServer } from "ws";
import { Server } from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000 `);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, callback) => {
    socket.join(roomName);
    callback();
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1),
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (message, room, callback) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${message}`);
    callback();
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});

// const sockets = [];
//
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anonymous";
//   console.log("Connected to Browser");
//
//   socket.on("close", () => {
//     console.log("Disconnected from Browser");
//   });
//
//   socket.on("message", (message) => {
//     const parsedMessage = JSON.parse(message);
//     console.log(parsedMessage);
//     switch (parsedMessage.type) {
//       case "new_message":
//         sockets.forEach((anotherSocket) =>
//           anotherSocket.send(`${socket.nickname}: ${parsedMessage.payload}`),
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = parsedMessage.payload;
//         break;
//     }
//     console.log("===>", socket);
//   });
// });

httpServer.listen(3000, handleListen);
