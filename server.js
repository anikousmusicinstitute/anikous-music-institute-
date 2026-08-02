const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const http = require("http").createServer(app);

const { Server } = require("socket.io");
const io = new Server(http);

app.use(express.static(__dirname));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Error:", err);
});

// Register User
app.post("/register", async (req, res) => {

    try {

        const { name, username, password, role } = req.body;

        const exists = await User.findOne({ username });

        if (exists) {
            return res.json({
                success: false,
                message: "Username already exists"
            });
        }

        const user = new User({
            name,
            username,
            password,
            role
        });

        await user.save();

        res.json({
            success: true,
            message: "User Created Successfully"
        });

    } catch (err) {

        console.log(err);

        res.json({
            success: false,
            message: "Server Error"
        });

    }

});

// Login User
app.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({
            username,
            password
        });

        if (!user) {

            return res.json({
                success: false,
                message: "Invalid Username or Password"
            });

        }

        res.json({
            success: true,
            role: user.role,
            name: user.name
        });

    } catch (err) {

        console.log(err);

        res.json({
            success: false,
            message: "Server Error"
        });

    }

});

// Socket.IO
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

    console.log(`🚀 Server Running on Port ${PORT}`);

});
