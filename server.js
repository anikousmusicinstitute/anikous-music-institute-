const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('join-room', (roomId, userId, userName) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push({ id: userId, name: userName || 'User' });

    socket.to(roomId).emit('user-connected', userId, userName);
    io.to(roomId).emit('update-student-list', rooms[roomId]);
  });

  socket.on('send-message', (data) => {
    io.to(data.roomId).emit('receive-message', data);
  });

  socket.on('raise-hand', (data) => {
    io.to(data.roomId).emit('user-raised-hand', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected:', socket.id);
    for (let roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(user => user.id !== socket.id);
      io.to(roomId).emit('update-student-list', rooms[roomId]);
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
