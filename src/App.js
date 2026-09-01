import React, { useState, useEffect } from 'react';
import DeckList from './components/DeckList';
import StudyMode from './components/StudyMode';
import CardEditor from './components/CardEditor';
import { loadData, saveData, generateId } from './utils/storage';
import defaultData from './data/cards.json';
import './App.css';

const VIEWS = {
  DECKS: 'decks',
  STUDY: 'study',
  EDIT: 'edit',
};

function App() {
  const [data, setData] = useState(() => loadData(defaultData));
  const [view, setView] = useState(VIEWS.DECKS);
  const [activeDeckId, setActiveDeckId] = useState(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const activeDeck = data.decks.find((d) => d.id === activeDeckId);

  const handleSelectDeck = (deckId) => {
    setActiveDeckId(deckId);
    setView(VIEWS.STUDY);
  };

  const handleEditDeck = (deckId) => {
    setActiveDeckId(deckId);
    setView(VIEWS.EDIT);
  };

  const handleSaveDeck = (updatedDeck) => {
    setData((prev) => ({
      ...prev,
      decks: prev.decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)),
    }));
    setView(VIEWS.DECKS);
  };

  const handleAddDeck = () => {
    const name = prompt('Enter deck name:');
    if (!name || !name.trim()) return;
    const newDeck = {
      id: generateId(),
      name: name.trim(),
      cards: [],
    };
    setData((prev) => ({
      ...prev,
      decks: [...prev.decks, newDeck],
    }));
  };

  const handleDeleteDeck = (deckId) => {
    if (!window.confirm('Delete this deck?')) return;
    setData((prev) => ({
      ...prev,
      decks: prev.decks.filter((d) => d.id !== deckId),
    }));
  };

  return (
    <div className="app">
      {view === VIEWS.DECKS && (
        <DeckList
          decks={data.decks}
          onSelectDeck={handleSelectDeck}
          onEditCards={handleEditDeck}
        />
      )}
      {view === VIEWS.STUDY && activeDeck && (
        <StudyMode deck={activeDeck} onBack={() => setView(VIEWS.DECKS)} />
      )}
      {view === VIEWS.EDIT && activeDeck && (
        <CardEditor
          deck={activeDeck}
          onSave={handleSaveDeck}
          onBack={() => setView(VIEWS.DECKS)}
        />
      )}
    </div>
  );
}

export default App;
