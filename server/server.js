const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const server = app.listen(PORT)

const {rooms,createRoom,joinRoom,delRoom} = require("./server-func")




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
    let roomName = "";
    console.log(`new connection ${socket.id}`)

    
    socket.on("disconnect",() => {
        console.log("user disconnected")
        delRoom(roomName,socket.id);
        
    })

    socket.on("create-room",(roomid) => {
        roomName = roomid
        if(rooms[roomid]) {
            socket.emit("error",("room already exist")) 
            return
        }
        createRoom(roomid,socket.id)
        rooms[roomid].choices = []
        socket.join(roomid)
        io.to(`${roomid}`).emit("player-1-connected",roomid);
        socket.emit("message","Waiting for player. . .")
    })
    
    
    socket.on("join-room",(roomid) => {
        roomName = roomid
        if(!rooms[roomid]) {
            socket.emit("error",("cannot find the room")) 
            return
        }
        joinRoom(roomid,socket.id)
        
        socket.join(roomid)
        socket.emit("player-2-connected",roomid);
        io.to(`${roomid}`).emit("player-2-connected",roomid);
        socket.emit("message",("succesfuly joined"))
        rooms[roomid].choices = []
    })

    socket.on("choice",(choice,id,roomId) => {
        let x 
        if(choice) x={"id": id,"choice":choice}
        rooms[roomId].choices.push(x)
        
        console.log(rooms[roomId].choices)

        if(rooms[roomId].choices.length == 2){
            io.to(`${roomId}`).emit("choices-from-server",rooms[roomId].choices)
            rooms[roomId].choices =[];
        }

    })
    
})  