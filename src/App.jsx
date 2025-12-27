import { useState, useEffect } from "react";
import Board from "./components/Board";
import NumberPad from "./components/NumberPad";
import StartPage from "./pages/StartPage";
import RulesPage from "./pages/RulesPage";
import { generatePuzzle } from "./utils/generator";
import { solveSudoku } from "./utils/solver";
import { isValid } from "./utils/validator";
import confetti from "canvas-confetti";
import "./index.css";

/* ================= SOUNDS (FIXED & SAFE) ================= */
const base = import.meta.env.BASE_URL;

const clickSound = new Audio(`${base}sounds/click.mp3`);
clickSound.preload = "auto";
clickSound.volume = 0.4;

const winSound = new Audio(`${base}sounds/win.mp3`);
winSound.preload = "auto";
winSound.volume = 0.6;

export default function App() {
  /* ================= FLOW ================= */
  const [screen, setScreen] = useState("start"); // start | rules | game

  /* ================= GAME STATE ================= */
  const [difficulty, setDifficulty] = useState("easy");
  const [board, setBoard] = useState([]);
  const [fixed, setFixed] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState({});
  const [noteMode, setNoteMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [completedNumber, setCompletedNumber] = useState(null);
  const [errorCell, setErrorCell] = useState(null);
  const [showWinModal, setShowWinModal] = useState(false);

  /* ================= UI STATE ================= */
  const [theme, setTheme] = useState("light");
  const [time, setTime] = useState(0);

  /* ================= STATS ================= */
  const [bestTimes, setBestTimes] = useState(
    JSON.parse(localStorage.getItem("bestTimes")) || {}
  );

  const [wins, setWins] = useState(
    JSON.parse(localStorage.getItem("wins")) || {
      easy: 0,
      medium: 0,
      hard: 0
    }
  );

  /* ================= TIMER ================= */
  useEffect(() => {
    if (screen !== "game") return;
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [screen]);

  /* ================= START GAME ================= */
  const startGame = (level) => {
    const puzzle = generatePuzzle(level);
    setDifficulty(level);
    setBoard(puzzle);
    setFixed(puzzle.map(r => [...r]));
    setNotes({});
    setMistakes(0);
    setSelected(null);
    setCompletedNumber(null);
    setErrorCell(null);
    setShowWinModal(false);
    setTime(0);
    setScreen("game");
  };

  /* ================= UPDATE CELL ================= */
  const updateCell = (num) => {
    if (!selected) return;
    const { r, c } = selected;

    if (fixed[r][c] !== null) return;

    if (num === null) {
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = null;
      setBoard(newBoard);
      return;
    }

    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});

    if (noteMode) {
      const key = `${r}-${c}`;
      const cellNotes = notes[key] || [];
      const updated = cellNotes.includes(num)
        ? cellNotes.filter(n => n !== num)
        : [...cellNotes, num];
      setNotes({ ...notes, [key]: updated });
      return;
    }

    if (!isValid(board, r, c, num)) {
      setMistakes(m => m + 1);
      setErrorCell({ r, c });
      setTimeout(() => setErrorCell(null), 450);
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);

    checkWin(newBoard);
    checkNumberCompletion(newBoard);
  };

  /* ================= HINT ================= */
  const giveHint = () => {
    const solved = solveSudoku(board.map(r => [...r]));
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === null) {
          const newBoard = board.map(row => [...row]);
          newBoard[r][c] = solved[r][c];
          setBoard(newBoard);
          return;
        }
      }
    }
  };

  /* ================= WIN CHECK ================= */
  const checkWin = (b) => {
    if (b.flat().includes(null)) return;
    const solved = solveSudoku(b.map(r => [...r]));
    if (JSON.stringify(b) === JSON.stringify(solved)) {
      winSound.play().catch(() => {});
      confetti({ particleCount: 200, spread: 100 });

      const updatedWins = { ...wins, [difficulty]: wins[difficulty] + 1 };
      setWins(updatedWins);
      localStorage.setItem("wins", JSON.stringify(updatedWins));

      saveBestTime();
      setShowWinModal(true);
    }
  };

  const checkNumberCompletion = (b) => {
    for (let n = 1; n <= 9; n++) {
      let count = 0;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (b[r][c] === n) count++;
        }
      }
      if (count === 9) {
        setCompletedNumber(n);
        setTimeout(() => setCompletedNumber(null), 600);
        return;
      }
    }
  };

  /* ================= BEST TIME ================= */
  const saveBestTime = () => {
    const prev = bestTimes[difficulty];
    if (!prev || time < prev) {
      const updated = { ...bestTimes, [difficulty]: time };
      setBestTimes(updated);
      localStorage.setItem("bestTimes", JSON.stringify(updated));
    }
  };

  /* ================= GAME OVER PAGE ================= */
  if (mistakes >= 3 && screen === "game") {
    return (
      <div className="game-over-page">
        <h1>💀 Game Over</h1>
        <p>You made too many mistakes.</p>
        <button onClick={() => setScreen("start")}>
          🔁 Back to Start Page
        </button>
      </div>
    );
  }

  /* ================= SCREENS ================= */
  return (
    <div className={`screen-wrapper ${screen}`}>
      {screen === "start" && (
        <StartPage
          onStart={() => startGame(difficulty)}
          onRules={() => setScreen("rules")}
          wins={wins}
        />
      )}

      {screen === "rules" && (
        <RulesPage onBack={() => setScreen("start")} />
      )}

      {screen === "game" && (
  <div className={`app ${theme}`}>
    <div className="game-layout">

      {/* ===== HEADER ===== */}
      <header>
        <h1>🧩 Sudoku</h1>
        <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* ===== STATUS BAR ===== */}
      <div className="top">
        <span>⏱ {formatTime(time)}</span>
        <span>❌ Mistakes: {mistakes}/3</span>
        <span>
          🏆 Best:{" "}
          {bestTimes[difficulty]
            ? formatTime(bestTimes[difficulty])
            : "--"}
        </span>
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="controls">
        <select
          value={difficulty}
          onChange={e => startGame(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button onClick={() => setNoteMode(n => !n)}>
          ✏️ Notes: {noteMode ? "ON" : "OFF"}
        </button>

        <button onClick={giveHint}>💡 Hint</button>

        <button
          onClick={() => startGame(difficulty)}
          disabled={showWinModal}
        >
          🔄 Reset
        </button>
      </div>

      {/* ===== BOARD ===== */}
      <Board
        board={board}
        fixed={fixed}
        selected={selected}
        setSelected={setSelected}
        notes={notes}
        completedNumber={completedNumber}
        errorCell={errorCell}
      />

      {/* ===== NUMBER PAD ===== */}
      <NumberPad onSelect={updateCell} />

      {/* ===== WIN MODAL ===== */}
      {showWinModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 You Won!</h2>
            <p>Time: {formatTime(time)}</p>
            <button onClick={() => startGame(difficulty)}>New Game</button>
            <button onClick={() => setShowWinModal(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  </div>
)}

    </div>
  );
}

/* ================= FORMAT TIME ================= */
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
