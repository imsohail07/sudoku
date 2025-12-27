import "./RulesPage.css";

export default function RulesPage({ onBack }) {
  return (
    <div className="rules-page">
      <div className="rules-card">
        <h1 className="rules-title">🧩 Sudoku Rules</h1>
        <p className="rules-subtitle">
          Follow these simple rules to master the game
        </p>

        <ul className="rules-list">
          <li>Each row must contain the numbers <b>1 to 9</b> exactly once.</li>
          <li>Each column must contain the numbers <b>1 to 9</b> exactly once.</li>
          <li>Each 3×3 sub-grid must contain the numbers <b>1 to 9</b> exactly once.</li>
          <li>No number may repeat in a row, column, or sub-grid.</li>
          <li>Numbers given at the start <b>cannot be changed</b>.</li>
          <li>Every puzzle has <b>one unique solution</b>.</li>
          <li>Use logic and deduction — guessing is discouraged.</li>
          <li>You may use pencil notes to plan your moves.</li>
          <li>Hints reveal a correct value for one empty cell.</li>
          <li>Wrong moves increase the mistake counter.</li>
          <li>Three mistakes will end the game.</li>
          <li>Fill all cells correctly to win the puzzle.</li>
        </ul>

        <button className="back-btn" onClick={onBack}>
          ⬅ Back to Start
        </button>
      </div>
    </div>
  );
}
