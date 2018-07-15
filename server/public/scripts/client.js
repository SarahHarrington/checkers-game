console.log('javascript loaded');

const boardRows = [...document.querySelectorAll('.board-row')];
const boardSpaces = [...document.querySelectorAll('.playable')];

function gameStart() {
  //functions for loading initial piece placement
}

for (let i = 0; i <= 11; i++) {
  let playerOnePiece = document.createElement('div');
  playerOnePiece.classList.add('player-one-piece');
  boardSpaces[i].appendChild(playerOnePiece);
}

for (let i = 20; i <= 32; i++) {
  let playerTwoPiece = document.createElement('div');
  playerTwoPiece.classList.add('player-two-piece');
  boardSpaces[i].appendChild(playerTwoPiece);
}

console.log('boardRows', boardRows);
console.log('boardSpaces', boardSpaces);

