import React, { useState, useEffect } from 'react';
import { Character, StudyMode } from './types';
import { allCharacters } from './data/characters';
import { useProgress } from './hooks/useProgress';
import { useStudySession } from './hooks/useStudySession';
import FlashCard from './components/FlashCard';
import CharacterSelector from './components/CharacterSelector';
import ProgressStats from './components/ProgressStats';
import { 
  saveSessionData, 
  loadSessionData, 
  clearSessionData, 
  hasValidSessionData,
  saveModeData,
  loadModeData,
  clearModeData,
  hasValidModeData,
  saveThemeData,
  loadThemeData,
  clearThemeData,
  hasValidThemeData,
  clearAllData
} from './utils/localStorage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'study' | 'progress'>('home');
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>('character-to-sound');
  const [darkMode, setDarkMode] = useState(false);
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const [hasLoadedMode, setHasLoadedMode] = useState(false);
  const [hasLoadedTheme, setHasLoadedTheme] = useState(false);

  const { progress, updateProgress, getMasteredCharacters, getWeakCharacters, resetProgress, isLoaded } = useProgress();
  const {
    currentCharacter,
    currentIndex,
    mode,
    isFlipped,
    showAnswer,
    startSession,
    nextCard,
    previousCard,
    flipCard,
    shuffleCards,
    resetSession,
    hasNext,
    hasPrevious,
    totalCards,
    isCurrentCardAnswered,
    markAsAnswered,
  } = useStudySession();

  // Load saved data on app start
  useEffect(() => {
    const savedSession = loadSessionData();
    const savedMode = loadModeData();
    const savedTheme = loadThemeData();
    
    if (savedSession) {
      setSelectedCharacters(savedSession.selectedCharacters);
      setStudyMode(savedSession.studyMode);
      setHasLoadedSession(true);
      console.log('Loaded saved session:', {
        characters: savedSession.selectedCharacters.length,
        mode: savedSession.studyMode
      });
    } else {
      setHasLoadedSession(true);
    }
    
    if (savedMode) {
      setStudyMode(savedMode);
      setHasLoadedMode(true);
      console.log('Loaded saved mode:', savedMode);
    } else {
      setHasLoadedMode(true);
    }
    
    if (savedTheme !== null) {
      setDarkMode(savedTheme);
      setHasLoadedTheme(true);
      console.log('Loaded saved theme:', savedTheme ? 'dark' : 'light');
    } else {
      setHasLoadedTheme(true);
    }
  }, []);

  // Save session data when characters change
  useEffect(() => {
    if (hasLoadedSession && selectedCharacters.length > 0) {
      saveSessionData(selectedCharacters, studyMode);
    }
  }, [selectedCharacters, studyMode, hasLoadedSession]);

  // Save mode data when mode changes
  useEffect(() => {
    if (hasLoadedMode) {
      saveModeData(studyMode);
    }
  }, [studyMode, hasLoadedMode]);

  // Save theme data when theme changes
  useEffect(() => {
    if (hasLoadedTheme) {
      saveThemeData(darkMode);
    }
  }, [darkMode, hasLoadedTheme]);

  const handleStartStudy = () => {
    if (selectedCharacters.length === 0) {
      alert('Please select characters to study');
      return;
    }
    startSession(selectedCharacters, studyMode);
    setCurrentView('study');
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (currentCharacter && !isCurrentCardAnswered) {
      updateProgress(currentCharacter.id, isCorrect);
      markAsAnswered();
      
      // Auto-advance to the next card after a short delay
      setTimeout(() => {
        if (hasNext) {
          nextCard();
        } else {
          // Optional: handle session completion
          alert("Study session complete!");
          handleBackToHome();
        }
      }, 0); // 0ms delay to see feedback
    }
  };

  const handleBackToHome = () => {
    resetSession();
    setCurrentView('home');
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      resetProgress();
      clearAllData();
    }
  };

  const handleClearSession = () => {
    if (window.confirm('Are you sure you want to clear saved session data?')) {
      clearSessionData();
      setSelectedCharacters([]);
    }
  };

  const handleClearMode = () => {
    if (window.confirm('Are you sure you want to clear saved mode data?')) {
      clearModeData();
      setStudyMode('character-to-sound');
    }
  };

  const handleClearTheme = () => {
    if (window.confirm('Are you sure you want to clear saved theme data?')) {
      clearThemeData();
      setDarkMode(false);
    }
  };

  // Show loading state while data is being loaded
  if (!isLoaded || !hasLoadedSession || !hasLoadedMode || !hasLoadedTheme) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'dark bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
              <div className="animate-pulse text-2xl font-bold text-primary-color mb-4">
                🎌 Japanese Character Learning
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Loading your settings...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-dark-bg' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary-color">
              Japanese Flashcards
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentView === 'study' && currentCharacter && (
                  <span>{currentIndex + 1} / {totalCards}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('progress')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === 'progress'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Progress
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {currentView === 'home' && (
            <div className="space-y-8">
              {/* Study Mode Selection */}
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-primary-color mb-4">
                  Choose Study Mode
                </h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setStudyMode('character-to-sound')}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      studyMode === 'character-to-sound'
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Character → Pronunciation
                  </button>
                  <button
                    onClick={() => setStudyMode('sound-to-character')}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      studyMode === 'sound-to-character'
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Pronunciation → Character
                  </button>
                </div>
              </div>

              {/* Character Selection */}
              <CharacterSelector
                characters={allCharacters}
                selectedCharacters={selectedCharacters}
                onSelectionChange={setSelectedCharacters}
              />

              {/* Start Study Button */}
              <div className="text-center">
                <button
                  onClick={handleStartStudy}
                  disabled={selectedCharacters.length === 0}
                  className="px-8 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Studying ({selectedCharacters.length} characters)
                </button>
              </div>
            </div>
          )}

          {currentView === 'study' && currentCharacter && (
            <div className="space-y-8">
              {/* Study Controls */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleBackToHome}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← Back to Home
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={shuffleCards}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Shuffle
                  </button>
                  <button
                    onClick={previousCard}
                    disabled={!hasPrevious}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={nextCard}
                    disabled={!hasNext}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Flash Card */}
              <div className="flex justify-center">
                <FlashCard
                  character={currentCharacter}
                  mode={mode}
                  isFlipped={isFlipped}
                  showAnswer={showAnswer}
                  isAlreadyAnswered={isCurrentCardAnswered}
                  onFlip={flipCard}
                  onAnswer={handleAnswer}
                />
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
                />
              </div>
            </div>
          )}

          {currentView === 'progress' && (
            <div className="space-y-8">
              <ProgressStats characters={allCharacters} progress={progress} />
              
              <div className="text-center space-y-2">
                <button
                  onClick={handleResetProgress}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mr-2"
                >
                  Reset All Progress
                </button>
                <button
                  onClick={handleClearSession}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors mr-2"
                >
                  Clear Saved Session
                </button>
                <button
                  onClick={handleClearMode}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors mr-2"
                >
                  Clear Saved Mode
                </button>
                <button
                  onClick={handleClearTheme}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Saved Theme
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
