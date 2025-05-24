function renderBoard(mat, selector) {
  var strHTML = '<table><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      strHTML += `<td oncontextmenu="onCellMarked(event, this, ${i}, ${j})" onclick="onCellClicked(this, ${i}, ${j})" id="cell-${i}-${j}" class="cell"></td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  const elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderHints() {
  var elHints = document.getElementById('hints-container');

  var hints = `<img
          onclick="hintClicked(this)"
          class="hints"
          id="hint1"
          src="./img/lightbulb.png"
        />
        <img
          onclick="hintClicked(this)"
          class="hints"
          id="hint2"
          src="./img/lightbulb.png"
        />
        <img
          onclick="hintClicked(this)"
          class="hints"
          id="hint3"
          src="./img/lightbulb.png"
        />`;

  elHints.innerHTML = hints;
}

function revealNoneMineCell(elCell, i, j) {
  gBoard[i][j].isRevealed = true;
  elCell.classList.add(`around-${gBoard[i][j].minesAroundCount}`);
  elCell.classList.add('revealed');
  gGame.revealedCount++;
  elCell.innerText = gBoard[i][j].minesAroundCount;

  if (gBoard[i][j].minesAroundCount === 0) {
    expandReveal(i, j);
  }
}

function updateBombsNumberView(totalNumber) {
  var elBombsNo = document.getElementById('bombsTrys');
  elBombsNo.innerText = totalNumber;
}

function setTopScoreIfNeeded(time, level) {
  var currentTop = getTopScore(level);
  var newTop = time;

  if (currentTop && time > currentTop) {
    newTop = currentTop;
  }

  localStorage.setItem(`top-score-${level}`, newTop);
}

function getTopScore(level) {
  var bestTime = localStorage.getItem(`top-score-${level}`);
  console.log({ bestTime });
  if (bestTime) return Number(bestTime);

  return null;
}
