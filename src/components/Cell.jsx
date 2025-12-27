export default function Cell({
  value,
  row,
  col,
  isFixed,
  isSelected,
  onClick,
  notes = [],
  completed,
  highlight,
  sameNumber,
  error
}) {
  return (
    <div
      className={`cell
        ${isSelected ? "selected" : ""}
        ${highlight ? "region-highlight" : ""}
        ${sameNumber ? "same-number" : ""}
        ${completed ? "blink" : ""}
        ${error ? "error" : ""}
        ${!isFixed && value ? "entry" : ""}
        ${row % 3 === 0 ? "thick-top" : ""}
        ${col % 3 === 0 ? "thick-left" : ""}
        ${error ? "error-glow" : ""}

      `}
      onClick={onClick}
    >
      {value ? (
        <span>{value}</span>
      ) : (
        <div className="notes">
          {notes.map(n => <span key={n}>{n}</span>)}
        </div>
      )}
    </div>
  );
}
