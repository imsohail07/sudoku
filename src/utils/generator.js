import { solveSudoku } from "./solver";

export function generatePuzzle(difficulty="easy") {
  let board = Array.from({ length: 9 }, () => Array(9).fill(null));
  solveSudoku(board);

  let remove =
    difficulty === "easy" ? 35 :
    difficulty === "medium" ? 45 : 55;

  while (remove > 0) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (board[r][c] !== null) {
      board[r][c] = null;
      remove--;
    }
  }
  return board;
}
