console.log('javascript loaded');

const boardRows = [...document.querySelectorAll('.board-row')];
const boardSpaces = [...document.querySelectorAll('.playable')];
const capturedPieces = document.querySelector('.captured-pieces');
let activePiece = null;
let activePieceRow = null;
let jumpedSpace = null;
let jumpedPiece = null;

console.log(validMoves);

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

  if (e.target.children.length < 1) {
    if (activePiece.classList.contains('player-one-piece')) {
      console.log('player one!')
      if (activePieceStart + 7 === activePieceEnd) {
        console.log('active start, active end', activePieceStart, activePieceEnd)
        console.log('jumping + 7')
        jumpedSpace = document.getElementById(`${activePieceStart + 4}`);
        if (jumpedSpace.children.length > 0) {
          e.target.appendChild(activePiece);
          jumpedPiece = jumpedSpace.children[0];
          console.log('jumped space', jumpedSpace);
          console.log('jumped piece', jumpedPiece);
          jumpedSpace.removeChild(jumpedPiece);
          capturedPieces.appendChild(jumpedPiece);
        }
      }

      if (activePieceStart + 9 === activePieceEnd) {
        console.log('active start, active end', activePieceStart, activePieceEnd)
        console.log('jumping + 9')
        jumpedSpace = document.getElementById(`${activePieceStart + 5}`);
        if (jumpedSpace.children.length > 0) {
          e.target.appendChild(activePiece);
          jumpedPiece = jumpedSpace.children[0];
          console.log('jumped space', jumpedSpace);
          console.log('jumped piece', jumpedPiece);
          jumpedSpace.removeChild(jumpedPiece);
          capturedPieces.appendChild(jumpedPiece);
        }
      }

      if (activePieceRowStart % 2 === 0) {
        console.log('even row')
        if (activePieceStart + 4 === activePieceEnd || activePieceStart + 5 === activePieceEnd) {
          console.log('in the if')
          e.target.appendChild(activePiece);
        }

      }
      if (activePieceRowStart % 2 !== 0) {
        console.log('odd row')
        if (activePieceStart + 3 === activePieceEnd || activePieceStart + 4 === activePieceEnd) {
          console.log('in the if');
          e.target.appendChild(activePiece);
        }
      }
    }
  }

  //player two logic
  if (activePiece.classList.contains('player-two-piece')) {
    console.log('player one!')
    console.log(activePieceEnd)

    if (activePieceStart - 7 === activePieceEnd) {
      console.log('active start, active end', activePieceStart, activePieceEnd);
      console.log('jumping - 7');
      jumpedSpace = document.getElementById(`${activePieceStart - 3}`);
      if (jumpedSpace.children.length > 0) {
        e.target.appendChild(activePiece);
        jumpedPiece = jumpedSpace.children[0];
        console.log('jumped space', jumpedSpace);
        console.log('jumped piece', jumpedPiece);
        jumpedSpace.removeChild(jumpedPiece);
        capturedPieces.appendChild(jumpedPiece);
      }
    }
    if (activePieceStart - 9 === activePieceEnd) {
      console.log('active start, active end', activePieceStart, activePieceEnd);
      console.log('jumping - 9');
      jumpedSpace = document.getElementById(`${activePieceStart - 4}`);
      if (jumpedSpace.children.length > 0) {
        e.target.appendChild(activePiece);
        jumpedPiece = jumpedSpace.children[0];
        console.log('jumped space', jumpedSpace);
        console.log('jumped piece', jumpedPiece);
        jumpedSpace.removeChild(jumpedPiece);
        capturedPieces.appendChild(jumpedPiece);
      }
    }
    if (activePieceRowStart % 2 === 0) {
      console.log('even row')
      if (activePieceStart - 4 === activePieceEnd || activePieceStart - 3 === activePieceEnd) {
        console.log('in the if')
        e.target.appendChild(activePiece);
      }
    }
    if (activePieceRowStart % 2 !== 0) {
      console.log('odd row')
      if (activePieceStart - 5 === activePieceEnd || activePieceStart - 4 === activePieceEnd) {
        console.log('in the if');
        e.target.appendChild(activePiece);
      }
    }
  }
  [activePiece, activePieceRowStart, activePieceEnd, jumpedSpace, jumpedPiece] = [null, null, null, null, null];
}
