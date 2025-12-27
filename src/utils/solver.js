export function solveSudoku(board) {
  const findEmpty = () => {
    for (let r=0;r<9;r++)
      for (let c=0;c<9;c++)
        if (board[r][c] === null) return [r,c];
    return null;
  };

  const isSafe = (r,c,n) => {
    for (let i=0;i<9;i++)
      if (board[r][i]===n || board[i][c]===n) return false;

    const br=Math.floor(r/3)*3, bc=Math.floor(c/3)*3;
    for (let i=br;i<br+3;i++)
      for (let j=bc;j<bc+3;j++)
        if (board[i][j]===n) return false;

    return true;
  };

  const solve = () => {
    const pos = findEmpty();
    if (!pos) return true;
    const [r,c] = pos;

    for (let n=1;n<=9;n++) {
      if (isSafe(r,c,n)) {
        board[r][c]=n;
        if (solve()) return true;
        board[r][c]=null;
      }
    }
    return false;
  };

  solve();
  return board;
}
