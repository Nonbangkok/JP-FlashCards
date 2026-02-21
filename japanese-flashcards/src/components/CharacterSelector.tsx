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

  const selectAll = () => {
    onSelectionChange(filteredCharacters);
  };

  const deselectAll = () => {
    onSelectionChange(selectedCharacters.filter(char =>
      !filteredCharacters.some(fc => fc.id === char.id)
    ));
  };

  const getTypeCount = (type: CharacterType) => {
    return characters.filter(c => c.type === type).length;
  };

  const getLevelCount = (level: DifficultyLevel) => {
    return characters.filter(c => c.type === 'kanji' && c.level === level).length;
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-primary-color mb-4">
        Select Characters to Study
      </h3>
      
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Character Type
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full text-sm ${filterType === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              All ({characters.length})
            </button>
            <button
              onClick={() => setFilterType('hiragana')}
              className={`px-4 py-2 rounded-full text-sm ${filterType === 'hiragana'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Hiragana ({getTypeCount('hiragana')})
            </button>
            <button
              onClick={() => setFilterType('katakana')}
              className={`px-4 py-2 rounded-full text-sm ${filterType === 'katakana'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Katakana ({getTypeCount('katakana')})
            </button>
            <button
              onClick={() => setFilterType('kanji')}
              className={`px-4 py-2 rounded-full text-sm ${filterType === 'kanji'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Kanji ({getTypeCount('kanji')})
            </button>
          </div>
        </div>

        {filterType === 'kanji' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty Level (JLPT)
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterLevel('all')}
                className={`px-4 py-2 rounded-full text-sm ${filterLevel === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
              >
                All
              </button>
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level as DifficultyLevel)}
                  className={`px-4 py-2 rounded-full text-sm ${filterLevel === level
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  N{6 - level} ({getLevelCount(level as DifficultyLevel)})
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by character, pronunciation, or meaning..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark-card dark:text-white"
          />
        </div>
      </div>

      {/* Selection controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={selectAll}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Select All
        </button>
        <button
          onClick={deselectAll}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Deselect All
        </button>
      </div>

      {/* Character grid */}
      <motion.div
        layout
        className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 max-h-96 overflow-y-auto"
      >
        <AnimatePresence>
          {filteredCharacters.map((character, index) => {
            const isSelected = selectedCharacters.some(c => c.id === character.id);
            return (
              <motion.button
                layout
                key={character.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 0.15,
                  delay: Math.min(index * 0.005, 0.1) // Faster staggered delay
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleCharacter(character)}
                className={`p-3 rounded-lg text-center transition-colors relative ${isSelected
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                <div className="text-lg font-medium">{character.character}</div>
                <div className="text-xs opacity-75">{character.romaji}</div>
                {isSelected && (
                  <motion.div
                    layoutId="outline"
                    className="absolute inset-0 border-2 border-primary-dark rounded-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Selected: {selectedCharacters.length} characters
      </div>
    </div>
  );
};

export default CharacterSelector;
