# Adding New Algorithms

This guide explains how to add new algorithms to the CubeMaster application.

## Algorithm Format

Algorithms are defined in `src/features/algorithms/algorithmDefinitions/algorithms.ts`. Each algorithm has the following structure:

```typescript
{
  id: 'algorithm-id',           // Unique identifier
  name: 'Algorithm Name',       // Display name
  description: 'Description',   // What the algorithm does
  notation: "R U R' U'",        // Standard notation (space-separated)
  category: 'oll',              // 'oll', 'pll', or 'f2l'
  difficulty: 'beginner',       // 'beginner', 'intermediate', or 'advanced'
  moves: ['R', 'U', "R'", "U'"] // Array of individual moves
}
```

## Adding an Algorithm

1. Open `src/features/algorithms/algorithmDefinitions/algorithms.ts`
2. Find the appropriate array (OLL_ALGORITHMS, PLL_ALGORITHMS, or F2L_ALGORITHMS)
3. Add a new algorithm object to the array

Example:
```typescript
export const OLL_ALGORITHMS: Algorithm[] = [
  // ... existing algorithms ...
  {
    id: 'oll-6',
    name: 'New Case',
    description: 'Orients last layer in new configuration',
    notation: "R U R' U R U2 R'",
    category: 'oll',
    difficulty: 'intermediate',
    moves: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"],
  },
];
```

## Algorithm Categories

### OLL (Orientation of Last Layer)
Algorithms that orient all pieces on the last layer. 57 total algorithms.

### PLL (Permutation of Last Layer)
Algorithms that permute pieces on the last layer. 21 total algorithms.

### F2L (First Two Layers)
Algorithms for solving the first two layers simultaneously. 41+ total algorithms.

## Difficulty Levels

- **Beginner:** Simple algorithms (4-6 moves), easy to memorize
- **Intermediate:** Moderate complexity (7-12 moves), requires some practice
- **Advanced:** Complex algorithms (13+ moves), requires muscle memory

## Testing Your Addition

1. Start the app: `npm start`
2. Navigate to the Algorithms tab
3. Your new algorithm should appear in the list
4. Tap it to view and practice

## Notes

- Algorithm IDs should be unique within their category (e.g., 'oll-1', 'oll-2')
- Notation should use standard cube notation (U, D, F, B, L, R with ' for prime and 2 for double)
- Moves array should match the notation string exactly
