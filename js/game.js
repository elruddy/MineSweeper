'use strict';
// Global variables
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
