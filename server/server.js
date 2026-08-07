const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Room & Peer State Management
const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    rooms.get(roomId).set(socket.id, user);

    // Broadcast to existing room members
    socket.to(roomId).emit('user-connected', { userId: socket.id, user });

    // Send current peer list
    const peers = Array.from(rooms.get(roomId).entries()).map(([id, data]) => ({ id, ...data }));
    socket.emit('room-users', peers);

    // Relay WebRTC Signaling
    socket.on('offer', (payload) => {
      io.to(payload.target).emit('offer', { sdp: payload.sdp, sender: socket.id });
    });

    socket.on('answer', (payload) => {
      io.to(payload.target).emit('answer', { sdp: payload.sdp, sender: socket.id });
    });

    socket.on('ice-candidate', (payload) => {
      io.to(payload.target).emit('ice-candidate', { candidate: payload.candidate, sender: socket.id });
    });

    // Live Classroom Sync Events
    socket.on('send-chat', (data) => {
      io.to(roomId).emit('receive-chat', data);
    });

    socket.on('raise-hand', (data) => {
      io.to(roomId).emit('hand-raised', data);
    });

    socket.on('midi-note', (data) => {
      socket.to(roomId).emit('midi-note', data);
    });

    socket.on('disconnect', () => {
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) rooms.delete(roomId);
      }
      io.to(roomId).emit('user-disconnected', socket.id);
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Anikous Music Server running on port ${PORT}`);
});
