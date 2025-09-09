export interface Character {
  id: string;
  character: string;
  romaji: string;
  meaning?: string;
  type: 'hiragana' | 'katakana' | 'kanji';
  level?: number; // For kanji difficulty level (N5, N4, N3, N2, N1)
}

export interface Progress {
  characterId: string;
  correct: number;
  incorrect: number;
  lastReviewed: Date;
  mastered: boolean;
}

export interface StudySession {
  id: string;
  characters: Character[];
  mode: 'character-to-sound' | 'sound-to-character';
  startTime: Date;
  endTime?: Date;
  score: number;
}

export type StudyMode = 'character-to-sound' | 'sound-to-character';
export type CharacterType = 'hiragana' | 'katakana' | 'kanji' | 'all';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5; // N5 to N1
