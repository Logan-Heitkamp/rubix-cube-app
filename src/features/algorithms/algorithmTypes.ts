/** Category of Rubik's Cube algorithm */
export type AlgorithmCategory = 'oll' | 'pll' | 'f2l';

/**
 * Represents a Rubik's Cube algorithm
 */
export interface Algorithm {
  /** Unique identifier for the algorithm */
  id: string;
  /** Display name of the algorithm */
  name: string;
  /** Description of what the algorithm does */
  description: string;
  /** Standard notation for the moves */
  notation: string;
  /** Category of algorithm (OLL, PLL, or F2L) */
  category: AlgorithmCategory;
  /** Difficulty level */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** Array of individual moves */
  moves: string[];
}
