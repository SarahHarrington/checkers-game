const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const validMoves = require('./modules/valid_moves.js');

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
    let space = parseInt(currentTurn.activeSpace);
    let player = currentTurn.player;
    
    switch(player) {
      case 'p1':
        possTurns.reg = validMoves[space].f;
        possTurns.jump = validMoves[space].fj;
        break;
      case 'p2': 
        possTurns.reg = validMoves[space].r;
        possTurns.jump = validMoves[space].rj;
        break;
      default: 
        console.log('no valid moves');
    }

    io.emit('possTurnMoves', possTurns);

  })


});

server.listen(5000);
console.log('listening on server');