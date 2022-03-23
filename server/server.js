const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const server = app.listen(PORT)

const {rooms,createRoom,joinRoom} = require("./server-func")

var choices = [];


const io = require("socket.io")(server,{ 
    cors: {    
      origin: "*",    
      methods: ["GET", "POST"]  
    }
})


app.get("/",(req,res) => {
    res.send("Server on")
})


io.on("connection",(socket) => {
    console.log(`new connection ${socket.id}`)

    socket.on("create-room",(roomid) => {
        if(rooms[roomid]) {
            socket.emit("error",("room already exist")) 
            return
        }
        createRoom(roomid,socket.id)
        socket.join(roomid)
        io.to(`${roomid}`).emit("player-1-connected",roomid);
        socket.emit("message","Waiting for player. . .")
    })
    
    socket.on("join-room",(roomid) => {
        if(!rooms[roomid]) {
            socket.emit("error",("cannot find the room")) 
            return
        }
        joinRoom(roomid,socket.id)
        
        socket.join(roomid)
        socket.emit("player-2-connected",roomid);
        io.to(`${roomid}`).emit("player-2-connected",roomid);
        socket.emit("message",("succesfuly joined"))
    })

    socket.on("choice",(choice,id,roomId) => {
        let x ={"id": id,"choice":choice}
        choices.push(x)
        
        if(choices.length == 2){
            io.to(`${roomId}`).emit("choices-from-server",choices)
            choices =[];
        }

    })
    
})  