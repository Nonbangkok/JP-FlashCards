import React from 'react';
import { Character, Progress } from '../types';

interface ProgressStatsProps {
  characters: Character[];
  progress: Record<string, Progress>;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ characters, progress }) => {
  const getCharacterProgress = (characterId: string): Progress => {
    return progress[characterId] || {
      characterId,
      correct: 0,
      incorrect: 0,
      lastReviewed: new Date(),
      mastered: false,
    };
  };

  const masteredCount = characters.filter(char => getCharacterProgress(char.id).mastered).length;
  const totalAttempts = characters.reduce((sum, char) => {
    const charProgress = getCharacterProgress(char.id);
    return sum + charProgress.correct + charProgress.incorrect;
  }, 0);

  const totalCorrect = characters.reduce((sum, char) => {
    return sum + getCharacterProgress(char.id).correct;
  }, 0);

  const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

  const getWeakCharacters = () => {
    return characters.filter(char => {
      const charProgress = getCharacterProgress(char.id);
      return charProgress.incorrect > charProgress.correct && charProgress.incorrect > 0;
    });
  };

  const weakCharacters = getWeakCharacters();

  const getCharactersByType = (type: 'hiragana' | 'katakana' | 'kanji') => {
    return characters.filter(c => c.type === type);
  };

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-primary-color mb-4">
          Progress Statistics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-color">{masteredCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">{totalAttempts}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">{accuracy.toFixed(1)}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
          </div>
        </div>

        {weakCharacters.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-primary-color mb-2">
              Characters Needing Practice
            </h4>
            <div className="flex flex-wrap gap-2">
              {weakCharacters.slice(0, 10).map(character => {
                const charProgress = getCharacterProgress(character.id);
                return (
                  <div
                    key={character.id}
                    className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm"
                  >
                    <span className="font-medium">{character.character}</span>
                    <span className="text-xs">
                      ({charProgress.correct}/{charProgress.correct + charProgress.incorrect})
                    </span>
                  </div>
                );
              })}
              {weakCharacters.length > 10 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  and {weakCharacters.length - 10} more
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-lg font-semibold text-primary-color mb-2">
            Progress by Type
          </h4>
          <div className="space-y-2">
            {['hiragana', 'katakana', 'kanji'].map(type => {
              const typeCharacters = characters.filter(c => c.type === type);
              const typeMastered = typeCharacters.filter(char => getCharacterProgress(char.id).mastered).length;
              const percentage = typeCharacters.length > 0 ? (typeMastered / typeCharacters.length) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {type === 'hiragana' ? 'Hiragana' : type === 'katakana' ? 'Katakana' : 'Kanji'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {typeMastered}/{typeCharacters.length}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Character Overview with Highlighting */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-primary-color mb-4">
          Character Overview
        </h3>
        
        {['hiragana', 'katakana', 'kanji'].map(type => {
          const typeCharacters = getCharactersByType(type as 'hiragana' | 'katakana' | 'kanji');
          const typeMastered = typeCharacters.filter(char => getCharacterProgress(char.id).mastered).length;
          
          return (
            <div key={type} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                  {type === 'hiragana' ? 'Hiragana' : type === 'katakana' ? 'Katakana' : 'Kanji'}
                </h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {typeMastered}/{typeCharacters.length} mastered
                </span>
              </div>
              
              <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-2">
                {typeCharacters.map(character => {
                  const charProgress = getCharacterProgress(character.id);
                  const isMastered = charProgress.mastered;
                  const hasAttempts = charProgress.correct > 0 || charProgress.incorrect > 0;
                  
                  return (
                    <div
                      key={character.id}
                      className={`p-2 rounded-lg text-center text-sm transition-all duration-200 ${
                        isMastered
                          ? 'bg-green-100 dark:bg-green-900 text-black border-2 border-green-300 dark:border-green-700'
                          : hasAttempts
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600'
                      }`}
                      title={`${character.character} (${character.romaji}) - ${isMastered ? 'Mastered' : hasAttempts ? 'In Progress' : 'Not Started'}`}
                    >
                      <div className="font-medium text-lg">{character.character}</div>
                      <div className="text-xs opacity-75">{character.romaji}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStats;
