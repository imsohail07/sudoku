import Cell from "./Cell";

export default function Board({
  board,
  fixed,
  selected,
  setSelected,
  notes,
  completedNumber,
  errorCell
}) {
  const selectedValue =
    selected && board[selected.r][selected.c];

  return (
    <div className="board">
      {board.map((row, r) =>
        row.map((val, c) => {
          const key = `${r}-${c}`;

          const isSameRow = selected?.r === r;
          const isSameCol = selected?.c === c;
          const isSameBlock =
            Math.floor(selected?.r / 3) === Math.floor(r / 3) &&
            Math.floor(selected?.c / 3) === Math.floor(c / 3);

          const sameNumberHighlight =
            selectedValue && val === selectedValue;

          const isError =
            errorCell?.r === r && errorCell?.c === c;

          return (
            <Cell
              key={key}
              value={val}
              row={r}
              col={c}
              isFixed={fixed[r][c] !== null}
              isSelected={selected?.r === r && selected?.c === c}
              notes={notes[key] || []}
              completed={val === completedNumber}
              error={isError}
              highlight={isSameRow || isSameCol || isSameBlock}
              sameNumber={sameNumberHighlight}
              onClick={() => setSelected({ r, c })}
            />
          );
        })
      )}
    </div>
  );
}
