import { useState } from "react";

const PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  function checkWinner(b) {
    for (const [a, c, d] of PATTERNS) {
      if (b[a] && b[a] === b[c] && b[c] === b[d]) return b[a];
    }
    return null;
  }
  function handleClick(i) {
    if (gameOver || board[i]) return;
    const next = [...board];
    next[i] = currentPlayer;
    setBoard(next);
    const w = checkWinner(next);
    if (w) {
      setWinner(w);
      setGameOver(true);
    } else if (!next.includes("")) {
      setWinner("Draw");
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }
  function restartGame() {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setWinner(null);
    setGameOver(false);
  }
  return (
    <div className="game">
      <h1 className="game-title">Tic Tac Toe</h1>
      <p className="game-subtitle">Classic 3-in-a-row. Two players.</p>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Turn</span>
          <span className="stat-value">{gameOver ? "—" : currentPlayer}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Status</span>
          <span className="stat-value">
            {winner === "Draw" ? "Draw" : winner ? `${winner} wins` : "Playing"}
          </span>
        </div>
      </div>
      {winner && (
        <div className={`message ${winner === "Draw" ? "" : "win"}`}>
          {winner === "Draw" ? "It's a draw!" : `${winner} wins!`}
        </div>
      )}
      <div className="board-wrap" style={{ display: "block", maxWidth: 340, margin: "16px auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className="btn"
              style={{
                aspectRatio: "1 / 1",
                fontSize: "2rem",
                padding: 0,
              }}
              aria-label={`Cell ${i + 1}`}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>
      <button onClick={restartGame} className="btn btn-primary" style={{ marginTop: 16 }}>
        Restart
      </button>
    </div>
  );
}
export default TicTacToe;