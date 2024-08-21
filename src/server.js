import http from 'http'
import { WebSocketServer } from "ws";
import express from 'express';

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on ws://localhost:3000 `);

// http 서버애 access
const server = http.createServer(app)
// http 서버 위에 webSocket 서버를 만듬.
const wss = new WebSocketServer({server});

server.listen(3000, handleListen);