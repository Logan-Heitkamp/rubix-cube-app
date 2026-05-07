export type AlgorithmCategory = 'oll' | 'pll' | 'f2l';

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  notation: string;
  category: AlgorithmCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  moves: string[];
}
