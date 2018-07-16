console.log('javascript loaded');
const boardRows = [...document.querySelectorAll('.board-row')];
const boardSpaces = [...document.querySelectorAll('.playable')];
let activePiece = null;
let activePieceRow = null;

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
  // activePiece.style.cursor = '-webkit-grabbing';
}

function dropHandler(e) {
  e.preventDefault();
  console.log('drop target', e);
  activePieceRow = activePiece.parentElement.parentElement.id;
  
  if (activePiece.classList.contains('player-one-piece')) {
    console.log('player one!')
    if (e.target.childElementCount === 0) {
      if (e.target.parentElement.id > activePieceRow) {
        e.target.appendChild(activePiece);
      }
    }
  }
  
  if (activePiece.classList.contains('player-two-piece')) {
    console.log('player two!')
    if (e.target.childElementCount === 0) {
      if (e.target.parentElement.id < activePieceRow) {
        e.target.appendChild(activePiece);
      }
    }
  }
  activePiece = null;
}

function dragoverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}
