'use strict';
// Global variables
const BOMB = '💣';
const FLAGGED = '🚩';
var gBoard = [];
var currentTrys;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function onInit() {
  gBoard = [];
  gGame = {
    isOn: true,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  var smilyButton = document.getElementById('smilyBtn');
  smilyButton.innerText = '😄';
  buildBoard();
  setMines(gLevel.MINES);
  setMinesNegsCount();
  renderBoard(gBoard, '.board-container');
}

function buildBoard() {
  for (var i = 0; i < gLevel.SIZE; i++) {
    gBoard.push([]);
    for (var j = 0; j < gLevel.SIZE; j++) {
      gBoard[i].push({
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false,
      });
    }
  }
}

function setMines(noMines) {
  while (noMines > 0) {
    for (var i = 0; i < gLevel.SIZE && noMines > 0; i++) {
      for (var j = 0; j < gLevel.SIZE && noMines > 0; j++) {
        if (Math.random() > 0.8 && !gBoard[i][j].isMine) {
          gBoard[i][j].isMine = true;
          noMines--;
        }
      }
    }
  }
}

function setMinesNegsCount() {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isMine) continue;

      gBoard[i][j].minesAroundCount = getNegsCount(i, j);
    }
  }
}

function getNegsCount(row, col) {
  var count = 0;

  for (var i = row - 1; i < row + 2; i++) {
    for (var j = col - 1; j < col + 2; j++) {
      if (i < 0 || j < 0 || i >= gLevel.SIZE || j >= gLevel.SIZE) continue;

      // I don't skip my own position because i am 100% not a mine
      if (gBoard[i][j].isMine) count++;
    }
  }

  return count;
}

function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return;
  if (gBoard[i][j].isMine) mineClicked(elCell);
  else revealNoneMineCell(elCell, i, j);
}

function expandReveal(row, col) {
  for (var i = row - 1; i < row + 2; i++) {
    for (var j = col - 1; j < col + 2; j++) {
      if (i < 0 || j < 0 || i >= gLevel.SIZE || j >= gLevel.SIZE) continue;
      if (
        gBoard[i][j].isMine ||
        gBoard[i][j].isRevealed ||
        gBoard[i][j].isMarked
      )
        continue;

      var currCell = document.getElementById(`cell-${i}-${j}`);
      revealNoneMineCell(currCell, i, j);
    }
  }
}

function mineClicked(elCell) {
  elCell.classList.add('revealed-mine');
  elCell.innerText = BOMB;
  revealAllMines();
}

function revealAllMines() {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      if (!gBoard[i][j].isMine) continue;
      var elMine = document.getElementById(`cell-${i}-${j}`);
      elMine.innerText = BOMB;
      elMine.classList.add('revealed');
    }
  }
  gameOver();
}

function onCellMarked(event, elCell, i, j) {
  if (!gGame.isOn) return;
  event.preventDefault();
  console.log('HEY');
  elCell.classList.add('marked');
  elCell.isMarked = true;
  elCell.innerText = FLAGGED;
  gGame.markedCount++;
  var elBombsNo = document.getElementById('bombsTrys');
  elBombsNo.innerText = gLevel.MINES - gGame.markedCount;
}

function chosenLevel(elButton) {
  console.log(elButton);
  console.log(elButton.innerText);
  if (elButton.innerText === 'Beginner') {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    onInit();
  }
  if (elButton.innerText === 'Medium') {
    gLevel.SIZE = 8;
    gLevel.MINES = 14;
    onInit();
  }
  if (elButton.innerText === 'Expert') {
    gLevel.SIZE = 12;
    gLevel.MINES = 32;
    onInit();
  }
  var elBombsNo = document.getElementById('bombsTrys');
  elBombsNo.innerText = gLevel.MINES;
}

function gameOver() {
  var smilyButton = document.getElementById('smilyBtn');
  smilyButton.innerText = '😵';
  gGame.isOn = false;
}
