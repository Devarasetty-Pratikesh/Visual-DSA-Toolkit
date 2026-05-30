export type PageType =
  | 'dashboard'
  | 'sorting'
  | 'searching'
  | 'trees'
  | 'graphs'
  | 'recursion'
  | 'structures'
  | 'analyzer'
  | 'comparisons'
  | 'settings';

export interface AlgorithmComplexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export interface TheorySection {
  definition: string;
  principle: string;
  pseudocode: string;
  applications: string[];
  advantages: string[];
  disadvantages: string[];
  complexity: AlgorithmComplexity;
  questions: { question: string; answer: string }[];
}

export interface UserStats {
  visualizationsRun: number;
  challengesCompleted: number;
  timeSpentMinutes: number;
  favoriteAlgorithms: string[];
  solvedEasy: number;
  solvedMedium: number;
  solvedHard: number;
  history: {
    id: string;
    algorithmName: string;
    category: string;
    timestamp: string;
    durationMs: number;
  }[];
}

// Graph Visualizer structures
export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
  isDirected: boolean;
}

// Visualizer animation states
export type SortState = 'idle' | 'running' | 'paused' | 'sorted';
export type SearchState = 'idle' | 'running' | 'paused' | 'found' | 'not-found';

// Quiz / Challenges structure
export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  hint: string;
  codeTemplate?: string;
  testCases?: { input: string; expected: string }[];
}
