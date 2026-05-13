# State Management Documentation

This document explains how state is managed in CubeMaster using Zustand.

## Store Overview

CubeMaster uses three Zustand stores to manage different aspects of the application:

### 1. useCubeStore

**Location:** `src/store/useCubeStore.ts`

**Purpose:** Manages the Rubik's Cube state and 3D view.

**State:**
```typescript
{
  faces: FaceColors;           // Current colors of each face
  rotation: { x: number; y: number };  // Camera rotation angles
  zoom: number;                // Camera zoom level
  isAlgorithmPlaying: boolean; // Whether an algorithm is playing
  currentAlgorithm: AlgorithmPlayback | null;  // Currently playing algorithm
}
```

**Actions:**
- `dispatch(action)` - Dispatch actions to update state
- `resetCube()` - Reset cube to initial state
- `rotateFace(x, y)` - Rotate cube to specific angles
- `setZoom(zoom)` - Set camera zoom level
- `startAlgorithm(id, name, moves)` - Start algorithm playback
- `stopAlgorithm()` - Stop algorithm playback
- `markAlgorithmComplete(algorithmId)` - Mark algorithm as complete

**Usage:**
```typescript
import { useCubeStore } from '../store/useCubeStore';

function MyComponent() {
  const { state, dispatch, resetCube } = useCubeStore();
  
  // Access state
  const { rotation, zoom, faces } = state;
  
  // Call actions
  resetCube();
  dispatch({ type: 'MOVE_FACE', payload: faces, move: 'R' });
}
```

---

### 2. useProgressStore

**Location:** `src/store/useProgressStore.ts`

**Purpose:** Manages user progress and achievements.

**State:**
```typescript
{
  solves: SolveRecord[];           // List of solve records
  achievements: Achievement[];     // Earned achievements
  dailyStreak: number;             // Current daily streak
  lastSolveDate: string | null;    // Date of last solve
  skillLevels: {
    cross: number;                 // Cross solving skill (0-10+)
    f2l: number;                   // F2L skill
    oll: number;                   // OLL skill
    pll: number;                   // PLL skill
  };
}
```

**Actions:**
- `addSolve(solve)` - Add a new solve to history
- `completeAlgorithm(algorithmId)` - Mark algorithm as completed
- `incrementSkillLevel(skill, amount)` - Increase skill level
- `getStats()` - Get statistics (total solves, best time, avg5, avg12)
- `updateDailyStreak()` - Update streak based on last solve

**Usage:**
```typescript
import { useProgressStore } from '../store/useProgressStore';

function MyComponent() {
  const { progress, addSolve, getStats } = useProgressStore();
  
  const stats = getStats();
  console.log('Best time:', stats.bestTime);
  
  addSolve({
    id: crypto.randomUUID(),
    time: 45123,
    date: new Date().toISOString(),
    scramble: "R U R' U'",
    session: 'default'
  });
}
```

---

### 3. useThemeStore

**Location:** `src/store/useThemeStore.ts`

**Purpose:** Manages light/dark theme and colors.

**State:**
```typescript
{
  mode: 'light' | 'dark';        // Current theme mode
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}
```

**Actions:**
- `toggleTheme()` - Toggle between light and dark themes

**Usage:**
```typescript
import { useThemeStore } from '../store/useThemeStore';

function MyComponent() {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello</Text>
    </View>
  );
}
```

---

## Best Practices

1. **Use stores directly:** Avoid creating unnecessary wrapper hooks unless there's significant logic.

2. **Keep state minimal:** Only store what's needed for rendering. Computed values can be derived from state.

3. **Use immer-style updates:** Zustand automatically handles immutable updates, so you can mutate state directly in the setter.

4. **Avoid circular dependencies:** Don't have stores depend on each other directly.

5. **Type your state:** Define interfaces for all state shapes to ensure type safety.
