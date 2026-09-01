import React, { useState } from 'react';
import './FlashCard.css';

function checkAnswer(userAnswer, correctAnswer) {
  const user = userAnswer.toLowerCase().trim();
  const correct = correctAnswer.toLowerCase().trim();

  if (user === correct) return true;

  const correctWords = correct.split(/\s+/).filter((w) => w.length > 3);
  const matched = correctWords.filter((w) => user.includes(w));
  return matched.length >= Math.ceil(correctWords.length * 0.5);
}

export default function FlashCard({ card, onMark }) {
  const [flipped, setFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = (e) => {
    e.stopPropagation();
    if (!userAnswer.trim()) return;
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

  const handleMarkAndReset = (status) => {
    onMark(status);
    setUserAnswer('');
    setResult(null);
    setFlipped(false);
  };

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
      {flipped && result !== null && onMark && (
        <div className="mark-buttons" onClick={(e) => e.stopPropagation()}>
          <button className="mark-btn correct" onClick={() => handleMarkAndReset('correct')}>
            Got it right
          </button>
          <button className="mark-btn incorrect" onClick={() => handleMarkAndReset('incorrect')}>
            Got it wrong
          </button>
        </div>
      )}
    </div>
  );
}
