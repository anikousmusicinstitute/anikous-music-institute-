const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

const rooms = {}; // Track users in rooms

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  socket.on('join-room', (roomId, userId, userName) => {
    socket.join(roomId);
    
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push({ id: userId, name: userName });

    // Notify others
    socket.to(roomId).emit('user-connected', userId, userName);
    
    // Send updated student list to room
    io.to(roomId).emit('update-student-list', rooms[roomId]);
  });

  // Chat message event
  socket.on('send-message', (data) => {
    io.to(data.roomId).emit('receive-message', data);
  });

  // Raise hand event
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

http.listen(3000, () => {
  console.log('Server running on port 3000');
});
