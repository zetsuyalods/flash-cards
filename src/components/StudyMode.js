import React, { useState, useEffect } from 'react';
import FlashCard from './FlashCard';
import { shuffleArray } from '../utils/storage';
import './StudyMode.css';

export default function StudyMode({ deck, onBack }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setCards(shuffleArray(deck.cards));
  }, [deck.cards]);

  const handleMark = (status) => {
    setResults((prev) => ({
      ...prev,
      [status]: prev[status] + 1,
    }));

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCards(shuffleArray(deck.cards));
    setCurrentIndex(0);
    setResults({ correct: 0, incorrect: 0 });
    setFinished(false);
  };

  if (finished) {
    const total = results.correct + results.incorrect;
    const pct = total > 0 ? Math.round((results.correct / total) * 100) : 0;
    return (
      <div className="study-finished">
        <h1>Session Complete!</h1>
        <div className="results">
          <div className="result-item correct">
            <span className="result-num">{results.correct}</span>
            <span className="result-label">Correct</span>
          </div>
          <div className="result-item incorrect">
            <span className="result-num">{results.incorrect}</span>
            <span className="result-label">Incorrect</span>
          </div>
          <div className="result-item pct">
            <span className="result-num">{pct}%</span>
            <span className="result-label">Score</span>
          </div>
        </div>
        <div className="finished-actions">
          <button className="btn-restart" onClick={handleRestart}>
            Study Again
          </button>
          <button className="btn-back" onClick={onBack}>
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="study-mode">
      <div className="study-header">
        <button className="btn-back-inline" onClick={onBack}>
          &larr; Back
        </button>
        <h2>{deck.name}</h2>
        <span className="progress">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>
      <div className="study-card-area">
        {cards.length > 0 && (
          <FlashCard card={cards[currentIndex]} onMark={handleMark} />
        )}
      </div>
      <div className="study-score">
        <span className="score-correct">Correct: {results.correct}</span>
        <span className="score-incorrect">Incorrect: {results.incorrect}</span>
      </div>
    </div>
  );
}
