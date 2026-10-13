export type QuantifierCategory = 'countable' | 'uncountable' | 'both';

export interface QuantifierWord {
  word: string;
  category: QuantifierCategory;
  definition: string;
  examples: string[];
  tips?: string;
  pairedWith?: 'countable' | 'uncountable' | 'both';
}

export interface Sticker {
  id: string;
  chapterId: number;
  title: string;
  subtitle: string;
  icon: string;
  badgeColor: string;
  description: string;
  requirement: string;
}

export interface NounItem {
  id: string;
  noun: string;
  isCountable: boolean;
  pluralForm?: string;
  icon: string;
  explanation: string;
  exampleQuantifiers: string[];
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  theme: string;
  icon: string;
  objective: string;
  description: string;
  narrative: {
    character: string;
    avatar: string;
    story: string[];
  };
  keyRules: {
    title: string;
    explanation: string;
    examples: { text: string; highlight: string }[];
    proTip?: string;
  }[];
  practiceTasksCount: number;
  minigameId: string;
  minigameName: string;
  minigameDescription: string;
  rewardSticker: Sticker;
}

export interface QuizQuestion {
  id: number;
  chapter: number;
  objective: 'identify' | 'distinguish' | 'use';
  prompt: string;
  contextSentence?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  categoryTag: string;
}

export interface UserProfile {
  name: string;
  className: string;
  avatar: string;
}

export interface MultiplayerPlayer {
  id: string;
  name: string;
  playerClass?: string;
  score: number;
  streak: number;
  currentQuestion: number;
  completed: boolean;
  isHost: boolean;
  avatar: string;
  lastAnswerCorrect?: boolean;
}

export interface MultiplayerRoom {
  code: string;
  status: 'lobby' | 'countdown' | 'in_game' | 'finished';
  hostId: string;
  players: Record<string, MultiplayerPlayer>;
  questions: QuizQuestion[];
  currentRound: number;
  startTime?: number;
}

export interface ReflectionData {
  mostChallenging: string;
  dailyObservation: string;
  customSentenceCountable: string;
  customSentenceUncountable: string;
  keyTakeaway: string;
  submittedAt?: string;
}

export interface CertificateData {
  recipientName: string;
  recipientClass?: string;
  scorePercent: number;
  dateEarned: string;
  certificateId: string;
  honorsTitle: string;
  objectivesMastered: string[];
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  playerClass?: string;
  avatar: string;
  category: 'overall' | 'quiz' | 'multiplayer';
  score: number;
  accuracyPercent?: number;
  stickersCount?: number;
  note?: string;
  date: string;
  timestamp: number;
}
