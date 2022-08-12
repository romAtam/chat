const express = require("express");
const { sendMessage } = require("./utils/messages");
const socketio = require("socket.io");
const app = express();
const {
  addUser,
  removeUser,
  getUser,
  getUsersOfRoom,
} = require("./utils/users.js");
const path = require("path");
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ username, room, id: socket.id });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit("message", sendMessage(`wellcome in ${user.room} chat`));
    socket.broadcast
      .to(user.room)
      .emit("message", sendMessage(`${user.username} joined the chat`));
    callback();
    io.to(user.room).emit("userData", {
      room: user.room,
      usersList: getUsersOfRoom(user.room),
    });
  });
  socket.on("location", (location, callback) => {
    const user = getUser(socket.id);
    console.log(user);
    io.to(user.room).emit(
      "message",
      sendMessage(
        `https://www.google.com/maps/?q=${location.latitude},${location.longitude}`,
        user.username
      )
    );
    callback("delievered");
  });
  socket.on("message", (message) => {
    const user = getUser(socket.id);
    console.log(user.username);
    io.to(user.room).emit("message", sendMessage(message, user.username));
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        sendMessage(`${user.username} has left chat`)
      );
      io.to(user.room).emit("userData", {
        room: user.room,
        usersList: getUsersOfRoom(user.room),
      });
    }
  });
});
const port = process.env.PORT || 3000;
server.listen(port, () => console.log("listening on port " + port));
