# CubeMaster - Architecture Documentation

## Overview

CubeMaster is a React Native application for Rubik's Cube enthusiasts. It provides features for tracking solves, learning algorithms, and practicing cube solving techniques.

## Tech Stack

- **Framework:** React Native with Expo
- **3D Rendering:** Three.js
- **State Management:** Zustand
- **Build Tool:** Metro (Expo)

## Project Structure

```
cubeProject/
├── src/
│   ├── features/           # Feature modules
│   │   ├── cube/          # Cube view and controls
│   │   ├── algorithms/    # Algorithm library
│   │   ├── timer/         # Speed timer
│   │   ├── progress/      # Progress tracking
│   │   └── trainer/       # Algorithm trainer
│   ├── shared/            # Shared code
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   ├── store/             # Zustand state stores
│   ├── entities/          # Domain entities
│   ├── config/            # Configuration files
│   └── App.tsx            # Main app component
└── docs/                  # Documentation
```

## State Management

### Zustand Stores

The app uses Zustand for state management with separate stores for different concerns:

#### useCubeStore
Manages cube state including:
- Face colors
- Camera rotation
- Zoom level
- Algorithm playback state

#### useProgressStore
Manages user progress including:
- Solve history
- Achievements
- Daily streak
- Skill levels (cross, f2l, oll, pll)

#### useThemeStore
Manages theme state:
- Light/dark mode
- Color palette

## Component Architecture

### CubeView
Main view combining:
- `CubeCanvas` - 3D rendering with Three.js
- `CubeControls` - Face rotation buttons
- Touch gestures for camera rotation

### AlgorithmList
Algorithm library with:
- Filtering by category (OLL, PLL, F2L)
- Search functionality
- Algorithm preview modal

### Timer
Speed timer with:
- Inspection phase (15 seconds)
- Timing with 10ms precision
- Ao5/Ao12 statistics
- Solve history

## 3D Rendering

The app uses Three.js for rendering the Rubik's Cube:

1. Creates 27 individual cubies
2. Colors faces based on position
3. Animates camera based on state
4. Handles resize events

## Algorithm System

Algorithms are stored as arrays of move strings:
- OLL (Orientation of Last Layer): 5 algorithms
- PLL (Permutation of Last Layer): 5 algorithms
- F2L (First Two Layers): 5 algorithms

Each algorithm includes:
- ID for tracking completion
- Name and description
- Standard notation
- Individual moves for step-by-step practice

## Theming

The app supports light and dark themes:
- Defined in `src/shared/types/theme.ts`
- Colors stored in Zustand store
- Applied via context
