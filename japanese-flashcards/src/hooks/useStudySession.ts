import { useState, useCallback, useEffect } from 'react';
import { Character, StudyMode } from '../types';

export const useStudySession = () => {
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyCharacters, setStudyCharacters] = useState<Character[]>([]);
  const [mode, setMode] = useState<StudyMode>('character-to-sound');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState<boolean[]>([]);

  const startSession = useCallback((
    characters: Character[],
    studyMode: StudyMode,
    shuffle: boolean = true
  ) => {
    const sessionCharacters = shuffle ? [...characters].sort(() => Math.random() - 0.5) : characters;
    setStudyCharacters(sessionCharacters);
    setCurrentCharacter(sessionCharacters[0] || null);
    setCurrentIndex(0);
    setMode(studyMode);
    setIsFlipped(false);
    setShowAnswer(false);
    setAnswered(new Array(sessionCharacters.length).fill(false));
  }, []);

  const nextCard = useCallback(() => {
    if (currentIndex < studyCharacters.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentCharacter(studyCharacters[nextIndex]);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  }, [currentIndex, studyCharacters]);

  const previousCard = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentCharacter(studyCharacters[prevIndex]);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  }, [currentIndex, studyCharacters]);

  const flipCard = useCallback(() => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowAnswer(true);
    }
  }, [isFlipped]);

  const markAsAnswered = useCallback(() => {
    setAnswered(prev => {
      const newAnswered = [...prev];
      newAnswered[currentIndex] = true;
      return newAnswered;
    });
  }, [currentIndex]);

  const shuffleCards = useCallback(() => {
    const shuffled = [...studyCharacters].sort(() => Math.random() - 0.5);
    setStudyCharacters(shuffled);
    setCurrentIndex(0);
    setCurrentCharacter(shuffled[0] || null);
    setIsFlipped(false);
    setShowAnswer(false);
  }, [studyCharacters]);

  const resetSession = useCallback(() => {
    setCurrentCharacter(null);
    setCurrentIndex(0);
    setStudyCharacters([]);
    setIsFlipped(false);
    setShowAnswer(false);
    setAnswered([]);
  }, []);

  return {
    currentCharacter,
    currentIndex,
    studyCharacters,
    mode,
    isFlipped,
    showAnswer,
    isCurrentCardAnswered: answered[currentIndex] || false,
    startSession,
    nextCard,
    previousCard,
    flipCard,
    markAsAnswered,
    shuffleCards,
    resetSession,
    hasNext: currentIndex < studyCharacters.length - 1,
    hasPrevious: currentIndex > 0,
    totalCards: studyCharacters.length,
  };
};
