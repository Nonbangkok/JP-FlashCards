import React from 'react';
import { motion } from 'framer-motion';
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
    const p = getCharacterProgress(char.id);
    return sum + p.correct + p.incorrect;
  }, 0);
  const totalCorrect = characters.reduce((sum, char) => sum + getCharacterProgress(char.id).correct, 0);
  const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

  const weakCharacters = characters.filter(char => {
    const p = getCharacterProgress(char.id);
    return p.incorrect > p.correct && p.incorrect > 0;
  });

  const getCharactersByType = (type: 'hiragana' | 'katakana' | 'kanji') =>
    characters.filter(c => c.type === type);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="stack-lg"
    >
      {/* Summary Stats */}
      <div className="card">
        <div className="card-title">Overview</div>

        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-value primary">{masteredCount}</span>
            <span className="stat-label">Mastered</span>
          </div>
          <div className="stat-card">
            <span className="stat-value info">{totalAttempts}</span>
            <span className="stat-label">Attempts</span>
          </div>
          <div className="stat-card">
            <span className="stat-value success">{accuracy.toFixed(1)}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
        </div>

        {/* Weak Characters */}
        {weakCharacters.length > 0 && (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <div className="section-title" style={{ marginBottom: 'var(--space-3)' }}>Needs Practice</div>
            <div className="flex-row flex-wrap gap-2">
              {weakCharacters.slice(0, 12).map(character => {
                const p = getCharacterProgress(character.id);
                return (
                  <div key={character.id} className="weak-char-badge">
                    <span className="char">{character.character}</span>
                    <span className="ratio">{p.correct}/{p.correct + p.incorrect}</span>
                  </div>
                );
              })}
              {weakCharacters.length > 12 && (
                <span className="text-tertiary" style={{ fontSize: '0.8rem', alignSelf: 'center' }}>
                  +{weakCharacters.length - 12} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Progress by Type */}
        <div style={{ marginTop: 'var(--space-6)' }}>
          <div className="section-title" style={{ marginBottom: 'var(--space-3)' }}>Progress by Type</div>
          <div className="stack-sm">
            {(['hiragana', 'katakana', 'kanji'] as const).map(type => {
              const typeChars = characters.filter(c => c.type === type);
              const typeMastered = typeChars.filter(c => getCharacterProgress(c.id).mastered).length;
              const pct = typeChars.length > 0 ? (typeMastered / typeChars.length) * 100 : 0;

              return (
                <div key={type} className="type-progress-row">
                  <span className="type-progress-label" style={{ textTransform: 'capitalize' }}>{type}</span>
                  <div className="type-progress-bar-container">
                    <div className="type-progress-track">
                      <motion.div
                        className="type-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="type-progress-count">{typeMastered}/{typeChars.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Character Heatmap */}
      <div className="card">
        <div className="card-title">Character Map</div>

        {(['hiragana', 'katakana', 'kanji'] as const).map(type => {
          const typeChars = getCharactersByType(type);
          const typeMastered = typeChars.filter(c => getCharacterProgress(c.id).mastered).length;

          return (
            <div key={type} style={{ marginBottom: 'var(--space-6)' }}>
              <div className="section-header">
                <span className="section-title" style={{ textTransform: 'capitalize' }}>{type}</span>
                <span className="section-count">{typeMastered}/{typeChars.length} mastered</span>
              </div>

              <div className="heatmap-grid">
                {typeChars.map(character => {
                  const p = getCharacterProgress(character.id);
                  const isMastered = p.mastered;
                  const hasAttempts = p.correct > 0 || p.incorrect > 0;

                  const stateClass = isMastered
                    ? 'mastered'
                    : hasAttempts
                      ? 'in-progress'
                      : 'not-started';

                  return (
                    <div
                      key={character.id}
                      className={`heatmap-cell ${stateClass}`}
                      title={`${character.character} (${character.romaji}) — ${isMastered ? 'Mastered' : hasAttempts ? 'In Progress' : 'Not Started'} — ${p.correct}/${p.correct + p.incorrect}`}
                    >
                      <span className="char">{character.character}</span>
                      <span className="romaji">{character.romaji}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProgressStats;
