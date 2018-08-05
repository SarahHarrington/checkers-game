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

function startTheGame() {
  socket.emit('startingTheGame');
}

socket.on('gameTurn', top => {
  console.log('game turn socket', top);
  currentTurn.top = top;
  changeTurn(currentTurn.top);
})

function changeTurn(top) {
  console.log('top in the change turn', top)
  if (top === true) {
    console.log('player one if')
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
    console.log('player two if')
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

function dragStartHandler(e) {
  activePiece = e.target;
  currentTurn.player = e.target.id;
  currentTurn.activeSpace = e.target.parentElement.id;
  socket.emit('moving', currentTurn);
}

socket.on('possTurnMoves', (data) => {
  regMoves = [...data.reg];
  jumpMoves = [...data.jump];
  regMoves.forEach(space => {
    document.getElementById(space).setAttribute('ondrop', 'dropHandler(event)');
  })
  jumpMoves.forEach(space => {
    document.getElementById(space).setAttribute('ondrop', 'dropHandler(event)');
  })
})

socket.on('additionalJump', (data) => {
  regMoves = [...data.reg];
  jumpMoves = [...data.jump];
  
  if (jumpMoves.length === 1) {
    if (document.getElementById(`${regMoves[0]}`).children.length === 0) {
      socket.emit('checkIfJumping', endingSpace);
    }
    else {
      console.log('in the else of 2')
      endingJump = true;
      socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
    }
  }
  if (jumpMoves.length === 2) {
    if (document.getElementById(`${regMoves[0]}`).children.length === 0 || document.getElementById(`${regMoves[1]}`).children.length === 0) {
      socket.emit('checkIfJumping', endingSpace);
    }
    else {
      console.log('in the else of 2')
      endingJump = true;
      socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
    }
  }
  // else {
  //   endingJump = true;
  //   socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
  // }
})

socket.on('playerTurnEnds', (turnEnds) => {
  console.log('socket turn end', turnEnds);
  endTheTurn(turnEnds);
})

socket.on('playerEndingJumpTurn', (turnEnds) => {
  endTheTurn(turnEnds);
})

socket.on('checkTheJump', jumpSpace => {
  checkTheJumpSpace(jumpSpace);
})

function dragoverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
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
    //this is for regular turns when the play ends.
  childCheck = null;
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

function endTheTurn(endTurn) {
  let finalSpace = endTurn.endSpace;
  console.log('in the end turn function', endingSpace);
  if (endTurn.endJump === true) {
    console.log('ending jump in the endTheTurnFunction')
    regMoves.forEach( (space) => {
      document.getElementById(space).removeAttribute('ondrop', 'dropHandler(event)');
    })
    jumpMoves.forEach( (space) => {
      document.getElementById(space).removeAttribute('ondrop', 'dropHandler(event)');
    })
    currentTurn.player = null;
    currentTurn.activeSpace = null;
    endingJump = false;
    activeSpace = null;
    activePiece = null;
    changeTurn(endTurn.top);
  }
  else {
    console.log('in the else of the endTheTurn function', endingSpace)
    document.getElementById(endingSpace).appendChild(activePiece);
      //removes values from stuff
      regMoves.forEach( (space) => {
        document.getElementById(space).removeAttribute('ondrop', 'dropHandler(event)');
      })
      jumpMoves.forEach( (space) => {
        document.getElementById(space).removeAttribute('ondrop', 'dropHandler(event)');
      })
      currentTurn.player = null;
      currentTurn.activeSpace = null;
      endingJump = false;
      activeSpace = null;
      activePiece = null;
      // endingSpace = null;
      changeTurn(endTurn.top);
  }
}


