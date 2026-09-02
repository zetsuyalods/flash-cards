import React, { useState } from 'react';
import FileUpload from './FileUpload';
import './DeckList.css';

export default function DeckList({ decks, onSelectDeck, onEditCards, onUploadDeck, onDeleteCategory, onDeleteDeck }) {
  const [expandedCategories, setExpandedCategories] = useState({});

  const categories = {};
  decks.forEach((deck) => {
    const cat = deck.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(deck);
  });

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const existingCategories = [...new Set(decks.map((d) => d.category).filter(Boolean))];

  const uncategorized = categories['Other'] || [];
  const categorized = Object.entries(categories).filter(([cat]) => cat !== 'Other');

  return (
    <div className="deck-list">
      <h1>Your Decks</h1>

      <div className="upload-area">
        <FileUpload onUpload={onUploadDeck} existingCategories={existingCategories} />
      </div>

      {uncategorized.length > 0 && (
        <div className="decks-grid">
          {uncategorized.map((deck) => (
            <div key={deck.id} className="deck-card">
              <h2>{deck.name}</h2>
              <p className="card-count">{deck.cards.length} cards</p>
              <div className="deck-actions">
                <button className="btn-study" onClick={() => onSelectDeck(deck.id)}>
                  Study
                </button>
                <button className="btn-edit" onClick={() => onEditCards(deck.id)}>
                  Edit
                </button>
                <button
                  className="btn-delete-deck"
                  onClick={() => {
                    if (window.confirm(`Delete "${deck.name}"?`)) {
                      onDeleteDeck(deck.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {categorized.map(([cat, catDecks]) => (
        <div key={cat} className="category-section">
          <div
            className="category-header"
            onClick={() => toggleCategory(cat)}
          >
            <span className={`category-arrow ${expandedCategories[cat] ? 'open' : ''}`}>
              &#9654;
            </span>
            <h2 className="category-title">{cat}</h2>
            <span className="category-count">
              {catDecks.length} topic{catDecks.length !== 1 ? 's' : ''} &middot;{' '}
              {catDecks.reduce((sum, d) => sum + d.cards.length, 0)} cards
            </span>
            <button
              className="btn-delete-category"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete "${cat}" and all its decks?`)) {
                  onDeleteCategory(cat);
                }
              }}
            >
              Delete
            </button>
          </div>
          {expandedCategories[cat] && (
            <div className="decks-grid">
              {catDecks.map((deck) => (
                <div key={deck.id} className="deck-card">
                  <h2>{deck.name}</h2>
                  <p className="card-count">{deck.cards.length} cards</p>
                  <div className="deck-actions">
                    <button className="btn-study" onClick={() => onSelectDeck(deck.id)}>
                      Study
                    </button>
                    <button className="btn-edit" onClick={() => onEditCards(deck.id)}>
                      Edit
                    </button>
                    <button
                      className="btn-delete-deck"
                      onClick={() => {
                        if (window.confirm(`Delete "${deck.name}"?`)) {
                          onDeleteDeck(deck.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
