console.log('javascript loaded');
const socket = io();
const boardRows = [...document.querySelectorAll('.board-row')];
const boardSpaces = [...document.querySelectorAll('.playable')];
const capturedPieces = document.querySelector('.captured-pieces');
let activePiece = null;

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

let regMoves = [];
let jumpMoves = [];
function dragStartHandler(e) {
  activePiece = e.target;
  currentTurn.activeSpace = e.target.parentElement.id;
  currentTurn.player = e.target.id;
  console.log(currentTurn);
  socket.emit('moving', currentTurn);
  socket.on('possTurnMoves', (data) => {
    console.log('data', data);
    regMoves = [...data.reg];
    jumpMoves = [...data.jump];
    regMoves.forEach(space => {
      document.getElementById(space).setAttribute('ondrop', 'dropHandler(event)');
    })
    jumpMoves.forEach(space => {
      document.getElementById(space).setAttribute('ondrop', 'dropHandler(event)');
    })
  })
}

function dragoverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

let endingSpace = null;
function dropHandler(e) {
  e.preventDefault();
  socket.emit('currentTurnEndCheck', e.target.id);

  //this is for regular turns when the play ends.
  socket.on('playerTurnEnds', endSpace => {
    endingSpace = endSpace;
    //appends piece to the new space
    document.getElementById(endingSpace).appendChild(activePiece);
    //removes values from stuff
    regMoves.forEach( (space) => {
      document.getElementById(space).removeAttribute('ondrop', 'dropHandler(event');
    })
    jumpMoves.forEach( (space) => {
      document.getElementById(space).removeAttribute('ondrop', 'dropHandler(event');
    })
    currentTurn.player = null;
    currentTurn.activeSpace = null;
  })

  //this is for verifying if a piece is on a jumped space
  socket.on('checkTheJump', jumpSpace => {
    console.log('jumpSpace', jumpSpace);

    let jumpingVerify = document.getElementById(jumpSpace);
    console.log(jumpingVerify.children.length);
    let pieceCaptured = jumpingVerify.firstChild;
    console.log(jumpingVerify.firstChild);
      //how do I check for p1 vs p2 here? Or send to server and get ok back?
    jumpingVerify.removeChild(pieceCaptured);
    capturedPieces.appendChild(pieceCaptured);
    //fix captured pieces, they look ridiculous. :)
    document.getElementById(endingSpace).appendChild(activePiece);
    activePiece = null;
  })

  socket.on('jumpSpaceToCheck', jumpedSpace => {
    
  })
} 
