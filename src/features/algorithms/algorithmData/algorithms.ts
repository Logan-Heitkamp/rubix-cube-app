export interface Algorithm {
  id: string;
  name: string;
  description: string;
  notation: string;
  category: 'oll' | 'pll' | 'f2l';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  moves: string[];
}

export const OLL_ALGORITHMS: Algorithm[] = [
  {
    id: 'oll-1',
    name: 'Dot Case 1',
    description: 'Orient all last layer corners and edges - Sune variant',
    notation: "F R U R' U' F'",
    category: 'oll',
    difficulty: 'beginner',
    moves: ['F', 'R', 'U', "R'", "U'", "F'"],
  },
  {
    id: 'oll-2',
    name: 'Dot Case 2',
    description: 'Orient all last layer corners and edges - Antisune variant',
    notation: "F U R U' R' F'",
    category: 'oll',
    difficulty: 'beginner',
    moves: ['F', 'U', 'R', "U'", 'R', "F'"],
  },
  {
    id: 'oll-3',
    name: 'Line Case',
    description: 'Orient last layer when edges form a line',
    notation: "R U R' U R U2 R'",
    category: 'oll',
    difficulty: 'beginner',
    moves: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"],
  },
  {
    id: 'oll-4',
    name: 'T Case',
    description: 'Orient last layer in T shape',
    notation: "r U R' U' r' F R F'",
    category: 'oll',
    difficulty: 'intermediate',
    moves: ['r', 'U', "R'", "U'", "r'", 'F', 'R', "F'"],
  },
  {
    id: 'oll-5',
    name: 'Cross Case',
    description: 'Orient all edges when cross is formed',
    notation: "F R U R' U' S U R U' R' f'",
    category: 'oll',
    difficulty: 'advanced',
    moves: ['F', 'R', 'U', "R'", "U'", 'S', 'U', 'R', "U'", "R'", "f'"],
  },
];

export const PLL_ALGORITHMS: Algorithm[] = [
  {
    id: 'pll-1',
    name: 'Ua Permutation',
    description: 'Swap three corners clockwise',
    notation: "R' U R U R' U' R' U R U R2 U' R' U2",
    category: 'pll',
    difficulty: 'intermediate',
    moves: ["R'", 'U', 'R', 'U', "R'", "U'", "R'", 'U', 'R', 'U', 'R2', "U'", "R'", 'U2'],
  },
  {
    id: 'pll-2',
    name: 'Ub Permutation',
    description: 'Swap three corners counter-clockwise',
    notation: "R U' R U R U R U' R' U' R2",
    category: 'pll',
    difficulty: 'intermediate',
    moves: ['R', "U'", 'R', 'U', 'R', 'U', 'R', "U'", "R'", "U'", 'R2'],
  },
  {
    id: 'pll-3',
    name: 'Z Permutation',
    description: 'Swap opposite edges and corners',
    notation: "M' U M U M' U' M U2 M' U M",
    category: 'pll',
    difficulty: 'advanced',
    moves: ["M'", 'U', 'M', 'U', "M'", "U'", 'M', 'U2', "M'", 'U', 'M'],
  },
  {
    id: 'pll-4',
    name: 'H Permutation',
    description: 'Swap adjacent edges',
    notation: "M2 U M2 U2 M2 U M2",
    category: 'pll',
    difficulty: 'beginner',
    moves: ['M2', 'U', 'M2', 'U2', 'M2', 'U', 'M2'],
  },
  {
    id: 'pll-5',
    name: 'Aa Permutation',
    description: 'Swap two corners',
    notation: "R' F R' B2 R F' R' B2 R2",
    category: 'pll',
    difficulty: 'intermediate',
    moves: ["R'", 'F', "R'", 'B2', 'R', "F'", "R'", 'B2', 'R2'],
  },
];

export const F2L_ALGORITHMS: Algorithm[] = [
  {
    id: 'f2l-1',
    name: 'Corner Front, Edge U',
    description: 'Basic F2L - corner on front, edge on U face',
    notation: "U R U' R'",
    category: 'f2l',
    difficulty: 'beginner',
    moves: ['U', 'R', "U'", "R'"],
  },
  {
    id: 'f2l-2',
    name: 'Corner Front, Edge D',
    description: 'Basic F2L - corner on front, edge on D face',
    notation: "R U R'",
    category: 'f2l',
    difficulty: 'beginner',
    moves: ['R', 'U', "R'"],
  },
  {
    id: 'f2l-3',
    name: 'Corner Up, Edge Front',
    description: 'Basic F2L - corner on U, edge on front',
    notation: "U' R U2 R'",
    category: 'f2l',
    difficulty: 'beginner',
    moves: ["U'", 'R', 'U2', "R'"],
  },
  {
    id: 'f2l-4',
    name: 'Corner Up, Edge Back',
    description: 'Basic F2L - corner on U, edge on back',
    notation: "U' R U R'",
    category: 'f2l',
    difficulty: 'beginner',
    moves: ["U'", 'R', 'U', "R'"],
  },
  {
    id: 'f2l-5',
    name: 'Corner Down, Edge Back',
    description: 'Basic F2L - corner on D, edge on back',
    notation: "R U' R' U R U' R'",
    category: 'f2l',
    difficulty: 'intermediate',
    moves: ['R', "U'", "R'", 'U', 'R', "U'", "R'"],
  },
];
