export default function NumberPad({ onSelect }) {
  return (
    <div className="pad">
      {[1,2,3,4,5,6,7,8,9].map(n => (
        <button key={n} onClick={() => onSelect(n)}>{n}</button>
      ))}
      <button onClick={() => onSelect(null)}>❌</button>
    </div>
  );
}
