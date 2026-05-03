import { useState, useCallback } from 'react';
import { Character, StudyMode } from '../types';

export const TRANSITION_DURATION = 100; // ms

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

  const changeCard = useCallback((newIndex: number) => {
    // Hide the answer and flip back before changing the character
    setShowAnswer(false);
    setIsFlipped(false);

    // Wait for the flip animation to complete before changing the card content
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setCurrentCharacter(studyCharacters[newIndex]);
    }, TRANSITION_DURATION);
  }, [studyCharacters]);

  const nextCard = useCallback(() => {
    if (currentIndex < studyCharacters.length - 1) {
      changeCard(currentIndex + 1);
    }
  }, [currentIndex, studyCharacters, changeCard]);

  const previousCard = useCallback(() => {
    if (currentIndex > 0) {
      changeCard(currentIndex - 1);
    }
  }, [currentIndex, changeCard]);

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
    if (studyCharacters.length <= 1) return;

    // Shuffle from the current card to the end, keeping answered state with the character
    const remainingChars = studyCharacters.slice(currentIndex);
    const remainingAns = answered.slice(currentIndex);

    if (remainingChars.length <= 1) return;

    // Combine for tandem shuffle
    const combined = remainingChars.map((char, i) => ({
      char,
      ans: remainingAns[i]
    }));

    const shuffled = [...combined].sort(() => Math.random() - 0.5);

    const newStudyCharacters = [
      ...studyCharacters.slice(0, currentIndex),
      ...shuffled.map(item => item.char)
    ];

    const newAnswered = [
      ...answered.slice(0, currentIndex),
      ...shuffled.map(item => item.ans)
    ];

    setStudyCharacters(newStudyCharacters);
    setAnswered(newAnswered);
    setCurrentCharacter(shuffled[0].char);
    setIsFlipped(false);
    setShowAnswer(false);
  }, [studyCharacters, currentIndex, answered]);

  const skipCard = useCallback(() => {
    if (studyCharacters.length <= 1) return;

    const current = studyCharacters[currentIndex];
    const isAns = answered[currentIndex];

    // Move current card to the end
    const newStudyCharacters = [
      ...studyCharacters.slice(0, currentIndex),
      ...studyCharacters.slice(currentIndex + 1),
      current
    ];

    // Update answered array as well
    const newAnswered = [
      ...answered.slice(0, currentIndex),
      ...answered.slice(currentIndex + 1),
      isAns
    ];

    setStudyCharacters(newStudyCharacters);
    setAnswered(newAnswered);

    // Stay at the same index, which now points to the "next" card
    // unless we were at the very end (which shouldn't happen with hasNext check)
    // but we need to update the currentCharacter
    setCurrentCharacter(newStudyCharacters[currentIndex]);
    setIsFlipped(false);
    setShowAnswer(false);
  }, [studyCharacters, currentIndex, answered]);

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
    skipCard,
    resetSession,
    hasNext: currentIndex < studyCharacters.length - 1,
    hasPrevious: currentIndex > 0,
    totalCards: studyCharacters.length,
  };
};
