console.log('javascript loaded');
const socket = io();
const boardRows = [...document.querySelectorAll('.board-row')];
const boardSpaces = [...document.querySelectorAll('.playable')];
const capturedPieces = document.querySelector('.captured-pieces');
let activePiece = null;
let possibleSpaces = [];

let currentTurn = {
  player: null,
  activeSpace: null
}

socket.on('newClientConnection', (data) => {
  console.log('a new client has connected');
})

for (let i = 0; i < boardSpaces.length; i++) {
  boardSpaces[i].setAttribute('id', i + 1);
  boardSpaces[i].setAttribute('ondragover', 'dragoverHandler(event)');
}

for (let i = 0; i <= 11; i++) {
  let playerOnePiece = document.createElement('div');
  playerOnePiece.classList.add('player-one-piece');
  playerOnePiece.setAttribute('id', 'p1');
  playerOnePiece.setAttribute('draggable', true);
  playerOnePiece.setAttribute('ondragstart', 'dragStartHandler(event)')
  boardSpaces[i].appendChild(playerOnePiece);
}

for (let i = 20; i <= 31; i++) {
  let playerTwoPiece = document.createElement('div');
  playerTwoPiece.classList.add('player-two-piece');
  playerTwoPiece.setAttribute('id', 'p2');
  playerTwoPiece.setAttribute('draggable', true);
  playerTwoPiece.setAttribute('ondragstart', 'dragStartHandler(event)')
  boardSpaces[i].appendChild(playerTwoPiece);
}

function dragStartHandler(e) {
  activePiece = e.target;
  currentTurn.activeSpace = e.target.parentElement.id;
  currentTurn.player = e.target.id;
  console.log(currentTurn);
  socket.emit('moving', currentTurn);
  socket.on('possTurnMoves', (data) => {
    possibleSpaces = data;
    console.log('data', data);
    // data.forEach((space) => {
    //   document.getElementById(space).setAttribute('ondrop', 'dropHandler(event)');
    // })
  })
}

function dragoverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function dropHandler(e) {
  console.log('space drop', e.target.id);
  e.preventDefault();
  document.getElementById(e.target.id).appendChild(activePiece);
  possibleSpaces.forEach( (space) => {
    document.getElementById(space).removeAttribute('ondrop', 'dropHandler(event');
  })
  activePiece = null;
  currentTurn.player = null;
  currentTurn.activeSpace = null;
} 
