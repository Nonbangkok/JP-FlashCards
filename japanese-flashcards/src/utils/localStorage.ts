import { Character, StudyMode } from '../types';

interface SavedSessionData {
  selectedCharacters: Character[];
  studyMode: StudyMode;
  timestamp: number;
  expiresAt: number;
}

interface SavedModeData {
  studyMode: StudyMode;
  timestamp: number;
  expiresAt: number;
}

interface SavedThemeData {
  darkMode: boolean;
  timestamp: number;
  expiresAt: number;
}

const SESSION_KEY = 'japanese-flashcards-session';
const MODE_KEY = 'japanese-flashcards-mode';
const THEME_KEY = 'japanese-flashcards-theme';
const EXPIRY_HOURS = 24;

export const saveSessionData = (selectedCharacters: Character[], studyMode: StudyMode) => {
  const now = Date.now();
  const expiresAt = now + (EXPIRY_HOURS * 60 * 60 * 1000); // 24 hours in milliseconds
  
  const sessionData: SavedSessionData = {
    selectedCharacters,
    studyMode,
    timestamp: now,
    expiresAt
  };
  
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    console.log('Session data saved successfully');
  } catch (error) {
    console.error('Failed to save session data:', error);
  }
};

export const loadSessionData = (): { selectedCharacters: Character[], studyMode: StudyMode } | null => {
  try {
    const savedData = localStorage.getItem(SESSION_KEY);
    if (!savedData) return null;
    
    const sessionData: SavedSessionData = JSON.parse(savedData);
    const now = Date.now();
    
    // Check if data has expired
    if (now > sessionData.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      console.log('Session data has expired and was removed');
      return null;
    }
    
    console.log('Session data loaded successfully');
    return {
      selectedCharacters: sessionData.selectedCharacters,
      studyMode: sessionData.studyMode
    };
  } catch (error) {
    console.error('Failed to load session data:', error);
    return null;
  }
};

export const saveModeData = (studyMode: StudyMode) => {
  const now = Date.now();
  const expiresAt = now + (EXPIRY_HOURS * 60 * 60 * 1000); // 24 hours in milliseconds
  
  const modeData: SavedModeData = {
    studyMode,
    timestamp: now,
    expiresAt
  };
  
  try {
    localStorage.setItem(MODE_KEY, JSON.stringify(modeData));
    console.log('Mode data saved successfully');
  } catch (error) {
    console.error('Failed to save mode data:', error);
  }
};

export const loadModeData = (): StudyMode | null => {
  try {
    const savedData = localStorage.getItem(MODE_KEY);
    if (!savedData) return null;
    
    const modeData: SavedModeData = JSON.parse(savedData);
    const now = Date.now();
    
    // Check if data has expired
    if (now > modeData.expiresAt) {
      localStorage.removeItem(MODE_KEY);
      console.log('Mode data has expired and was removed');
      return null;
    }
    
    console.log('Mode data loaded successfully');
    return modeData.studyMode;
  } catch (error) {
    console.error('Failed to load mode data:', error);
    return null;
  }
};

export const saveThemeData = (darkMode: boolean) => {
  const now = Date.now();
  const expiresAt = now + (EXPIRY_HOURS * 60 * 60 * 1000); // 24 hours in milliseconds
  
  const themeData: SavedThemeData = {
    darkMode,
    timestamp: now,
    expiresAt
  };
  
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(themeData));
    console.log('Theme data saved successfully');
  } catch (error) {
    console.error('Failed to save theme data:', error);
  }
};

export const loadThemeData = (): boolean | null => {
  try {
    const savedData = localStorage.getItem(THEME_KEY);
    if (!savedData) return null;
    
    const themeData: SavedThemeData = JSON.parse(savedData);
    const now = Date.now();
    
    // Check if data has expired
    if (now > themeData.expiresAt) {
      localStorage.removeItem(THEME_KEY);
      console.log('Theme data has expired and was removed');
      return null;
    }
    
    console.log('Theme data loaded successfully');
    return themeData.darkMode;
  } catch (error) {
    console.error('Failed to load theme data:', error);
    return null;
  }
};

export const clearSessionData = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
    console.log('Session data cleared');
  } catch (error) {
    console.error('Failed to clear session data:', error);
  }
};

export const clearModeData = () => {
  try {
    localStorage.removeItem(MODE_KEY);
    console.log('Mode data cleared');
  } catch (error) {
    console.error('Failed to clear mode data:', error);
  }
};

export const clearThemeData = () => {
  try {
    localStorage.removeItem(THEME_KEY);
    console.log('Theme data cleared');
  } catch (error) {
    console.error('Failed to clear theme data:', error);
  }
};

export const clearAllData = () => {
  clearSessionData();
  clearModeData();
  clearThemeData();
};

export const hasValidSessionData = (): boolean => {
  const data = loadSessionData();
  return data !== null;
};

export const hasValidModeData = (): boolean => {
  const data = loadModeData();
  return data !== null;
};

export const hasValidThemeData = (): boolean => {
  const data = loadThemeData();
  return data !== null;
};
