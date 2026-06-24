import { useEffect, useState } from "react";
import { getScore, setScore } from "../utils/scoreStorage";

const SIZE = 4;
const SCORE_KEY = "game_2048_best";
const emptyBoard = () =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
// Color palette for tiles (classic 2048-ish, theme-friendly)
const TILE_COLORS = {
  0:    { bg: "var(--bg-2, #1e293b)", fg: "transparent" },
  2:    { bg: "#eee4da", fg: "#776e65" },
  4:    { bg: "#ede0c8", fg: "#776e65" },
  8:    { bg: "#f2b179", fg: "#fff" },
  16:   { bg: "#f59563", fg: "#fff" },
  32:   { bg: "#f67c5f", fg: "#fff" },
  64:   { bg: "#f65e3b", fg: "#fff" },
  128:  { bg: "#edcf72", fg: "#fff" },
  256:  { bg: "#edcc61", fg: "#fff" },
  512:  { bg: "#edc850", fg: "#fff" },
  1024: { bg: "#edc53f", fg: "#fff" },
  2048: { bg: "#edc22e", fg: "#fff" },
};
const tileStyle = (v) => TILE_COLORS[v] || { bg: "#3c3a32", fg: "#fff" };
function addRandom(b) {
  const empty = [];
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE; j++)
      if (b[i][j] === 0) empty.push([i, j]);
  if (!empty.length) return b;
  const [x, y] = empty[Math.floor(Math.random() * empty.length)];
  b[x][y] = Math.random() < 0.9 ? 2 : 4;
  return b;
}
const clone = (b) => b.map((r) => [...r]);
const compress = (row) => {
  const a = row.filter((v) => v !== 0);
  while (a.length < SIZE) a.push(0);
  return a;
};
export default function Game2048() {
  const [board, setBoard] = useState(() =>
    addRandom(addRandom(emptyBoard()))
  );
  const [score, setLocalScore] = useState(0);
  const [won, setWon] = useState(false);
  const bestScore = getScore(SCORE_KEY);
  function merge(row) {
    const r = [...row];
    for (let i = 0; i < SIZE - 1; i++) {
      if (r[i] && r[i] === r[i + 1]) {
        r[i] *= 2;
        setLocalScore((s) => s + r[i]);
        if (r[i] === 2048) setWon(true);
        r[i + 1] = 0;
      }
    }
    return r;
  }
  const moveLeft   = (b) => b.map((row) => compress(merge(compress(row))));
  const reverse    = (b) => b.map((row) => [...row].reverse());
  const transpose  = (b) => b[0].map((_, i) => b.map((row) => row[i]));
  const moveRight  = (b) => reverse(moveLeft(reverse(b)));
  const moveUp     = (b) => transpose(moveLeft(transpose(b)));
  const moveDown   = (b) => transpose(moveRight(transpose(b)));
  function handleMove(dir) {
    if (won) return;
    let next;
    if (dir === "left")  next = moveLeft(clone(board));
    if (dir === "right") next = moveRight(clone(board));
    if (dir === "up")    next = moveUp(clone(board));
    if (dir === "down")  next = moveDown(clone(board));
    if (JSON.stringify(next) !== JSON.stringify(board)) {
      setBoard(addRandom(next));
    }
  }
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  handleMove("left");
      if (e.key === "ArrowRight") handleMove("right");
      if (e.key === "ArrowUp")    handleMove("up");
      if (e.key === "ArrowDown")  handleMove("down");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, won]);
  useEffect(() => {
    if (won || board.flat().every((x) => x !== 0)) {
      if (score > bestScore) setScore(SCORE_KEY, score);
    }
  }, [won, board, score, bestScore]);
  const hasEmpty = board.some((r) => r.includes(0));
  const hasMoves = () => {
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE; j++) {
        if (board[i][j] === 0) return true;
        if (j < SIZE - 1 && board[i][j] === board[i][j + 1]) return true;
        if (i < SIZE - 1 && board[i][j] === board[i + 1][j]) return true;
      }
    return false;
  };
  const gameOver = !hasEmpty && !hasMoves();
  function restart() {
    setBoard(addRandom(addRandom(emptyBoard())));
    setLocalScore(0);
    setWon(false);
  }
  return (
    <div className="game">
      <h1 className="game-title">2048</h1>
      <p className="game-subtitle">Use arrow keys. Combine tiles to reach 2048.</p>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Best</span>
          <span className="stat-value">{Math.max(bestScore, score)}</span>
        </div>
      </div>
      {won && <div className="message win">You reached 2048! 🎉</div>}
      {gameOver && !won && <div className="message lose">Game over — score {score}</div>}
      <div className="board-wrap" style={{ margin: "16px auto", background: "#bbada0", borderColor: "#bbada0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 72px)",
            gap: 8,
          }}
        >
          {board.map((row, i) =>
            row.map((cell, j) => {
              const s = tileStyle(cell);
              return (
                <div
                  key={`${i}-${j}`}
                  style={{
                    width: 72,
                    height: 72,
                    background: s.bg,
                    color: s.fg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: cell >= 1024 ? 18 : 24,
                    fontWeight: 700,
                    borderRadius: 8,
                    transition: "background 0.15s",
                  }}
                >
                  {cell || ""}
                </div>
              );
            })
          )}
        </div>
      </div>
      <button onClick={restart} className="btn btn-primary">Restart</button>
    </div>
  );
}