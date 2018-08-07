const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const validMoves = require('./modules/valid_moves.js');

let space = null;
let player = null;
let top = false;

app.use(express.static(`${__dirname}/public`));

let possTurns = {
  reg: null,
  jump: null
}

io.on('connection', socket => {
  console.log('a new client has connected');

  socket.on('startingTheGame', () => {
    let randomNumber = Math.floor(Math.random() * 10) +1;
    if (randomNumber <= 5) {
      top = true;
      io.emit('gameTurn', top);
    }
    if (randomNumber >= 6) {
      top = false;
      io.emit('gameTurn', top);
    }
  })

  socket.on('moving', currentTurn => {
    turnStart(currentTurn);
  })

  socket.on('jumpingMoving', currentTurn => {
    turnStart(currentTurn);
    if (currentTurn.jump === true) {
      io.emit('additionalJump', possTurns);
    }
    else {
      io.emit('possTurnMoves', possTurns);
    }
  })

  socket.on('checkIfJumping', endSpace => {
    const isJumping = possTurns.jump.filter(poss => (parseInt(poss) === parseInt(endSpace)));
    let indexOfJumped = possTurns.jump.findIndex(possTurn => possTurn === parseInt(endSpace));

    if (isJumping.length === 1) {
      io.emit('checkTheJump', possTurns.reg[indexOfJumped]);
    }
    else {
      top = !top;
      io.emit('playerTurnEnds',{endJump: false, top: top, endSpace: endSpace});
    }
  });

  socket.on('endTheJumpTurn', (endJump) => {
    console.log('endTheJumpTurn', endJump);
    top = !top;
    io.emit('playerEndingJumpTurn', {endJump: endJump.endingJump, top: top, endSpace: endJump.endSpace});
  })

  socket.on('updateSpace', data => {
    console.log('data for the final space', data);
    socket.broadcast.emit('finalMoveUpdate', data);
  })

});

function turnStart(currentTurn) {  
  space = parseInt(currentTurn.activeSpace);
  player = currentTurn.player;
  
  switch(player) {
    case 'p1':
      possTurns.reg = validMoves[space].f;
      possTurns.jump = validMoves[space].fj;
      break;
    case 'p2': 
      possTurns.reg = validMoves[space].r;
      possTurns.jump = validMoves[space].rj;
      break;
    case 'king':
      //code to send back will go here
      break;
    default: 
  }

  io.emit('possTurnMoves', possTurns);

}

server.listen(5000);
console.log('listening on server');