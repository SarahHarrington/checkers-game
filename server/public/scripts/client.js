console.log('javascript loaded');

//TODO: Set a timer for the message to display at the top
//TODO: How many people are connected, is there a way to disable play for anyone who connects after initial two?
//TODO: Rooms?
//TODO: fix captured pieces, they look ridiculous. :)

//for the websocket
const socket = io();

socket.on('newClientConnection', (data) => {
  console.log('a new client has connected');
})

//Board Things
const boardSpaces = [...document.querySelectorAll('.playable')];
const capturedPieces = document.querySelector('.captured-pieces');
const gameMessage = document.querySelector('.game-message');
const startGame = document.getElementById('start-game').addEventListener('click', startTheGame);
const currentPlayerTurn = document.getElementById('current-turn');

//Turn and space tracking
let endingSpace = null;
let activePiece = null;
let currentTurn = {
  player: null,
  top: false,
  activeSpace: null,
  jump: false
  
}
let regMoves = [];
let jumpMoves = [];
let endingJump = false;

for (let i = 0; i < boardSpaces.length; i++) {
  boardSpaces[i].setAttribute('id', i + 1);
  boardSpaces[i].setAttribute('ondragover', 'dragoverHandler(event)');
}

for (let i = 0; i <= 11; i++) {
  let playerOnePiece = document.createElement('div');
  playerOnePiece.classList.add('game-piece');
  playerOnePiece.classList.add('player-one-piece');
  playerOnePiece.setAttribute('id', 'p1');
  boardSpaces[i].appendChild(playerOnePiece);
}

for (let i = 20; i <= 31; i++) {
  let playerTwoPiece = document.createElement('div');
  playerTwoPiece.classList.add('game-piece');
  playerTwoPiece.classList.add('player-two-piece');
  playerTwoPiece.setAttribute('id', 'p2');
  boardSpaces[i].appendChild(playerTwoPiece);
}

//Player pieces
const playerOnePieces = [...document.querySelectorAll('.player-one-piece')];
const playerTwoPieces = [...document.querySelectorAll('.player-two-piece')];

socket.on('gameTurn', top => {
  currentTurn.top = top;
  changeTurn(currentTurn.top);
})

socket.on('possTurnMoves', (data) => {
  possTurnMovesHandler(data);
})

socket.on('additionalJump', (data) => {
  additionalJumpHandler(data);
})

socket.on('playerTurnEnds', (turnEnds) => {
  endTheTurn(turnEnds);
})

socket.on('playerEndingJumpTurn', (turnEnds) => {
  endTheTurn(turnEnds);
})

socket.on('checkTheJump', jumpSpace => {
  checkTheJumpSpace(jumpSpace);
})

socket.on('finalMoveUpdate', data => {
  console.log('final move', data);
  if (data.player === 'p1') {
    let playerOnePiece = document.createElement('div');
    playerOnePiece.classList.add('game-piece');
    playerOnePiece.classList.add('player-one-piece');
    playerOnePiece.setAttribute('id', 'p1');
    document.getElementById(data.finalSpace).appendChild(playerOnePiece);
  }
  if (data.player === 'p2') {
    let playerTwoPiece = document.createElement('div');
    playerTwoPiece.classList.add('game-piece');
    playerTwoPiece.classList.add('player-two-piece');
    playerTwoPiece.setAttribute('id', 'p2');
    document.getElementById(data.finalSpace).appendChild(playerTwoPiece);
  }
})

function dragoverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function startTheGame() {
  socket.emit('startingTheGame');
}

function dragStartHandler(e) {
  activePiece = e.target;
  currentTurn.player = e.target.id;
  currentTurn.activeSpace = e.target.parentElement.id;
  socket.emit('moving', currentTurn);
}

function dropHandler(e) {
  endingSpace = e.target.id;
  e.preventDefault();
  let = childCheck = document.getElementById(`${endingSpace}`);

  if (childCheck.children.length >= 1 || e.target.classList.contains('game-piece')) {
    gameMessage.innerHTML = '<p>You can\'t make that move</p>';
  }
  else {
    socket.emit('checkIfJumping', endingSpace);
    childCheck = null;
  }
}

function changeTurn(top) {
  if (top === true) {
    console.log('player 1 turn -------------------------------------');
    playerOnePieces.forEach (piece => {
      piece.setAttribute('draggable', true);
      piece.setAttribute('ondragstart', 'dragStartHandler(event)');
    })
    playerTwoPieces.forEach(piece => {
      piece.removeAttribute('draggable', true);
      piece.removeAttribute('ondragstart', 'dragStartHandler(event)');
    })
    currentPlayerTurn.innerHTML = '<p>Player 1 Go!</p>'
  }
  if (top === false) {
    console.log('player 2 turn -------------------------------------');
    playerTwoPieces.forEach (piece => {
      piece.setAttribute('draggable', true);
      piece.setAttribute('ondragstart', 'dragStartHandler(event)');
    })
    playerOnePieces.forEach(piece => {
      piece.removeAttribute('draggable', true);
      piece.removeAttribute('ondragstart', 'dragStartHandler(event)');
    })
    currentPlayerTurn.innerHTML = '<p>Player 2 Go!</p>'
  }
}

