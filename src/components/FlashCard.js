import React, { useState, useEffect } from 'react';
import './FlashCard.css';

function checkAnswer(userAnswer, correctAnswer) {
  const user = userAnswer.toLowerCase().trim();
  const correct = correctAnswer.toLowerCase().trim();

  if (user === correct) return true;

  const correctWords = correct.split(/\s+/).filter((w) => w.length > 3);
  const matched = correctWords.filter((w) => user.includes(w));
  return matched.length >= Math.ceil(correctWords.length * 0.5);
}

function generateHint(answer) {
  const words = answer.split(/\s+/);
  return words.map((word) => {
    if (word.length <= 1) return word;
    const first = word[0];
    const rest = word.slice(1).replace(/[a-zA-Z0-9]/g, '_');
    return first + rest;
  }).join(' ');
}

export default function FlashCard({ card, onMark }) {
  const [flipped, setFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setUserAnswer('');
    setResult(null);
    setFlipped(false);
    setShowHint(false);
  }, [card.id]);

  useEffect(() => {
    if (result !== null) {
      const timer = setTimeout(() => {
        onMark(result ? 'correct' : 'incorrect');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [result, onMark]);

  const handleCheck = (e) => {
    e.stopPropagation();
    if (!userAnswer.trim() || result !== null) return;
    const isCorrect = checkAnswer(userAnswer, card.back);
    setResult(isCorrect);
    setFlipped(true);
  };

  const handleFlip = () => {
    if (result === null) return;
    setFlipped(!flipped);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && result === null) {
      handleCheck(e);
    }
  };

  const hint = generateHint(card.back);

  return (
    <div className={`flashcard-container ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flashcard">
        <div className="flashcard-face flashcard-front">
          <p>{card.front}</p>
          {result === null && (
            <div className="answer-area" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                className="answer-input"
                placeholder="Type your answer..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button className="btn-check" onClick={handleCheck}>
                Check
              </button>
            </div>
          )}
          {result === null && !showHint && (
            <button className="btn-hint" onClick={(e) => { e.stopPropagation(); setShowHint(true); }}>
              Hint
            </button>
          )}
          {result === null && showHint && (
            <div className="hint-text">{hint}</div>
          )}
          {result !== null && (
            <div className={`feedback ${result ? 'correct' : 'incorrect'}`}>
              {result ? 'Correct!' : 'Incorrect'}
            </div>
          )}
        </div>
        <div className="flashcard-face flashcard-back">
          <p>{card.back}</p>
        </div>
      </div>
    </div>
  );
}
