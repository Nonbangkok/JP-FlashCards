import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character, StudyMode } from './types';
import { allCharacters } from './data/characters';
import { useProgress } from './hooks/useProgress';
import { useStudySession } from './hooks/useStudySession';
import FlashCard from './components/FlashCard';
import CharacterSelector from './components/CharacterSelector';
import ProgressStats from './components/ProgressStats';
import Logo from './components/Logo';
import {
  saveSessionData,
  loadSessionData,
  clearSessionData,
  saveModeData,
  loadModeData,
  clearModeData,
  saveThemeData,
  loadThemeData,
  clearThemeData,
  clearAllData,
  saveColorTheme,
  loadColorTheme,
} from './utils/localStorage';
import './App.css';

type ColorTheme = 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'teal';

const COLOR_THEMES: { id: ColorTheme; label: string }[] = [
  { id: 'red', label: 'Red' },
  { id: 'blue', label: 'Blue' },
  { id: 'green', label: 'Green' },
  { id: 'purple', label: 'Purple' },
  { id: 'orange', label: 'Orange' },
  { id: 'teal', label: 'Teal' },
];

const pageVariants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.4, 0, 0.2, 1] as const,
  duration: 0.25,
};

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'study' | 'progress'>('home');
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>('character-to-sound');
  const [darkMode, setDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('red');
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const [hasLoadedMode, setHasLoadedMode] = useState(false);
  const [hasLoadedTheme, setHasLoadedTheme] = useState(false);
  const [showSessionComplete, setShowSessionComplete] = useState(false);

  const { progress, updateProgress, resetProgress, isLoaded } = useProgress();
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
    skipCard,
  } = useStudySession();

  useEffect(() => {
    const savedSession = loadSessionData();
    const savedMode = loadModeData();
    const savedTheme = loadThemeData();

    if (savedSession) {
      setSelectedCharacters(savedSession.selectedCharacters);
      setStudyMode(savedSession.studyMode);
    }
    setHasLoadedSession(true);

    if (savedMode) {
      setStudyMode(savedMode);
    }
    setHasLoadedMode(true);

    if (savedTheme !== null) {
      setDarkMode(savedTheme);
    }
    setHasLoadedTheme(true);

    const savedColorTheme = loadColorTheme();
    if (savedColorTheme) {
      setColorTheme(savedColorTheme as ColorTheme);
    }
  }, []);

  useEffect(() => {
    if (hasLoadedSession && selectedCharacters.length > 0) {
      saveSessionData(selectedCharacters, studyMode);
    }
  }, [selectedCharacters, studyMode, hasLoadedSession]);

  useEffect(() => {
    if (hasLoadedMode) {
      saveModeData(studyMode);
    }
  }, [studyMode, hasLoadedMode]);

  useEffect(() => {
    if (hasLoadedTheme) {
      saveThemeData(darkMode);
    }
  }, [darkMode, hasLoadedTheme]);

  const handleColorThemeChange = (theme: ColorTheme) => {
    setColorTheme(theme);
    saveColorTheme(theme);
  };

  const getShellClassName = () => {
    const classes = ['app-shell'];
    if (darkMode) classes.push('dark');
    if (colorTheme !== 'red') classes.push(`theme-${colorTheme}`);
    return classes.join(' ');
  };

  const handleStartStudy = () => {
    if (selectedCharacters.length === 0) return;
    startSession(selectedCharacters, studyMode);
    setCurrentView('study');
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (currentCharacter && !isCurrentCardAnswered) {
      updateProgress(currentCharacter.id, isCorrect);
      markAsAnswered();

      setTimeout(() => {
        if (hasNext) {
          nextCard();
        } else {
          setShowSessionComplete(true);
        }
      }, 150);
    }
  };

  const handleBackToHome = () => {
    resetSession();
    setShowSessionComplete(false);
    setCurrentView('home');
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      resetProgress();
      clearAllData();
    }
  };

  const handleClearSession = () => {
    if (window.confirm('Clear saved session data?')) {
      clearSessionData();
      setSelectedCharacters([]);
    }
  };

  const handleClearMode = () => {
    if (window.confirm('Clear saved mode preference?')) {
      clearModeData();
      setStudyMode('character-to-sound');
    }
  };

  const handleClearTheme = () => {
    if (window.confirm('Clear saved theme preference?')) {
      clearThemeData();
      setDarkMode(false);
    }
  };

  if (!isLoaded || !hasLoadedSession || !hasLoadedMode || !hasLoadedTheme) {
    return (
      <div className={getShellClassName()}>
        <div className="loading-screen">
          <Logo size={64} className="loading-logo" />
          <div className="loading-text">Japanese Learning Zone</div>
          <div className="loading-subtext">Loading your progress...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={getShellClassName()}>
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="app-brand" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>
            <Logo size={40} className="app-logo" />
            <div>
              <div className="app-title">Japanese Learning Zone</div>
              <div className="app-title-jp">日本語を学ぼう</div>
            </div>
          </div>
          <div className="header-actions">
            {currentView === 'study' && currentCharacter && (
              <span className="card-counter">{currentIndex + 1} / {totalCards}</span>
            )}
            <div className="theme-picker">
              {COLOR_THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleColorThemeChange(t.id)}
                  className={`theme-swatch theme-swatch-${t.id} ${colorTheme === t.id ? 'active' : ''}`}
                  aria-label={`${t.label} theme`}
                  title={t.label}
                  type="button"
                />
              ))}
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle"
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? '\u2600' : '\u263E'}
            </button>
          </div>
        </header>

        {/* Navigation */}
        {currentView !== 'study' && (
          <nav className="app-nav" role="tablist">
            <button
              role="tab"
              aria-selected={currentView === 'home'}
              onClick={() => setCurrentView('home')}
              className={`nav-tab ${currentView === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button
              role="tab"
              aria-selected={currentView === 'progress'}
              onClick={() => setCurrentView('progress')}
              className={`nav-tab ${currentView === 'progress' ? 'active' : ''}`}
            >
              Progress
            </button>
          </nav>
        )}

        {/* Main Content */}
        <main>
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div
                key="home"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="stack-lg"
              >
                {/* Study Mode Selection */}
                <div className="card">
                  <div className="card-title">Study Mode</div>
                  <div className="flex-row gap-3 flex-wrap">
                    <button
                      onClick={() => setStudyMode('character-to-sound')}
                      className={`mode-card ${studyMode === 'character-to-sound' ? 'selected' : ''}`}
                      type="button"
                    >
                      <span className="mode-card-icon" aria-hidden="true">&#23383;</span>
                      <span className="mode-card-text">
                        <span className="mode-card-label">Character &rarr; Sound</span>
                        <span className="mode-card-desc">See character, recall pronunciation</span>
                      </span>
                    </button>
                    <button
                      onClick={() => setStudyMode('sound-to-character')}
                      className={`mode-card ${studyMode === 'sound-to-character' ? 'selected' : ''}`}
                      type="button"
                    >
                      <span className="mode-card-icon" aria-hidden="true">&#127911;</span>
                      <span className="mode-card-text">
                        <span className="mode-card-label">Sound &rarr; Character</span>
                        <span className="mode-card-desc">See pronunciation, recall character</span>
                      </span>
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
                <div className="start-section">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartStudy}
                    disabled={selectedCharacters.length === 0}
                    className="btn btn-primary btn-lg"
                  >
                    Start Studying <span className="start-btn-count">({selectedCharacters.length} characters)</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentView === 'study' && currentCharacter && (
              <motion.div
                key="study"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="stack-lg"
              >
                {/* Study Controls */}
                <div className="study-controls">
                  <button onClick={handleBackToHome} className="btn btn-ghost" type="button">
                    &larr; Back
                  </button>
                  <div className="study-controls-group">
                    <button onClick={shuffleCards} className="btn btn-secondary" type="button">
                      Shuffle
                    </button>
                    <button
                      onClick={previousCard}
                      disabled={!hasPrevious}
                      className="btn btn-secondary"
                      type="button"
                    >
                      &larr; Prev
                    </button>
                    <button
                      onClick={nextCard}
                      disabled={!hasNext}
                      className="btn btn-secondary"
                      type="button"
                    >
                      Next &rarr;
                    </button>
                    <button
                      onClick={skipCard}
                      disabled={!hasNext}
                      className="btn btn-secondary"
                      type="button"
                      title="Move this card to the end of the deck"
                    >
                      Skip
                    </button>
                  </div>
                </div>

                {/* Flash Card */}
                <div className="study-flashcard-area">
                  <div className="flashcard-wrapper">
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
                </div>

                {/* Progress Bar */}
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}

            {currentView === 'progress' && (
              <motion.div
                key="progress"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="stack-lg"
              >
                <ProgressStats characters={allCharacters} progress={progress} />

                <div className="data-management">
                  <button onClick={handleResetProgress} className="btn btn-danger" type="button">
                    Reset All Progress
                  </button>
                  <button onClick={handleClearSession} className="btn btn-secondary" type="button">
                    Clear Session
                  </button>
                  <button onClick={handleClearMode} className="btn btn-secondary" type="button">
                    Clear Mode
                  </button>
                  <button onClick={handleClearTheme} className="btn btn-secondary" type="button">
                    Clear Theme
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Session Complete Overlay */}
      <AnimatePresence>
        {showSessionComplete && (
          <motion.div
            className="session-complete-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackToHome}
          >
            <motion.div
              className="session-complete-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="session-complete-icon" aria-hidden="true">&#127881;</div>
              <div className="session-complete-title">Session Complete!</div>
              <div className="session-complete-desc">
                Great work! You've reviewed all {totalCards} cards in this session.
              </div>
              <button onClick={handleBackToHome} className="btn btn-primary btn-lg" type="button">
                Back to Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
