'use strict';
// Global variables
const BOMB = '💣';
const FLAGGED = '🚩';
var gBoard = [];
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
  if (gBoard[i][j].isMine) elCell.innerText = '💣';
  else elCell.innerText = gBoard[i][j].minesAroundCount;
}
