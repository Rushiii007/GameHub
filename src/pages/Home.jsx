import Navbar from "../components/Navbar";
import GameCard from "../components/GameCard";

const games = [
  { key: "tictactoe",   title: "Tic Tac Toe",        description: "Classic 3x3 strategy game.",        tag: "Strategy" },
  { key: "memory",      title: "Memory Game",        description: "Match pairs of cards.",             tag: "Puzzle",  scoreKey: "memory_best" },
  { key: "snake",       title: "Snake",              description: "Eat, grow, don't crash.",           tag: "Arcade",  scoreKey: "snake_best" },
  { key: "2048",        title: "2048",               description: "Combine tiles to reach 2048.",      tag: "Puzzle",  scoreKey: "2048_best" },
  { key: "rps",         title: "Rock Paper Scissors",description: "Beat the computer.",                tag: "Casual" },
  { key: "connectfour", title: "Connect Four",       description: "Line up four in a row.",            tag: "Strategy" },
  { key: "simon",       title: "Simon Game",         description: "Repeat the color sequence.",        tag: "Memory",  scoreKey: "simon_best" },
  { key: "typing",      title: "Typing Test",        description: "Test your typing speed.",           tag: "Skill",   scoreKey: "typing_best" },
];

export default function Home({ setGame }) {
  return (
    <div className="page">
      <Navbar />

      <div className="hero">
        <h1>Welcome to GameHub</h1>
        <p>Pick a game and start playing</p>
      </div>

      <h2 className="section-title">All Games</h2>
      <div className="grid">
        {games.map((g) => (
          <GameCard
            key={g.key}
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
