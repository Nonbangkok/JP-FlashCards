import { useState, useEffect, useRef } from 'react';
import { Progress, Character } from '../types';

const PROGRESS_KEY = 'japanese-flashcards-progress';

export const useProgress = () => {
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitialMount = useRef(true);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        // Convert date strings back to Date objects
        Object.values(parsed).forEach((p: any) => {
          p.lastReviewed = new Date(p.lastReviewed);
        });
        setProgress(parsed);
        console.log('Progress loaded from localStorage:', Object.keys(parsed).length, 'characters');
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save progress to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isLoaded && !isInitialMount.current) {
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        console.log('Progress saved to localStorage:', Object.keys(progress).length, 'characters');
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [progress, isLoaded]);

  const updateProgress = (characterId: string, isCorrect: boolean) => {
    setProgress(prev => {
      const current = prev[characterId] || {
        characterId,
        correct: 0,
        incorrect: 0,
        lastReviewed: new Date(),
        mastered: false,
      };

      const newCorrect = isCorrect ? current.correct + 1 : current.correct;
      const newIncorrect = !isCorrect ? current.incorrect + 1 : current.incorrect;

      // To be mastered: at least 3 correct AND more correct than incorrect
      // Also handles losing mastered status
      const isNowMastered = newCorrect >= 3 && newCorrect > newIncorrect;

      const updated = {
        ...current,
        correct: newCorrect,
        incorrect: newIncorrect,
        lastReviewed: new Date(),
        mastered: isNowMastered,
      };

      return {
        ...prev,
        [characterId]: updated,
      };
    });
  };

  const getProgress = (characterId: string): Progress => {
    return progress[characterId] || {
      characterId,
      correct: 0,
      incorrect: 0,
      lastReviewed: new Date(),
      mastered: false,
    };
  };

  const getMasteredCharacters = (characters: Character[]): Character[] => {
    return characters.filter(char => progress[char.id]?.mastered);
  };

  const getWeakCharacters = (characters: Character[]): Character[] => {
    return characters.filter(char => {
      const charProgress = progress[char.id];
      if (!charProgress) return true;
      return charProgress.incorrect > charProgress.correct;
    });
  };

  const resetProgress = () => {
    setProgress({});
    localStorage.removeItem(PROGRESS_KEY);
  };

  return {
    progress,
    updateProgress,
    getProgress,
    getMasteredCharacters,
    getWeakCharacters,
    resetProgress,
    isLoaded,
  };
};
