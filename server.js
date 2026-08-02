const express = require("express");
const app = express();
const http = require("http").createServer(app);

const { Server } = require("socket.io");
const io = new Server(http);

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);

    socket.to(room).emit("user-joined", socket.id);
  });

  socket.on("signal", ({ room, signal }) => {
    socket.to(room).emit("signal", {
      sender: socket.id,
      signal: signal
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
