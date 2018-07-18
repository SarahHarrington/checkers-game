console.log('javascript loaded');

const boardRows = [...document.querySelectorAll('.board-row')];
const boardSpaces = [...document.querySelectorAll('.playable')];
const capturedPieces = document.querySelector('.captured-pieces');
let activePiece = null;
let activePieceRow = null;
let jumpedSpace = null;
let jumpedPiece = null;

for (let i = 0; i < boardSpaces.length; i++) {
  boardSpaces[i].setAttribute('id', i + 1);
  boardSpaces[i].setAttribute('ondrop', 'dropHandler(event)');
  boardSpaces[i].setAttribute('ondragover', 'dragoverHandler(event)');
}

for (let i = 0; i <= 11; i++) {
  let playerOnePiece = document.createElement('div');
  playerOnePiece.classList.add('player-one-piece');
  playerOnePiece.setAttribute('draggable', true);
  playerOnePiece.setAttribute('ondragstart', 'dragStartHandler(event)')
  boardSpaces[i].appendChild(playerOnePiece);
}

for (let i = 20; i <= 31; i++) {
  let playerTwoPiece = document.createElement('div');
  playerTwoPiece.classList.add('player-two-piece');
  playerTwoPiece.setAttribute('draggable', true);
  playerTwoPiece.setAttribute('ondragstart', 'dragStartHandler(event)')
  boardSpaces[i].appendChild(playerTwoPiece);
}

function dragStartHandler(e) {
  activePiece = e.target;
}

function dragoverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function dropHandler(e) {
  e.preventDefault();
}
