import React, { useRef, useState } from 'react';
import { parseFile } from '../utils/parseFile';
import { generateId } from '../utils/storage';
import './FileUpload.css';

export default function FileUpload({ onUpload, existingCategories }) {
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      if (!deckName) {
        setDeckName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }
    if (!deckName.trim()) {
      setError('Please enter a deck name');
      return;
    }
    if (!category.trim()) {
      setError('Please enter a category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cards = await parseFile(selectedFile);
      if (cards.length === 0) {
        setError('No cards found. Make sure the file uses "Definition:" and "Answer:" format.');
        setLoading(false);
        return;
      }

      onUpload({
        id: generateId(),
        name: deckName.trim(),
        category: category.trim(),
        cards,
      });

      setIsOpen(false);
      setDeckName('');
      setCategory('');
      setSelectedFile(null);
    } catch (err) {
      setError('Failed to parse file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setError('');
    setSelectedFile(null);
  };

  if (!isOpen) {
    return (
      <button className="btn-upload" onClick={handleOpen}>
        + Upload File
      </button>
    );
  }

  return (
    <div className="upload-overlay" onClick={() => setIsOpen(false)}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Upload Flash Card File</h3>
        <p className="upload-info">
          Supports <strong>.txt</strong>, <strong>.docx</strong>, and <strong>.pdf</strong> files.
          <br />Format: <code>Definition: ...</code> and <code>Answer: ...</code>
        </p>

        <input
          type="text"
          className="upload-input"
          placeholder="Deck name"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />

        <input
          type="text"
          className="upload-input"
          placeholder="Category (e.g., Embedded Systems, Robotics)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          list="category-suggestions"
        />
        <datalist id="category-suggestions">
          {existingCategories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>

        <div className="file-select" onClick={() => fileInputRef.current.click()}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.docx,.pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          {selectedFile ? (
            <span className="file-name">{selectedFile.name}</span>
          ) : (
            <span className="file-placeholder">Click to select a file</span>
          )}
        </div>

        {error && <div className="upload-error">{error}</div>}

        <div className="upload-actions">
          <button className="btn-cancel-upload" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button className="btn-confirm-upload" onClick={handleUpload} disabled={loading}>
            {loading ? 'Parsing...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
