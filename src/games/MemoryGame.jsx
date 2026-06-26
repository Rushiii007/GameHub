import { useState, useEffect } from "react";
import "./MemoryGame.css";

const VALUES = ["🍎", "🍊", "🍇", "🍓", "🍌", "🥝", "🍒", "🍍"];

function buildDeck() {
  const pairs = VALUES.flatMap((v, i) => [
    { id: i * 2,     value: v, flipped: false, matched: false },
    { id: i * 2 + 1, value: v, flipped: false, matched: false },
  ]);
  return pairs.sort(() => Math.random() - 0.5);
}

function MemoryGame() {
  const [cards, setCards] = useState(buildDeck);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  function handleClick(id) {
    if (lockBoard || won) return;
    const clicked = cards.find((c) => c.id === id);
    if (!clicked || clicked.flipped || clicked.matched) return;
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );
    if (!firstCard) {
      setFirstCard(clicked);
    } else {
      setSecondCard(clicked);
    }
  }

  useEffect(() => {
    if (!firstCard || !secondCard) return;
    setLockBoard(true);
    setMoves((m) => m + 1);
    if (firstCard.value === secondCard.value) {
      setCards((prev) =>
        prev.map((c) =>
          c.value === firstCard.value ? { ...c, matched: true } : c
        )
      );
      reset();
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstCard.id || c.id === secondCard.id
              ? { ...c, flipped: false }
              : c
          )
        );
        reset();
      }, 800);
    }
  }, [secondCard]);

  function reset() {
    setFirstCard(null);
    setSecondCard(null);
    setLockBoard(false);
  }

  useEffect(() => {
    if (cards.every((c) => c.matched)) setWon(true);
  }, [cards]);

  function restartGame() {
    setCards(buildDeck());
    setFirstCard(null);
    setSecondCard(null);
    setLockBoard(false);
    setMoves(0);
    setWon(false);
  }

  return (
    <div className="game">
      <h1 className="game-title">Memory Game</h1>
      <p className="game-subtitle">Match all pairs in as few moves as possible.</p>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Matched</span>
          <span className="stat-value">
            {cards.filter((c) => c.matched).length / 2} / {cards.length / 2}
          </span>
        </div>
      </div>
      {won && <div className="message win">You won in {moves} moves!</div>}
      <div className="container">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? "flip" : ""}`}
            onClick={() => handleClick(card.id)}
          >
            <div className="front">?</div>
            <div className="back">{card.value}</div>
          </div>
        ))}
      </div>
      <button onClick={restartGame} className="btn btn-primary" style={{ marginTop: 20 }}>
        Restart
      </button>
    </div>
  );
}

export default MemoryGame;
