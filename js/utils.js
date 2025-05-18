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
