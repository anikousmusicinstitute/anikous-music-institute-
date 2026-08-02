const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("."));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-room", (room) => {
    socket.join(room);
    socket.to(room).emit("user-joined");
  });

  socket.on("signal", (data) => {
    socket.to(data.room).emit("signal", data.signal);
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
