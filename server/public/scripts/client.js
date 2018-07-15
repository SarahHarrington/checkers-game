console.log('javascript loaded');
const boardRows = [...document.querySelectorAll('.board-row')];
const boardSpaces = [...document.querySelectorAll('.playable')];

for (let i = 0; i < boardSpaces.length; i++) {
  boardSpaces[i].setAttribute('id', i);
}

for (let i = 0; i <= 11; i++) {
  let playerOnePiece = document.createElement('div');
  playerOnePiece.classList.add('player-one-piece');
  playerOnePiece.setAttribute('draggable', true);
  playerOnePiece.addEventListener('click', pieceSelected)
  boardSpaces[i].appendChild(playerOnePiece);
}

for (let i = 20; i <= 31; i++) {
  let playerTwoPiece = document.createElement('div');
  playerTwoPiece.classList.add('player-two-piece');
  playerTwoPiece.setAttribute('draggable', true);
  playerTwoPiece.addEventListener('click', pieceSelected)
  boardSpaces[i].appendChild(playerTwoPiece);
}

function getPlayerOnePieces() {
  
}

function pieceSelected(e) {
  console.log(e.target.parentElement.id) // logging id of parent element
}

let playerOnePieces = [...document.querySelectorAll('.player-one-piece')];

console.log('player once pieces', playerOnePieces);
// console.log(playerOnePieces[0].parentElement)

// console.log('boardRows', boardRows);
// console.log('boardSpaces', boardSpaces);

