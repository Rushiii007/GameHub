// src/pages/Home.jsx
import Navbar from "../components/Navbar";
import GameCard from "../components/GameCard";

const games = [
  { key: "tictactoe",   title: "Tic Tac Toe",         description: "Classic 3x3 showdown.",      tag: "Strategy", image: "/images/tictactoe.png" },
  { key: "memory",      title: "Memory Game",         description: "Find the matching pairs.",   tag: "Puzzle",   image: "/images/memory.png",     scoreKey: "memory_best" },
  { key: "snake",       title: "Snake",               description: "Eat, grow, don't crash.",    tag: "Arcade",   image: "/images/snake.png",      scoreKey: "snake_best" },
  { key: "2048",        title: "2048",                description: "Merge tiles up to 2048.",    tag: "Puzzle",   image: "/images/2048.png",       scoreKey: "2048_best" },
  { key: "rps",         title: "Rock Paper Scissors", description: "Can you beat the computer?", tag: "Casual",   image: "/images/rps.png" },
  { key: "connectfour", title: "Connect Four",        description: "Get four in a row to win.",  tag: "Strategy", image: "/images/connectfour.png" },
  { key: "simon",       title: "Simon Game",          description: "Repeat the color sequence.", tag: "Memory",   image: "/images/simon.png",      scoreKey: "simon_best" },
  { key: "typing",      title: "Typing Test",         description: "How fast can you type?",     tag: "Skill",    image: "/images/typing.png",     scoreKey: "typing_best" },
];

export default function Home({ setGame }) {
  return (
    <div className="page">
      <Navbar />
      <div className="hero">
        <h1>Welcome to GameHub</h1>
        <p>Ready to play? Pick a game below and jump right in.</p>
      </div>
      <h2 className="section-title">All Games</h2>
      <div className="grid">
        {games.map((g) => (
          <GameCard
            key={g.key}
            image={g.image}
            title={g.title}
            description={g.description}
            tag={g.tag}
            scoreKey={g.scoreKey}
            onClick={() => setGame(g.key)}
          />
        ))}
      </div>
    </div>
  );
}
