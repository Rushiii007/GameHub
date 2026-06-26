import { useEffect, useState } from "react";
import { getScore, setScore as saveScore } from "../utils/scoreStorage";

const SCORE_KEY = "snake_high_score";
const GRID_SIZE = 15;
const CELL = 22;

const initialSnake = () => [
  { x: 5, y: 7 },
  { x: 4, y: 7 },
  { x: 3, y: 7 },
];

const randFood = (snake) => {
  while (true) {
    const f = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) return f;
  }
};

function SnakeGame() {
  const [snake, setSnake] = useState(initialSnake());
  const [food, setFood] = useState(() => randFood(initialSnake()));
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getScore(SCORE_KEY));

  useEffect(() => {
    const handleKey = (e) => {
      const map = {
        ArrowUp: "UP", ArrowDown: "DOWN",
        ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      };
      const opp = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      const dir = map[e.key];
      if (dir && dir !== opp[direction]) setDirection(dir);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, 180);
    return () => clearInterval(interval);
  }, [snake, direction, gameOver]);

  const moveSnake = () => {
    const head = { ...snake[0] };
    if (direction === "RIGHT") head.x += 1;
    if (direction === "LEFT")  head.x -= 1;
    if (direction === "UP")    head.y -= 1;
    if (direction === "DOWN")  head.y += 1;
    if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE) return endGame();
    if (snake.some((s) => s.x === head.x && s.y === head.y)) return endGame();
    const next = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setScore((p) => p + 1);
      setFood(randFood(next));
    } else {
      next.pop();
    }
    setSnake(next);
  };

  const endGame = () => {
    setGameOver(true);
    saveScore(SCORE_KEY, score);
    setHighScore(getScore(SCORE_KEY));
  };

  const restart = () => {
    const s = initialSnake();
    setSnake(s);
    setFood(randFood(s));
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="game">
      <h1 className="game-title">Snake</h1>
      <p className="game-subtitle">Use arrow keys (or WASD). Don't hit the walls or yourself.</p>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Best</span>
          <span className="stat-value">{highScore}</span>
        </div>
      </div>
      {gameOver && <div className="message lose">Game over — score {score}</div>}
      <div className="board-wrap" style={{ margin: "16px auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL}px)`,
            gap: 1,
            background: "var(--border)",
          }}
        >
          {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            return (
              <div
                key={i}
                style={{
                  width: CELL,
                  height: CELL,
                  background: isHead
                    ? "#16a34a"
                    : isSnake
                    ? "#22c55e"
                    : isFood
                    ? "#ef4444"
                    : "var(--bg-2, #1e293b)",
                  borderRadius: isFood ? "50%" : 3,
                }}
              />
            );
          })}
        </div>
      </div>
      <button onClick={restart} className="btn btn-primary">
        {gameOver ? "Play again" : "Restart"}
      </button>
    </div>
  );
}

export default SnakeGame;
