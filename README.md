# CubeMaster - Rubik's Cube Learning App

A cross-platform Rubik's Cube learning application built with React Native and Expo. Features an interactive 3D cube for visualizing algorithms, along with tools for learning, practicing, and tracking progress.

## Features

- **Interactive 3D Cube** - Realistic 3D cube rendering with touch/mouse controls
- **Algorithm Library** - OLL (57), PLL (21), and F2L (41) algorithms
- **Algorithm Player** - Step-by-step playback with pause/rewind controls
- **Speed Timer** - Official WCA-style timer with inspection countdown
- **Progress Tracking** - Stats dashboard with streak counter and skill levels
- **Learning Trainer** - Guided practice mode with hint system

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo |
| 3D Graphics | Three.js |
| State Management | Zustand |
| Styling | React Native StyleSheet |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/rubix-cube-app.git
cd rubix-cube-app

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser

## Project Structure

```
src/
├── app/                    # App entry points
│   └── store/             # Zustand state management
│       ├── useCubeStore.ts
│       ├── useProgressStore.ts
│       └── useThemeStore.ts
├── entities/              # Domain models
│   └── types.ts           # TypeScript type definitions
├── features/              # Feature modules
│   ├── cube/              # 3D cube component
│   ├── algorithms/        # Algorithm library
│   ├── timer/             # Timer functionality
│   ├── progress/          # Progress tracking
│   └── trainer/           # Learning mode
├── shared/                # Shared code
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions
│   └── types/             # Shared type definitions
└── config/                # Configuration files
```

## Algorithm Notation

The app uses standard Rubik's Cube notation:

- **U, D, F, B, L, R** - Face moves (Up, Down, Front, Back, Left, Right)
- **'** - Counter-clockwise (prime)
- **2** - Double turn (180 degrees)

Example: `R U R' U'` means: Right clockwise, Up clockwise, Right counter-clockwise, Up counter-clockwise.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Expo](https://expo.dev)
- 3D rendering powered by [Three.js](https://threejs.org)
