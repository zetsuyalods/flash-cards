import React, { useState } from 'react';
import { generateId } from '../utils/storage';
import './CardEditor.css';

export default function CardEditor({ deck, onSave, onBack }) {
  const [cards, setCards] = useState(deck.cards);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleAdd = () => {
    if (!front.trim() || !back.trim()) return;
    const newCard = { id: generateId(), front: front.trim(), back: back.trim() };
    setCards([...cards, newCard]);
    setFront('');
    setBack('');
  };

  const handleEdit = (card) => {
    setEditingId(card.id);
    setFront(card.front);
    setBack(card.back);
  };

  const handleUpdate = () => {
    if (!front.trim() || !back.trim()) return;
    setCards(cards.map((c) => (c.id === editingId ? { ...c, front: front.trim(), back: back.trim() } : c)));
    setEditingId(null);
    setFront('');
    setBack('');
  };

  const handleDelete = (id) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    onSave({ ...deck, cards });
  };

  return (
    <div className="card-editor">
      <div className="editor-header">
        <button className="btn-back-inline" onClick={onBack}>
          &larr; Back
        </button>
        <h2>Edit: {deck.name}</h2>
      </div>

      <div className="editor-form">
        <input
          type="text"
          placeholder="Front (question)"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          className="editor-input"
        />
        <input
          type="text"
          placeholder="Back (answer)"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          className="editor-input"
        />
        <div className="editor-form-actions">
          {editingId ? (
            <>
              <button className="btn-save" onClick={handleUpdate}>
                Update
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setEditingId(null);
                  setFront('');
                  setBack('');
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="btn-add" onClick={handleAdd}>
              Add Card
            </button>
          )}
        </div>
      </div>

      <div className="card-list">
        {cards.map((card) => (
          <div key={card.id} className="card-list-item">
            <div className="card-list-content">
              <span className="card-front">{card.front}</span>
              <span className="card-back">{card.back}</span>
            </div>
            <div className="card-list-actions">
              <button className="btn-edit-card" onClick={() => handleEdit(card)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(card.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="editor-footer">
        <button className="btn-save-deck" onClick={handleSave}>
          Save Deck
        </button>
      </div>
    </div>
  );
}
