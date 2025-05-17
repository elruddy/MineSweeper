function renderBoard(mat, selector) {
  var strHTML = '<table><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      strHTML += `<td onclick="onCellClicked(this, ${i},  ${j})" id="cell-${i}-${j}" class="cell"></td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  const elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}
