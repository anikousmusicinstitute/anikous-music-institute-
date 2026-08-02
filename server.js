const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


io.on("connection", (socket) => {

    console.log("User connected:", socket.id);


    socket.on("midiNote", (data) => {

        socket.broadcast.emit(
            "studentNote",
            data
        );

    });


    socket.on("disconnect", () => {

        console.log("User left:", socket.id);

    });

});


server.listen(3000, () => {

    console.log("Server running on 3000");

});
window.onload = function(){

    let piano = document.getElementById("piano");

    piano.innerHTML = `
        <div class="white">C1</div>
        <div class="white">D1</div>
        <div class="white">E1</div>
        <div class="white">F1</div>
        <div class="white">G1</div>
        <div class="white">A1</div>
        <div class="white">B1</div>
    `;

};
