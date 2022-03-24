const choices = document.querySelectorAll(".choice")

const myPointArea = document.getElementById("my-point")
const opponentPointArea = document.getElementById("opponent-point")

const myScoreArea = document.getElementById("my-score")
const opponentScoreArea = document.getElementById("opponent-score")

const leftArm  = document.getElementById("left-arm")
const rightArm = document.getElementById("right-arm")

const roomIdInput = document.getElementById("room-id")
const joinRoomBtn =  document.getElementById("join-room")
const createRoomBtn =  document.getElementById("create-room")
const msg    = document.getElementById("message")

const loginScreen = document.getElementById("login-screen")
const gameScreen = document.getElementById("game-screen")
const winlostText = document.getElementById("who-win")


var audio = document.getElementById("myaudio"); 
audio.volume = 0.001

const socket = io("http://localhost:3000")

var playerOneConnected = false
var playerTwoConnected = false
var canChoose=false;
var choice = "";
var isSelected = false;
var roomId = "";
var playerId = socket.id;
var playerOneMove;
var playerTwoMove;
var myscore = 0;
var opponentscore = 0;
var myPoint = 0;
var opponentPoint = 0;

roomIdInput.addEventListener("input",() => {
  msg.style.display = "none"
  msg.innerText = ""
})


createRoomBtn.addEventListener("click",() => {
  const roomId = roomIdInput.value.trim()
  socket.emit("create-room",(roomId))
  audio.play();
})

joinRoomBtn.addEventListener("click",() => {
  const roomId = roomIdInput.value.trim();
  socket.emit("join-room",(roomId))
  audio.play();
})


socket.on("error",(message) => {
  msg.style.display = ""
  msg.innerText = message
})

socket.on("message",(message) => {
  msg.style.display = ""
  msg.innerText = message
})

socket.on("player-1-connected",(roomid) => {
  roomId = roomid
  playerOneConnected = true
  console.log("player one connected")
})

socket.on("player-2-connected",(roomid) => {
  roomId = roomid
  playerTwoConnected = true
  console.log("player two connected")
  
  if(playerTwoConnected){
    canChoose = true;
    loginScreen.style.display = "none";
    gameScreen.style.display = "flex";
  }
})

socket.on("choices-from-server",(choicesfromserver) => {
  choicesfromserver.forEach((e) => {
    if(e.id == socket.id){
      playerOneMove = e.choice;
    }else{
      playerTwoMove = e.choice;
    }
  })
  var winner;
  leftArm.classList.add("active")
  rightArm.classList.add("active")
  setTimeout(() => {
    winner = whoWin(playerOneMove,playerTwoMove);
    if(winner == 1) {
      ++myscore; 
      winlostText.innerText = "You Win !"
    }
    if(winner == 2) {
      ++opponentscore; 
      winlostText.innerText = "You Lost !"  
    }
    if(winner = 3){ 
      winlostText.innerText = " Draw ! "
    }
    myScoreArea.innerText = myscore
    opponentScoreArea.innerText = opponentscore 
    
    if(myscore==3){
      myscore = 0;
      opponentscore = 0;
      myScoreArea.innerText = myscore
      opponentScoreArea.innerText = opponentscore 
      ++myPoint;
      myPointArea.innerText = myPoint
    }
    if(opponentscore==3){
      myscore = 0;
      opponentscore = 0;
      myScoreArea.innerText = myscore
      opponentScoreArea.innerText = opponentscore
      ++opponentPoint;
      opponentPointArea.innerText = opponentPoint
    }

    //reset for next 
    choices.forEach((i) => {
      i.className = "choice";
      i.addEventListener("click",makeChoice)
    })
    canChoose = true;
    leftArm.classList.remove("active")
    rightArm.classList.remove("active")
  },1900)
  
})



choices.forEach((e) => {
  e.addEventListener("click",makeChoice)
})


function sendChoice(choice){
  socket.emit("choice",choice,socket.id,roomId)
}

function makeChoice(){
  choice = this.id;
  canChoose = false;
  if(!canChoose){
    choices.forEach((i) => {
      i.removeEventListener("click",makeChoice)
      i.className = "disable"
    })
  }
  sendChoice(choice);
}



//if move1 wins return 1 if move2 wins  return 2 if draw return 3 
function whoWin(Move1,Move2){
  if(Move1 === Move2) return 3;
  if(Move1 == "paper" && Move2 == "rock") return 1;
  if(Move1 == "rock" && Move2 == "scissors") return 1;
  if(Move1 == "scissors" && Move2 == "paper") return 1;
  if(Move1 == "rock" && Move2 == "paper") return 2;
  if(Move1 == "scissors" && Move2 == "rock") return 2;
  if(Move1 == "paper" && Move2 == "scissors") return 2;
  else{return 0};
}