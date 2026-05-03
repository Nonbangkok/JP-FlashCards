import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character, CharacterType, DifficultyLevel } from '../types';

interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacters: Character[];
  onSelectionChange: (characters: Character[]) => void;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  selectedCharacters,
  onSelectionChange,
}) => {
  const [filterType, setFilterType] = useState<CharacterType>('all');
  const [filterLevel, setFilterLevel] = useState<DifficultyLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCharacters = characters.filter(char => {
    const matchesType = filterType === 'all' || char.type === filterType;
    const matchesLevel = filterLevel === 'all' || char.level === filterLevel;
    const matchesSearch = searchTerm === '' ||
      char.character.includes(searchTerm) ||
      char.romaji.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (char.meaning && char.meaning.includes(searchTerm));
    return matchesType && matchesLevel && matchesSearch;
  });

  const toggleCharacter = (character: Character) => {
    const isSelected = selectedCharacters.some(c => c.id === character.id);
    if (isSelected) {
      onSelectionChange(selectedCharacters.filter(c => c.id !== character.id));
    } else {
      onSelectionChange([...selectedCharacters, character]);
    }
  };

  const selectAll = () => onSelectionChange(filteredCharacters);

  const deselectAll = () => {
    onSelectionChange(selectedCharacters.filter(char =>
      !filteredCharacters.some(fc => fc.id === char.id)
    ));
  };

  const getTypeCount = (type: CharacterType) =>
    characters.filter(c => c.type === type).length;

  const getLevelCount = (level: DifficultyLevel) =>
    characters.filter(c => c.type === 'kanji' && c.level === level).length;

  return (
    <div className="card">
      <div className="card-title">Select Characters</div>

      <div className="stack-md">
        {/* Type Filters */}
        <div>
          <label className="field-label">Character Type</label>
          <div className="filter-row">
            {([['all', `All (${characters.length})`], ['hiragana', `Hiragana (${getTypeCount('hiragana')})`], ['katakana', `Katakana (${getTypeCount('katakana')})`], ['kanji', `Kanji (${getTypeCount('kanji')})`]] as [CharacterType, string][]).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`filter-pill ${filterType === type ? 'active' : ''}`}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* JLPT Level Filter */}
        {filterType === 'kanji' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="field-label">JLPT Level</label>
            <div className="filter-row">
              <button
                onClick={() => setFilterLevel('all')}
                className={`filter-pill ${filterLevel === 'all' ? 'active' : ''}`}
                type="button"
              >
                All
              </button>
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level as DifficultyLevel)}
                  className={`filter-pill ${filterLevel === level ? 'active' : ''}`}
                  type="button"
                >
                  N{6 - level} ({getLevelCount(level as DifficultyLevel)})
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div>
          <label className="field-label" htmlFor="char-search">Search</label>
          <input
            id="char-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by character, pronunciation, or meaning..."
            className="search-input"
          />
        </div>

        {/* Bulk Actions */}
        <div className="flex-row gap-2">
          <button onClick={selectAll} className="btn btn-primary" type="button">
            Select All
          </button>
          <button onClick={deselectAll} className="btn btn-secondary" type="button">
            Deselect All
          </button>
        </div>

        {/* Character Grid */}
        <motion.div layout className="char-grid">
          <AnimatePresence>
            {filteredCharacters.map((character, index) => {
              const isSelected = selectedCharacters.some(c => c.id === character.id);
              return (
                <motion.button
                  layout
                  key={character.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.15,
                    delay: Math.min(index * 0.003, 0.08),
                  }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggleCharacter(character)}
                  className={`char-cell ${isSelected ? 'selected' : ''}`}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${character.character} (${character.romaji})`}
                >
                  <span className="char-cell-char">{character.character}</span>
                  <span className="char-cell-romaji">{character.romaji}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <div className="selection-info">
          {selectedCharacters.length} of {characters.length} characters selected
        </div>
      </div>
    </div>
  );
};

export default CharacterSelector;
