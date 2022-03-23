var rooms = {}

const createRoom = (roomId,userId) => {
  rooms[roomId] = [userId,""]
}

const joinRoom = (roomId,userId) => {
  rooms[roomId][1] = userId;
}

module.exports = {rooms,createRoom,joinRoom}
