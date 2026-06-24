import { useState } from "react";
import "./App.css";
import './games/games.css'
import Home from "./pages/Home";
import TicTacToe from "./games/TicTacToe";
import MemoryGame from "./games/MemoryGame";
import Snake from "./games/SnakeGame";
import Game2048 from "./games/Game2048";
import RockPaperScissors from "./games/RockPaperScissors";
import ConnectFour from "./games/ConnectFour";
import SimonGame from "./games/SimonGame";
import TypingTest from "./games/TypingTest";

export default function App() {
  const [game, setGame] = useState("home");

  if (game === "home") return <Home setGame={setGame} />;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => setGame("home")}>⬅ Back to Home</button>

      {game === "tictactoe"  && <TicTacToe />}
      {game === "memory"     && <MemoryGame />}
      {game === "snake"      && <Snake />}
      {game === "2048"       && <Game2048 />}
      {game === "rps"        && <RockPaperScissors />}
      {game === "connectfour"&& <ConnectFour />}
      {game === "simon"      && <SimonGame />}
      {game === "typing"     && <TypingTest />}
    </div>
  );
}
