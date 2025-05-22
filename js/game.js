'use strict';
// Global variables
const BOMB = '💣';
const FLAGGED = '🚩';
var gBoard = [];
var currentTrys;
var timerInterval;
var hintUsed;
var mineLiveInterval;
var gLevel = {
  SIZE: 4,
  MINES: 2,
  HEARTS: 1,
};
var gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0,
  livesLost: 0,
};

function onInit() {
  gBoard = [];
  gGame = {
    isOn: true,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesLost: 0,
  };
  var smilyButton = document.getElementById('smilyBtn');
  smilyButton.innerText = '😄';
  buildBoard();
  //setMines(gLevel.MINES);
  //setMinesNegsCount();
  renderBoard(gBoard, '.board-container');
  updateBombsNumberView(gLevel.MINES);
  resetTimer();
  printLives();
}

function resetTimer() {
  var elTimer = document.getElementById('timer');
  elTimer.innerText = 0;
  clearInterval(timerInterval);
  timerInterval = undefined;
}

function updateTimer() {
  gGame.secsPassed++;
  var elTimer = document.getElementById('timer');
  elTimer.innerText = gGame.secsPassed;
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

function setMines(noMines, row, col) {
  while (noMines > 0) {
    for (var i = 0; i < gLevel.SIZE && noMines > 0; i++) {
      for (var j = 0; j < gLevel.SIZE && noMines > 0; j++) {
        if (i === row && j === col) continue;
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
  if (gGame.revealedCount === 0) {
    setMines(gLevel.MINES, i, j);
    setMinesNegsCount();
  }
  if (!gGame.isOn || gBoard[i][j].isMarked || gBoard[i][j].isRevealed) return;

  if (hintUsed) {
    // reveal the surroundings
    revealSurroundings(i, j);
    hintUsed.remove();
    hintUsed = null;
    return;
  }

  if (!timerInterval) timerInterval = setInterval(updateTimer, 1000);

  if (gBoard[i][j].isMine) mineClicked(elCell);
  else {
    revealNoneMineCell(elCell, i, j);
    checkVictory();
  }
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

  if (gLevel.HEARTS - gGame.livesLost === 0) {
    revealAllMines(BOMB, 'revealed', true);
    gameOver('😵');
  } else {
    gGame.livesLost++;
    printLives();

    mineLiveInterval = setTimeout(() => {
      elCell.classList.remove('revealed-mine');
      elCell.innerText = '';
    }, 1000);
  }
}

function revealAllMines(innerText, cssClass, isLose) {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      if (!gBoard[i][j].isMine) continue;

      var elMine = document.getElementById(`cell-${i}-${j}`);
      elMine.innerText = innerText;
      elMine.classList.add(cssClass);

      if (gBoard[i][j].isMarked && isLose) elMine.classList.add('crossed');
    }
  }
}

function onCellMarked(event, elCell, i, j) {
  if (!gGame.isOn || gBoard[i][j].isRevealed) return;

  var totalRemainingBombs = gLevel.MINES - gGame.markedCount;
  if (totalRemainingBombs === 0 && !gBoard[i][j].isMarked) return;

  event.preventDefault();

  gBoard[i][j].isMarked = !gBoard[i][j].isMarked;

  if (gBoard[i][j].isMarked) {
    elCell.classList.add('marked');
    elCell.innerText = FLAGGED;
    gGame.markedCount++;
  } else {
    elCell.classList.remove('marked');
    elCell.innerText = '';
    gGame.markedCount--;
  }

  totalRemainingBombs = gLevel.MINES - gGame.markedCount;
  updateBombsNumberView(totalRemainingBombs);
}

function chosenLevel(elButton) {
  if (elButton.innerText === 'Beginner') {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    gLevel.HEARTS = 1;
  }
  if (elButton.innerText === 'Medium') {
    gLevel.SIZE = 8;
    gLevel.MINES = 14;
    gLevel.HEARTS = 3;
  }
  if (elButton.innerText === 'Expert') {
    gLevel.SIZE = 12;
    gLevel.MINES = 32;
    gLevel.HEARTS = 3;
  }

  onInit();
}

function gameOver(emoji) {
  var smilyButton = document.getElementById('smilyBtn');
  smilyButton.innerText = emoji;
  gGame.isOn = false;
  clearInterval(timerInterval);
  clearInterval(mineLiveInterval);
}

function checkVictory() {
  if (gLevel.SIZE * gLevel.SIZE - gGame.revealedCount === gLevel.MINES) {
    revealAllMines(FLAGGED, 'marked', false);
    gameOver('😎');
  }
}

function printLives() {
  var currLives = gLevel.HEARTS - gGame.livesLost;

  var text = '';

  for (var i = 0; i < currLives; i++) {
    text = text + '♥︎';
  }

  var lifePlaceHolder = document.getElementById('lives');
  lifePlaceHolder.classList.remove('no-more-lives');

  if (text === '') {
    text = 'No more chances.';
    lifePlaceHolder.classList.add('no-more-lives');
  }

  lifePlaceHolder.innerText = text;
}

function hintClicked(elHint) {
  elHint.style.backgroundColor = 'yellow';
  hintUsed = elHint;
}

function revealSurroundings(row, col) {
  for (var i = row - 1; i < row + 2; i++) {
    for (var j = col - 1; j < col + 2; j++) {
      if (i < 0 || j < 0 || i >= gLevel.SIZE || j >= gLevel.SIZE) continue;
      if (gBoard[i][j].isRevealed) continue;

      var currCell = document.getElementById(`cell-${i}-${j}`);

      if (gBoard[i][j].isMine) {
        currCell.classList.add('revealed-mine');
        currCell.innerText = BOMB;
      } else {
        currCell.classList.add(`around-${gBoard[i][j].minesAroundCount}`);
        currCell.classList.add('revealed');
        currCell.innerText = gBoard[i][j].minesAroundCount;
      }

      removeHintedSurroundings(i, j, currCell);
    }
  }
}

function removeHintedSurroundings(i, j, celElement) {
  setTimeout(() => {
    celElement.classList.remove('revealed-mine');
    celElement.classList.remove(`around-${gBoard[i][j].minesAroundCount}`);
    celElement.classList.remove('revealed');
    celElement.innerText = '';

    if (gBoard[i][j].isMarked) celElement.innerText = FLAGGED;
  }, 1500);
}
