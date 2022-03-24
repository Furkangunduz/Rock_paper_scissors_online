var rooms = {}

const createRoom = (roomId,userId) => {
  rooms[roomId] = [userId,""]
}

const joinRoom = (roomId,userId) => {
  rooms[roomId][1] = userId;
}

const delRoom = (roomId,userId) => {
    if(roomId){
      let playerIndex = rooms[roomId].findIndex(p => p == userId)
      if (playerIndex < 0) return

      rooms[roomId].splice(playerIndex,1)
      
      if(!rooms[roomId][0] && !rooms[roomId][1]) {
          delete rooms[roomId]
          console.log(`${roomId} => there is no player. Room deleted`)
    }
} 
}

module.exports = {rooms,createRoom,joinRoom,delRoom}
