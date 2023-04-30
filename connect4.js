document.addEventListener('DOMContentLoaded', function () {
  /** Connect Four
   *
   * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
   * column until a player gets four-in-a-row (horiz, vert, or diag) or until
   * board fills (tie)
   */

  const WIDTH = 7;
  const HEIGHT = 6;

  let currPlayer = 1; // active player: 1 or 2
  const board = []; // array of rows, each row is array of cells  (board[y][x])

  /** createBoard: create in-JS board structure:
   *    board = array of rows, each row is array of cells  (board[y][x])
   */
  function createBoard() {
    for (let i = 0; i < HEIGHT; i++) {
      board.push(Array(WIDTH).fill(null));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  function makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');
    // const resetButton = document.getElementById('reset-button');
    // resetButton.addEventListener('click', resetGame);

    // * create top table row, set id and add event listener
    const topRow = document.createElement('tr');
    topRow.setAttribute('id', 'column-top');
    topRow.addEventListener('click', handleClick);

    // * make the top row cells clickable and add to topRow
    for (let x = 0; x < WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      topRow.append(headCell);
    }
    htmlBoard.append(topRow);

    // * create HTML table rows and cells for the game board
    for (let y = 0; y < HEIGHT; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        cell.classList.add('data-square');
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  /** handleClick: handle click of column top to play piece */
  function handleClick(evt) {
    // get x from ID of clicked cell
    let x = +evt.target.id;

    // handle click on top row cell by triggering click on lowest empty cell in column
    let y = findSpotForCol(x);
    if (y !== null) {
      // place piece in board and add to HTML table
      placeInTable(y, x);
    }

    // check for win
    if (checkForWin()) {
      resetGame();
      return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    const isTie = board.every((row) => row.every((cell) => cell === 'taken'));
    if (isTie) {
      return endGame('Tie!');
    }

    // switch players
    currPlayer = currPlayer === 1 ? 2 : 1;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  function placeInTable(y, x) {
    const gamePiece = document.createElement('div');
    gamePiece.classList.add('piece');
    gamePiece.classList.add(currPlayer === 1 ? 'player1' : 'player2');

    // Place gamePiece into correct column
    let boardSpace = document.getElementById(`${y}-${x}`);
    // board[y][x] = 'taken';
    board[y][x] = currPlayer;
    boardSpace.append(gamePiece);
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  function findSpotForCol(x) {
    // start at the bottom of the column and iterate upward until you find the first empty spot
    for (let y = HEIGHT - 1; y >= 0; y--) {
      if (board[y][x] === null) {
        return y;
      }
    }
    // if column is full, return null to indicate it is filled
    return null;
  }

  /** endGame: announce game end */
  function endGame(msg) {
    alert(msg);
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  function checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < HEIGHT &&
          x >= 0 &&
          x < WIDTH &&
          board[y][x] === currPlayer
      );
    }

    // Iterate over all possible starting points for winning combinations
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        // Check all possible winning combinations starting from this point
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }

    // If no winning combination was found, return false
    return false;
  }

  function resetGame() {
    // Clear the board
    board.forEach((row) => row.fill(null));
    const gamePieces = document.querySelectorAll('.piece');
    gamePieces.forEach((piece) => piece.remove());

    // Reset game state
    currPlayer = 1;

    // Update the HTML board to reflect the cleared board
    const htmlCells = document.querySelectorAll('.data-square');
    htmlCells.forEach((cell) => {
      cell.classList.remove('player1');
      cell.classList.remove('player2');
    });
  }
  createBoard();
  makeHtmlBoard();
});
