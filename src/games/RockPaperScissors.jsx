import { useState } from "react";

const CHOICES = ["rock", "paper", "scissors"];
const ICONS = { rock: "✊", paper: "✋", scissors: "✌️" };
const RULES = { rock: "scissors", paper: "rock", scissors: "paper" };

export default function RockPaperScissors() {
  const [userScore, setUserScore] = useState(0);
  const [compScore, setCompScore] = useState(0);
  const [msg, setMsg] = useState("Pick your move");
  const [status, setStatus] = useState("");

  const playGame = (userChoice) => {
    const compChoice = CHOICES[Math.floor(Math.random() * 3)];
    if (userChoice === compChoice) {
      setMsg(`Draw — both chose ${compChoice}`);
      setStatus("");
      return;
    }
    if (RULES[userChoice] === compChoice) {
      setUserScore((p) => p + 1);
      setMsg(`You win! ${userChoice} beats ${compChoice}`);
      setStatus("win");
    } else {
      setCompScore((p) => p + 1);
      setMsg(`You lose. ${compChoice} beats ${userChoice}`);
      setStatus("lose");
    }
  };

  const reset = () => {
    setUserScore(0);
    setCompScore(0);
    setMsg("Pick your move");
    setStatus("");
  };

  return (
    <div className="game">
      <h1 className="game-title">Rock Paper Scissors</h1>
      <p className="game-subtitle">Beat the computer. First to your goal wins.</p>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">You</span>
          <span className="stat-value">{userScore}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Computer</span>
          <span className="stat-value">{compScore}</span>
        </div>
      </div>
      <div className={`message ${status}`}>{msg}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          margin: "24px 0",
          flexWrap: "wrap",
        }}
      >
        {CHOICES.map((choice) => (
          <button
            key={choice}
            className="btn"
            onClick={() => playGame(choice)}
            style={{ minWidth: 100, fontSize: "1rem" }}
          >
            <div style={{ fontSize: "1.8rem", lineHeight: 1 }}>{ICONS[choice]}</div>
            <div style={{ marginTop: 4, textTransform: "capitalize" }}>{choice}</div>
          </button>
        ))}
      </div>
      <button onClick={reset} className="btn">Reset score</button>
    </div>
  );
}
