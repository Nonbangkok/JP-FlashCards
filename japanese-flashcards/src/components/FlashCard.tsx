import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character, StudyMode } from '../types';

interface FlashCardProps {
  character: Character;
  mode: StudyMode;
  isFlipped: boolean;
  showAnswer: boolean;
  isAlreadyAnswered: boolean;
  onFlip: () => void;
  onAnswer: (isCorrect: boolean) => void;
}

const FlashCard: React.FC<FlashCardProps> = ({
  character,
  mode,
  isFlipped,
  showAnswer,
  isAlreadyAnswered,
  onFlip,
  onAnswer,
}) => {
  const [answerResult, setAnswerResult] = useState<'correct' | 'incorrect' | null>(null);

  React.useEffect(() => {
    setAnswerResult(null);
  }, [character]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isAlreadyAnswered) return;
    setAnswerResult(isCorrect ? 'correct' : 'incorrect');
    onAnswer(isCorrect);
  };

  const resultClass = answerResult === 'correct' ? 'correct' : answerResult === 'incorrect' ? 'incorrect' : '';

  const renderFront = () => {
    if (mode === 'character-to-sound') {
      return (
        <div className="text-center">
          <div className="card-character">{character.character}</div>
          {character.type === 'kanji' && character.meaning && (
            <div className="card-meaning">{character.meaning}</div>
          )}
          <span className="card-type-badge">{character.type}</span>
        </div>
      );
    }
    return (
      <div className="text-center">
        <div className="card-romaji">{character.romaji}</div>
        <span className="card-type-badge">{character.type}</span>
      </div>
    );
  };

  const renderBack = () => {
    const answer = mode === 'character-to-sound' ? character.romaji : character.character;
    const isCharAnswer = mode === 'sound-to-character';

    return (
      <div className="text-center">
        <div className={isCharAnswer ? 'card-character' : 'card-romaji'} style={isCharAnswer ? { fontSize: '5rem' } : undefined}>
          {answer}
        </div>
        {character.type === 'kanji' && character.meaning && (
          <div className="card-meaning">{character.meaning}</div>
        )}
        <span className="card-type-badge">{character.type}</span>
      </div>
    );
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={character.id}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        >
          <div
            className="flash-card"
            onClick={!isFlipped ? onFlip : undefined}
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? 'Card showing answer' : 'Click to reveal answer'}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!isFlipped) onFlip(); } }}
          >
            <motion.div
              className="flash-card-inner"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={`flash-card-front ${resultClass}`}>
                {renderFront()}
              </div>
              <div className={`flash-card-back ${resultClass}`}>
                {renderBack()}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {!isFlipped && (
        <div className="flip-hint">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onFlip}
            className="btn btn-primary btn-lg"
            type="button"
          >
            Reveal Answer
          </motion.button>
        </div>
      )}

      {showAnswer && !isAlreadyAnswered && (
        <motion.div
          className="answer-buttons"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleAnswer(false)}
            className="answer-btn answer-btn-wrong"
            type="button"
            aria-label="Incorrect"
          >
            &#10007; Wrong
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleAnswer(true)}
            className="answer-btn answer-btn-correct"
            type="button"
            aria-label="Correct"
          >
            &#10003; Correct
          </motion.button>
        </motion.div>
      )}

      {isAlreadyAnswered && (
        <div className="answered-label">
          {answerResult === 'correct' ? 'Correct! ' : answerResult === 'incorrect' ? 'Keep practicing! ' : ''}
          Moving to next card...
        </div>
      )}
    </div>
  );
};

export default FlashCard;
