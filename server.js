// server.js

require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const classesRoutes = require("./routes/classes");

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/classes", classesRoutes);

const rooms = {};

io.on("connection", (socket) => {

    socket.on("join-room", (roomId) => {

        socket.join(roomId);

        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }

        rooms[roomId].push(socket.id);

        socket.to(roomId).emit("user-joined", socket.id);

        socket.on("offer", (data) => {
            socket.to(roomId).emit("offer", data);
        });

        socket.on("answer", (data) => {
            socket.to(roomId).emit("answer", data);
        });

        socket.on("ice-candidate", (data) => {
            socket.to(roomId).emit("ice-candidate", data);
        });

        socket.on("chat-message", (msg) => {
            io.to(roomId).emit("chat-message", msg);
        });

        socket.on("piano-key", (note) => {
            socket.to(roomId).emit("piano-key", note);
        });

        socket.on("midi-note", (note) => {
            socket.to(roomId).emit("midi-note", note);
        });

        socket.on("disconnect", () => {

            if (rooms[roomId]) {
                rooms[roomId] =
                    rooms[roomId].filter(id => id !== socket.id);
            }

            socket.to(roomId).emit("user-left", socket.id);

        });

    });

});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server Running : http://localhost:${PORT}`);
});
