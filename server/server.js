var express = require('express');
var app = express();
var http = require ('http').Server(app);
var io = require('socket.io')(http);
var PORT = 5000;
const validMoves = require('./modules/valid_moves.js');
app.use(express.static('./server/public'));



console.log(validMoves);












http.listen(PORT, err => {
  if (err) {
    console.log(`Error listening on  port ${PORT}`, err);
  } 
  else {
    console.log(`Listening on port ${PORT}`);
  }
});
