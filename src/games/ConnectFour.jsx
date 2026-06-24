import { useState } from "react";

const ROWS = 6;
const COLS = 7;
const createBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));
export default function ConnectFour() {
  const [board, setBoard] = useState(createBoard());
  const [player, setPlayer] = useState(1); // 1 = Red, -1 = Yellow
  const [winner, setWinner] = useState(null);
  const colors = { 1: "#ef4444", "-1": "#facc15" };
  const names = { 1: "Red", "-1": "Yellow" };
  const dropPiece = (col) => {
    if (winner) return;
    const next = board.map((row) => [...row]);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (next[r][col] === null) {
        next[r][col] = player;
        break;
      }
    }
    setBoard(next);
    if (checkWin(next, player)) setWinner(player);
    else setPlayer(player * -1);
  };
  const checkWin = (b, p) => {
    const eq = (a, b, c, d) => a === p && b === p && c === p && d === p;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS - 3; c++)
        if (eq(b[r][c], b[r][c + 1], b[r][c + 2], b[r][c + 3])) return true;
    for (let r = 0; r < ROWS - 3; r++)
      for (let c = 0; c < COLS; c++)
        if (eq(b[r][c], b[r + 1][c], b[r + 2][c], b[r + 3][c])) return true;
    for (let r = 0; r < ROWS - 3; r++)
      for (let c = 0; c < COLS - 3; c++)
        if (eq(b[r][c], b[r + 1][c + 1], b[r + 2][c + 2], b[r + 3][c + 3])) return true;
    for (let r = 3; r < ROWS; r++)
      for (let c = 0; c < COLS - 3; c++)
        if (eq(b[r][c], b[r - 1][c + 1], b[r - 2][c + 2], b[r - 3][c + 3])) return true;
    return false;
  };
  const resetGame = () => {
    setBoard(createBoard());
    setPlayer(1);
    setWinner(null);
  };
  return (
    <div className="game">
      <h1 className="game-title">Connect Four</h1>
      <p className="game-subtitle">Click a column to drop your piece. Four in a row wins.</p>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Turn</span>
          <span className="stat-value" style={{ color: winner ? "var(--text)" : colors[player] }}>
            {winner ? "—" : names[player]}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Status</span>
          <span className="stat-value">{winner ? `${names[winner]} wins` : "Playing"}</span>
        </div>
      </div>
      {winner && (
        <div className="message win">{names[winner]} player wins 🎉</div>
      )}
      <div style={{ margin: "16px 0" }}>
        <div className="board-wrap" style={{ background: "#1e3a8a", borderColor: "#1e3a8a" }}>
          {board.map((row, rIdx) => (
            <div key={rIdx} style={{ display: "flex" }}>
              {row.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  onClick={() => dropPiece(cIdx)}
                  style={{
                    width: 44,
                    height: 44,
                    margin: 3,
                    borderRadius: "50%",
                    background: cell ? colors[cell] : "var(--bg-1, #0f172a)",
                    cursor: winner ? "default" : "pointer",
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <button onClick={resetGame} className="btn btn-primary">Restart</button>
    </div>
  );
}