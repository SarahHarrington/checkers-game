const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const validMoves = require('./modules/valid_moves.js');

app.use(express.static(`${__dirname}/public`));

io.on('connection', socket => {
  console.log('a new client has connected');

  socket.on('moving', currentTurn => {
    console.log(currentTurn);
    //function to check possible moves based on player and send back to client
    let space = parseInt(currentTurn.activeSpace);
    let possTurnMoves = validMoves[space];

    io.emit('possTurnMoves', possTurnMoves);

  })


});

server.listen(5000);
console.log('listening on server');