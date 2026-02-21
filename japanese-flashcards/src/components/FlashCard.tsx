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
    // Reset feedback when card changes
    setAnswerResult(null);
  }, [character]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isAlreadyAnswered) return;

    setAnswerResult(isCorrect ? 'correct' : 'incorrect');
    onAnswer(isCorrect);
  };

  const renderFront = () => {
    if (mode === 'character-to-sound') {
      return (
        <div className="text-center">
          <div className="text-8xl font-bold text-primary mb-4">
            {character.character}
          </div>
          {character.type === 'kanji' && character.meaning && (
            <div className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {character.meaning}
            </div>
          )}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {character.type.toUpperCase()}
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-4">
            {character.romaji}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {character.type.toUpperCase()}
          </div>
        </div>
      );
    }
  };

  const renderBack = () => {
    const correctAnswer = mode === 'character-to-sound' ? character.romaji : character.character;

    return (
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-4">
          {correctAnswer}
        </div>
        {character.type === 'kanji' && character.meaning && (
          <div className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            {character.meaning}
          </div>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {character.type.toUpperCase()}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={character.id}
          // initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          // exit={{ opacity: 0, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className="flash-card-container"
        >
          <div
            className={`flash-card cursor-pointer`}
            onClick={!isFlipped ? onFlip : undefined}
          >
            <motion.div
              className="flash-card-inner"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 450 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`flash-card-front flex items-center justify-center bg-white dark:bg-dark-card ${answerResult === 'correct' ? 'border-2 border-green-500' : answerResult === 'incorrect' ? 'border-2 border-red-500' : ''
                }`}>
                {renderFront()}
              </div>
              <div className={`flash-card-back flex items-center justify-center bg-white dark:bg-dark-card ${answerResult === 'correct' ? 'border-2 border-green-500' : answerResult === 'incorrect' ? 'border-2 border-red-500' : ''
                }`}>
                {renderBack()}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {!isFlipped && (
        <div className="mt-6 text-center">
          <button
            onClick={onFlip}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Show Answer
          </button>
        </div>
      )}

      {showAnswer && !isAlreadyAnswered && (
        <div className="mt-6">
          <div className="text-center mb-4">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleAnswer(false)}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {isAlreadyAnswered && (
        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Answered. Please proceed to the next card.
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashCard;
