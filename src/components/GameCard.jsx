import { getScore } from "../utils/scoreStorage";

export default function GameCard({ title, description, tag, scoreKey, onClick }) {
  const score = scoreKey ? getScore(scoreKey) : 0;

  return (
    <div className="game-card" onClick={onClick}>
      <h3>{title}</h3>
      <p className="desc">{description}</p>
      <div className="meta">
        {tag && <span className="tag">{tag}</span>}
        {scoreKey && score > 0 && <span className="score">Best: {score}</span>}
      </div>
      <button className="play-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
        Play
      </button>
    </div>
  );
}
