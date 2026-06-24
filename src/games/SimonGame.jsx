import { useEffect, useState } from "react";
import { getScore, setScore } from "../utils/scoreStorage";

const COLORS = ["red", "blue", "green", "yellow"];
const COLOR_HEX = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
};
const SCORE_KEY = "simon_best_level";
export default function SimonGame() {
  const best = getScore(SCORE_KEY);
  const [sequence, setSequence] = useState([]);
  const [userIndex, setUserIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [flashColor, setFlashColor] = useState(null);
  const [message, setMessage] = useState("Press Start to begin");
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState(""); // "win" | "lose" | ""
  const randColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];
  const startGame = () => {
    setSequence([randColor()]);
    setUserIndex(0);
    setLevel(1);
    setStarted(true);
    setStatus("");
    setMessage("Watch carefully...");
  };
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setFlashColor(sequence[i]);
      setTimeout(() => setFlashColor(null), 400);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setMessage("Your turn");
      }
    }, 700);
    return () => clearInterval(interval);
  }, [sequence, started]);
  const handleClick = (color) => {
    if (!started) return;
    const current = sequence[userIndex];
    if (color !== current) {
      setMessage(`Game over at level ${level}`);
      setStatus("lose");
      setStarted(false);
      if (level > best) setScore(SCORE_KEY, level);
      return;
    }
    if (userIndex + 1 === sequence.length) {
      const newLevel = sequence.length + 1;
      setLevel(newLevel);
      setMessage("Nice — next round...");
      setTimeout(() => {
        setSequence((prev) => [...prev, randColor()]);
        setUserIndex(0);
        setMessage("Watch carefully...");
      }, 700);
    } else {
      setUserIndex(userIndex + 1);
    }
  };
  return (
    <div className="game">
      <h1 className="game-title">Simon</h1>
      <p className="game-subtitle">Repeat the growing color sequence.</p>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Level</span>
          <span className="stat-value">{level}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Best</span>
          <span className="stat-value">{best}</span>
        </div>
      </div>
      <div className={`message ${status}`}>{message}</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px 120px",
          gap: 12,
          justifyContent: "center",
          margin: "24px 0",
        }}
      >
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleClick(color)}
            disabled={!started}
            aria-label={color}
            style={{
              width: 120,
              height: 120,
              background: COLOR_HEX[color],
              opacity: flashColor === color ? 1 : 0.55,
              border: "none",
              borderRadius: 16,
              cursor: started ? "pointer" : "not-allowed",
              transition: "opacity 0.15s, transform 0.1s",
              transform: flashColor === color ? "scale(1.05)" : "scale(1)",
              boxShadow: flashColor === color ? `0 0 24px ${COLOR_HEX[color]}` : "none",
            }}
          />
        ))}
      </div>
      {!started && (
        <button onClick={startGame} className="btn btn-primary">
          {level > 0 ? "Play again" : "Start game"}
        </button>
      )}
    </div>
  );
}