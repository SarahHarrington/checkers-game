console.log('javascript loaded');
const boardRows = [...document.querySelectorAll('.board-row')];
const boardSpaces = [...document.querySelectorAll('.playable')];
let activePiece = null;

for (let i = 0; i < boardSpaces.length; i++) {
  boardSpaces[i].setAttribute('id', `space-${i}`);
  boardSpaces[i].setAttribute('ondrop', 'dropHandler(event)');
  boardSpaces[i].setAttribute('ondragover', 'dragoverHandler(event)');
}

for (let i = 0; i <= 11; i++) {
  let playerOnePiece = document.createElement('div');
  playerOnePiece.classList.add('player-one-piece');
  playerOnePiece.setAttribute('draggable', true);
  playerOnePiece.setAttribute('ondragstart', 'dragStartHandler(event)')
  playerOnePiece.addEventListener('click', pieceSelected)
  boardSpaces[i].appendChild(playerOnePiece);
}

for (let i = 20; i <= 31; i++) {
  let playerTwoPiece = document.createElement('div');
  playerTwoPiece.classList.add('player-two-piece');
  playerTwoPiece.setAttribute('draggable', true);
  playerTwoPiece.setAttribute('ondragstart', 'dragStartHandler(event)')
  playerTwoPiece.addEventListener('click', pieceSelected)
  boardSpaces[i].appendChild(playerTwoPiece);
}

function pieceSelected(e) {
  console.log(e.target.parentElement.parentElement.id) // logging id of parent element
  console.log(e.target.parentElement.id)

  if (e.target.classList.contains('player-one-piece')) {
    console.log('player one!')
  }
  if (e.target.classList.contains('player-two-piece')) {
    console.log('player two!')
  }
}

function dragStartHandler(e) {
  activePiece = e.target;
}

function dropHandler(e) {
  e.preventDefault();
  console.log('drop spot', e.target.parentElement.id);
  
  e.target.appendChild(activePiece);
  activePiece = null;
}

function dragoverHandler(e) {
  e.preventDefault();
  console.log('dragging over', e.target.id)
  e.dataTransfer.dropEffect = "move";
}
