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
  currentTurn.top = top;
  changeTurn(currentTurn.top);
})

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
    console.log('reg space in poss turns', space)
    document.getElementById(space).setAttribute('ondrop', 'dropHandler(event)');
  })
  jumpMoves.forEach(space => {
    console.log('jump space in poss turns', space)
    document.getElementById(space).setAttribute('ondrop', 'dropHandler(event)');
  })
})

socket.on('additionalJump', (data) => {
  regMoves = [...data.reg];
  jumpMoves = [...data.jump];
  
  if (jumpMoves.length === 0) {
    console.log('in the overall else checking additional jumps')
    endingJump = true;
    socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
  }

  if (jumpMoves.length === 1) {
    console.log('jumpmoves = 1')

    let jumpMoveCheck = document.getElementById(`${jumpMoves[0]}`).children.length;
    let jumpRegCheck = document.getElementById(`${regMoves[0]}`).children.length;

    if (jumpMoveCheck === 0 && jumpRegCheck === 1) {
      let jumpAttackCheck = document.getElementById(`${regMoves[0]}`).firstElementChild.id;
      if (jumpAttackCheck !== currentTurn.player) {
        console.log('in the if to let play continue on one spots')
        return;
      } else {
        endingJump = true;
        currentTurn.jump = false;
        socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
      }
    }
    else {
      console.log('in the else to end the jump move 1')
      endingJump = true;
      currentTurn.jump = false;
      socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
    }
  }

  if (jumpMoves.length === 2) {
    console.log('jumpmoves = 2');
    let jumpMovesLeft = document.getElementById(`${jumpMoves[0]}`).children.length;
    let jumpSpaceLeft = document.getElementById(`${regMoves[0]}`).children.length;

    let jumpMovesRight = document.getElementById(`${jumpMoves[1]}`).children.length;
    let jumpSpaceRight = document.getElementById(`${regMoves[1]}`).children.length;

    if (jumpMovesLeft === 0 && jumpSpaceLeft === 1) {
      let jumpAttackLeft = document.getElementById(`${regMoves[0]}`).firstElementChild.id;
      //something here
      if (jumpAttackLeft !== currentTurn.player) {
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
      console.log('in the else to end the jump move 2')
      endingJump = true;
      currentTurn.jump = false;
      socket.emit('endTheJumpTurn', {endingJump: endingJump, endSpace: endingSpace});
    }
  }
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

function dragoverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function dropHandler(e) {
  endingSpace = e.target.id;
  e.preventDefault();
  let = childCheck = document.getElementById(`${endingSpace}`);

  if (childCheck.children.length >= 1 || e.target.classList.contains('game-piece')) {
    console.log('in the child check')
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
      console.log('in the check jump space')
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
  console.log('ending the turn', endTurn)
  let finalSpace = endTurn.endSpace;
  if (endTurn.endJump === true) {
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
    document.getElementById(endingSpace).appendChild(activePiece);
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
}


