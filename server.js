const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

io.on("connection",(socket)=>{

    console.log("User connected");

    socket.on("midiNote",(data)=>{
        socket.broadcast.emit("studentNote",data);
    });

});

server.listen(3000,()=>{
    console.log("Server running");
});
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});


io.on("connection",(socket)=>{

    console.log("User connected:", socket.id);


    socket.on("midiNote",(note)=>{

        socket.broadcast.emit(
            "studentNote",
            note
        );

    });


    socket.on("disconnect",()=>{
        console.log("User left");
    });

});


server.listen(3000,()=>{
    console.log("Server running on 3000");
});