function checkTheJumpSpace(jumpSpace) {
  let jumpingVerify = document.getElementById(jumpSpace); 
    let pieceCaptured = jumpingVerify.firstChild;
    if (jumpingVerify.children.length === 0 || pieceCaptured.id === activePiece.id) { 
      gameMessage.innerHTML = '<p>You can\'t make that move</p>';
    }

    else {
      jumpingVerify.removeChild(pieceCaptured);
      capturedPieces.appendChild(pieceCaptured);
      document.getElementById(endingSpace).appendChild(activePiece);
      currentTurn.activeSpace = endingSpace;
      currentTurn.jump = true;
      socket.emit('jumpingMoving', currentTurn);
    }
}

function additionalJumpHandler(data) {
  regMoves = [...data.reg];
  jumpMoves = [...data.jump];
  
  if (jumpMoves.length === 0) {
    endingJump = true;
    socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
  }

  if (jumpMoves.length === 2) {
    let jumpMovesLeft = document.getElementById(`${jumpMoves[0]}`).children.length;
    let jumpSpaceLeft = document.getElementById(`${regMoves[0]}`).children.length;

    let jumpMovesRight = document.getElementById(`${jumpMoves[1]}`).children.length;
    let jumpSpaceRight = document.getElementById(`${regMoves[1]}`).children.length;

    if (jumpMovesLeft === 0 && jumpSpaceLeft === 1) {
      let jumpAttackLeft = document.getElementById(`${regMoves[0]}`).firstElementChild.id;
      //something here
      if (jumpAttackLeft != currentTurn.player) {
        return
      }
      else {
        endingJump = true;
        currentTurn.jump = false;
        socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
      }
    }
    if (jumpMovesRight === 0 && jumpSpaceRight === 1) {
      let jumpAttackRight = document.getElementById(`${regMoves[1]}`).firstElementChild.id;
      if (jumpAttackRight === currentTurn.player) {
        return
      }
      else {
        endingJump = true;
        currentTurn.jump = false;
        socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
      }
    }
    else {
      endingJump = true;
      currentTurn.jump = false;
      socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
    }
  }
}

function possTurnMovesHandler(data) {
  regMoves = [...data.reg];
  jumpMoves = [...data.jump];

  for (let i = 0; i < regMoves.length; i++) {
    if (regMoves[i] != 0) {
      document.getElementById(regMoves[i]).setAttribute('ondrop', 'dropHandler(event)');
    }
  }
  for (let i = 0; i < jumpMoves.length; i++) {
    if (regMoves[i] != 0) {
      document.getElementById(jumpMoves[i]).setAttribute('ondrop', 'dropHandler(event)');
    }
  }
}

function endTheTurn(endTurn) {
  let finalSpace = endTurn.endSpace;

  updateAllPlayers({finalSpace: finalSpace, player: currentTurn.player, activeSpace: currentTurn.activeSpace})

  if (endTurn.endJump === true) {
    for (let i = 0; i < regMoves.length; i++) {
      if (regMoves[i] != 0) {
        document.getElementById(regMoves[i]).removeAttribute('ondrop', 'dropHandler(event)');
      }
    }
    for (let i = 0; i < jumpMoves.length; i++) {
      if (regMoves[i] != 0) {
        document.getElementById(jumpMoves[i]).removeAttribute('ondrop', 'dropHandler(event)');
      }
    }
    currentTurn.player = null;
    currentTurn.activeSpace = null;
    [endingJump, activeSpace, activePiece] = [false, null, null];
    changeTurn(endTurn.top);
  }
  else {
    document.getElementById(endingSpace).appendChild(activePiece);
      for (let i = 0; i < regMoves.length; i++) {
        if (regMoves[i] != 0) {
          document.getElementById(regMoves[i]).removeAttribute('ondrop', 'dropHandler(event)');
        }
      }
      for (let i = 0; i < jumpMoves.length; i++) {
        if (regMoves[i] != 0) {
          document.getElementById(jumpMoves[i]).removeAttribute('ondrop', 'dropHandler(event)');
        }
      }
      currentTurn.player = null;
      currentTurn.activeSpace = null;
      [endingJump, activeSpace, activePiece] = [false, null, null];
      changeTurn(endTurn.top);
  }
}

function updateAllPlayers(data) {
  socket.emit('updateSpace', data);
}



