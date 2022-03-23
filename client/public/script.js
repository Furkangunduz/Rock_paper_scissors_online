const choices = document.querySelectorAll(".choice");

const myPoint = document.getElementById("my-point");
const oponnentPoint = document.getElementById("oponnent-point");

const myScore = document.getElementById("my-score");
const oponnentScore = document.getElementById("oponnent-score");

const leftArm  = document.getElementById("left-arm");
const rightArm = document.getElementById("right-arm");

const roomIdInput = document.getElementById("room-id")
const joinRoomBtn =  document.getElementById("join-room");
const createRoomBtn =  document.getElementById("create-room");
const msg = document.getElementById("message")

const socket = io("http://localhost:3000");

roomIdInput.addEventListener("input",() => {
  msg.style.display = "none"
})


createRoomBtn.addEventListener("click",() => {
  const roomId = roomIdInput.value;
  socket.emit("create-room",(roomId))
})

joinRoomBtn.addEventListener("click",() => {
  const roomId = roomIdInput.value;
  socket.emit("join-room",(roomId))
})


socket.on("error",(message) => {
  msg.style.display = ""
  msg.innerText = message;
  
})



function chooseMove(){
    if(isLeftTurn){
      isLeftTurn = !isLeftTurn
      isLeftSelected = true;
    }else{
      isLeftTurn = !isLeftTurn
      isRightSelected = true;
    }
    if(isRightSelected && isLeftSelected){
      leftArm.classList.add("active");
      rightArm.classList.add("active");
    }

}


// choices.forEach((e) => {
//   e.addEventListener("click",chooseMove)
// })
//  **reset the game 
//  isSelected = !isSelected;
//  arm.classList.remove("active")
//  choices.forEach((e) => {
//    e.className = "choose"
//  })
