const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT);

const {rooms,createRoom,joinRoom} = require("./server-func");

const io = require("socket.io")(server,{ 
    cors: {    
      origin: "*",    
      methods: ["GET", "POST"]  
    }
})


app.get("/",(req,res) => {
    res.send("Server on");
})


io.on("connection",(socket) => {
    console.log(`new connection ${socket.id}`);

    socket.on("create-room",(roomid) => {
        if(rooms[roomid]) {
            socket.emit("error",("room already exist")) 
            return;
        }
    
        createRoom(roomid,socket.id);
        console.log(rooms[roomid])
    })
    socket.on("join-room",(roomid) => {
        if(!rooms[roomid]) {
            socket.emit("error",("cannot find the room")) 
            return;
        }
        joinRoom(roomid,socket.id)
        console.log(rooms[roomid])
    })
    
})  