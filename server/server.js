const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const validMoves = require('./modules/valid_moves.js');

let space = null;
let player = null;

app.use(express.static(`${__dirname}/public`));

io.on('connection', socket => {
  console.log('a new client has connected');

  let possTurns = {
    reg: null,
    jump: null
  }

  socket.on('moving', currentTurn => {
    console.log(currentTurn);
    //function to check possible moves based on player and send back to client
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
        console.log('no valid moves');
    }

    io.emit('possTurnMoves', possTurns);

  })

  socket.on('currentTurnEndCheck', endSpace => {
    console.log('end space from client', endSpace);

    const isJumping = possTurns.jump.filter(poss => (parseInt(poss) === parseInt(endSpace)));
    console.log('isJumping', isJumping);

    if (isJumping.length === 1) {
      console.log('will do the things here');
      if (possTurns.jump.length === 1) {
        io.emit('checkTheJump', possTurns.reg[0]);
      }
      // 
    }
    if (isJumping.length === 2) {
      console.log('jumping with two options');
    }
    else {
      io.emit('playerTurnEnds', endSpace);
    }
  })
});

server.listen(5000);
console.log('listening on server');