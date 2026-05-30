import { create } from 'zustand';
import { PageType, UserStats } from '../types';

interface AppState {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  speed: number; // Animation speed coefficient (e.g. 1 to 5)
  setSpeed: (speed: number) => void;
  stats: UserStats;
  incrementVisualizations: (algoName: string, category: string, durationMs: number) => void;
  completeChallenge: (challengeId: string, difficulty?: 'Easy' | 'Medium' | 'Hard') => void;
  toggleFavorite: (algoName: string) => void;
  addTimeSpent: (minutes: number) => void;
  resetProgress: () => void;
}

const DEFAULT_STATS: UserStats = {
  visualizationsRun: 28,
  challengesCompleted: 0, // Starts at exactly 0 quizzes!
  timeSpentMinutes: 345,
  favoriteAlgorithms: ['Dijkstra', 'Merge Sort', 'AVL Tree'],
  solvedEasy: 0,
  solvedMedium: 0,
  solvedHard: 0,
  history: [
    { id: '1', algorithmName: 'Bubble Sort', category: 'Sorting', timestamp: '2026-05-25T14:32:00.000Z', durationMs: 4200 },
    { id: '2', algorithmName: 'Dijkstra', category: 'Graphs', timestamp: '2026-05-26T18:15:00.000Z', durationMs: 8500 },
    { id: '3', algorithmName: 'Binary Search', category: 'Searching', timestamp: '2026-05-27T10:05:00.000Z', durationMs: 2400 },
    { id: '4', algorithmName: 'AVL Tree Rotations', category: 'Trees', timestamp: '2026-05-29T16:45:00.000Z', durationMs: 12000 },
    { id: '5', algorithmName: 'Fibonacci Recursion', category: 'Recursion', timestamp: '2026-05-30T11:20:00.000Z', durationMs: 5400 }
  ]
};

export const useAppStore = create<AppState>((set) => ({
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),
  speed: 3,
  setSpeed: (speed) => set({ speed }),
  stats: DEFAULT_STATS,
  incrementVisualizations: (algoName, category, durationMs) => set((state) => {
    const newHistory = [
      {
        id: Date.now().toString(),
        algorithmName: algoName,
        category,
        timestamp: new Date().toISOString(),
        durationMs
      },
      ...state.stats.history
    ].slice(0, 20); // Keep last 20

    return {
      stats: {
        ...state.stats,
        visualizationsRun: state.stats.visualizationsRun + 1,
        history: newHistory
      }
    };
  }),
  completeChallenge: (challengeId, difficulty = 'Easy') => set((state) => {
    const nextStats = { ...state.stats };
    nextStats.challengesCompleted += 1;
    if (difficulty === 'Easy') nextStats.solvedEasy += 1;
    else if (difficulty === 'Medium') nextStats.solvedMedium += 1;
    else if (difficulty === 'Hard') nextStats.solvedHard += 1;
    return { stats: nextStats };
  }),
  toggleFavorite: (algoName) => set((state) => {
    const isFav = state.stats.favoriteAlgorithms.includes(algoName);
    const favoriteAlgorithms = isFav
      ? state.stats.favoriteAlgorithms.filter(a => a !== algoName)
      : [...state.stats.favoriteAlgorithms, algoName];
    return {
      stats: {
        ...state.stats,
        favoriteAlgorithms
      }
    };
  }),
  addTimeSpent: (minutes) => set((state) => ({
    stats: {
      ...state.stats,
      timeSpentMinutes: state.stats.timeSpentMinutes + minutes
    }
  })),
  resetProgress: () => set({
    stats: {
      visualizationsRun: 0,
      challengesCompleted: 0,
      timeSpentMinutes: 0,
      favoriteAlgorithms: [],
      solvedEasy: 0,
      solvedMedium: 0,
      solvedHard: 0,
      history: []
    }
  })
}));
