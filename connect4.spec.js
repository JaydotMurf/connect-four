describe('createBoard', () => {
  const WIDTH = 9;
  const HEIGHT = 8;
  let board;
  function createBoard() {
    for (let i = 0; i < HEIGHT; i++) {
      board.push(Array(WIDTH).fill(null));
    }
  }
  beforeEach(() => {
    board = [];
  });

  it('should create a board with the correct number of rows', () => {
    createBoard();
    expect(board.length).toEqual(HEIGHT);
  });

  it('creates a board with the correct number of columns', () => {
    createBoard();
    expect(board.every((row) => row.length === WIDTH)).toBeTruthy();
  });

  it('creates a board with null values in every cell', () => {
    createBoard();
    expect(board.every((row) => row.every((cell) => cell === null))).toEqual(
      true
    );
  });
});
