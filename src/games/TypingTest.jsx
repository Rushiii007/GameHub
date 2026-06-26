import { useEffect, useRef, useState } from "react";
import { getScore, setScore } from "../utils/scoreStorage";

const SENTENCES = [
  "react makes building ui easy",
  "gamehub is my portfolio project",
  "typing speed improves with practice",
  "frontend development is fun",
  "javascript powers modern web apps",
  "clean code is easier to maintain",
  "small components keep things simple",
];

export default function TypingTest() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("");
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const [bestWPM, setBestWPM] = useState(getScore("typing_best_wpm"));
  const intervalRef = useRef(null);

  useEffect(() => {
    setTarget(SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
  }, []);

  useEffect(() => {
    if (!started) return;
    intervalRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, [started]);

  const wpm = () => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return time === 0 ? 0 : Math.round((words / time) * 60);
  };

  const accuracy = () => {
    if (!target || !text) return 0;
    let correct = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === target[i]) correct++;
    }
    return Math.round((correct / target.length) * 100);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (!started && val.length === 1) setStarted(true);
    if (val.length > target.length) return;
    setText(val);
    if (val.length === target.length) {
      const final = wpmFromVal(val);
      if (final > bestWPM) {
        setScore("typing_best_wpm", final);
        setBestWPM(final);
      }
      setFinished(true);
      setStarted(false);
      clearInterval(intervalRef.current);
    }
  };

  const wpmFromVal = (val) => {
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    return time === 0 ? 0 : Math.round((words / time) * 60);
  };

  const reset = () => {
    setText("");
    setTime(0);
    setFinished(false);
    setStarted(false);
    clearInterval(intervalRef.current);
    setTarget(SENTENCES[Math.floor(Math.random() * SENTENCES.length)]);
  };

  return (
    <div className="game">
      <h1 className="game-title">Typing Speed Test</h1>
      <p className="game-subtitle">Type the sentence below as fast and accurately as you can.</p>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Time</span>
          <span className="stat-value">{time}s</span>
        </div>
        <div className="stat">
          <span className="stat-label">WPM</span>
          <span className="stat-value">{wpm()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Best WPM</span>
          <span className="stat-value">{bestWPM}</span>
        </div>
      </div>
      <div
        style={{
          maxWidth: 600,
          margin: "16px auto",
          padding: 18,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          fontSize: "1.15rem",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          lineHeight: 1.7,
          textAlign: "left",
        }}
      >
        {target.split("").map((ch, i) => {
          let color = "var(--text-muted)";
          let bg = "transparent";
          if (i < text.length) {
            color = text[i] === ch ? "#4ade80" : "#f87171";
            if (text[i] !== ch) bg = "rgba(248,113,113,0.15)";
          } else if (i === text.length) {
            bg = "rgba(255,255,255,0.08)";
          }
          return (
            <span key={i} style={{ color, background: bg }}>
              {ch}
            </span>
          );
        })}
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        disabled={finished}
        rows={3}
        placeholder="Start typing..."
        style={{
          width: "min(600px, 100%)",
          padding: 12,
          fontSize: "1rem",
          fontFamily: "ui-monospace, monospace",
          background: "var(--bg-2)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          outline: "none",
          resize: "none",
        }}
      />
      {finished && (
        <div className="message win" style={{ marginTop: 16 }}>
          Done! {wpm()} WPM • {accuracy()}% accuracy
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <button onClick={reset} className="btn btn-primary">New sentence</button>
      </div>
    </div>
  );
}
