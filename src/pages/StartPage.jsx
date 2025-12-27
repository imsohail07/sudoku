import "./StartPage.css";

export default function StartPage({ onStart, onRules, wins = {} }) {
  // ✅ defensive fallback to avoid undefined errors
  const safeWins = {
    easy: wins.easy ?? 0,
    medium: wins.medium ?? 0,
    hard: wins.hard ?? 0
  };

  return (
    <div className="start-page light">
      <div className="start-card">
        <h1 className="title">Sudoku</h1>
        <p className="subtitle">Sharpen your logic skills</p>

        <div className="stats">
          <p>Easy wins: {safeWins.easy}</p>
          <p>Medium wins: {safeWins.medium}</p>
          <p>Hard wins: {safeWins.hard}</p>
        </div>

        <button className="primary" onClick={onStart}>
          ▶ Start Game
        </button>

        <button className="secondary" onClick={onRules}>
          📜 Rules
        </button>
      </div>
    </div>
  );
}
