console.log('javascript loaded');
const boardRows = [...document.querySelectorAll('.board-row')];
const boardSpaces = [...document.querySelectorAll('.playable')];
let activePiece = null;
let activePieceRow = null;

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
  // activePiece.style.cursor = '-webkit-grabbing';
}

function dragoverHandler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function dropHandler(e) {
  e.preventDefault();
  activePieceStart = parseInt(activePiece.parentElement.id);
  activePieceRowStart = parseInt(activePiece.parentElement.parentElement.id);
  activePieceEnd = parseInt(e.target.id);

  // if (activePiece.classList.contains('player-one-piece')) {
  //   console.log('player one!')
  //   if (e.target.childElementCount === 0) {
  //     console.log('checking the children')
  //     if (e.target.parentElement.id > activePieceRow) {
  //       console.log('checking the active row')
  //       e.target.appendChild(activePiece);
  //     }
  //   }
  // }

  // if (activePiece.classList.contains('player-two-piece')) {
  //   console.log('player two!')
  //   if (e.target.childElementCount === 0) {
  //     if (e.target.parentElement.id < activePieceRow) {
  //       e.target.appendChild(activePiece);
  //     }
  //   }
  // }

  if (activePiece.classList.contains('player-one-piece')) {
    console.log('player one!')
    console.log(activePieceEnd)
    if (activePieceRowStart % 2 === 0) {
      console.log('even row')
      if (activePieceStart + 4 === activePieceEnd || activePieceStart + 5 === activePieceEnd) {
        console.log('in the if')
        e.target.appendChild(activePiece);
        activePice = null;
        activePieceRowStart = null;
        activePieceEnd = null;
      }
    }
    if (activePieceRowStart % 2 !== 0) {
      console.log('odd row')
      if (activePieceStart + 3 === activePieceEnd || activePieceStart + 4 === activePieceEnd) {
        console.log('in the if');
        e.target.appendChild(activePiece);
        activePice = null;
        activePieceRowStart = null;
        activePieceEnd = null;
      }
    }
  }

  else {
    console.log('you cannot do that');
  }

  // if (activePiece.classList.contains('player-two-piece')) {
  //   console.log('player two!')
  // }

  // activePiece = null;
}


