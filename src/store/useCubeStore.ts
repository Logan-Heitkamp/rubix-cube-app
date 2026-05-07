import { create } from 'zustand';
import { CubeState, FaceColors, INITIAL_FACE_COLORS, FACE_ROTATIONS, Move } from '../entities/types';

interface CubeStore {
  state: CubeState;
  dispatch: (action: { type: string; payload?: FaceColors | { x: number; y: number }; move?: string }) => void;
  resetCube: () => void;
  rotateFace: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
  startAlgorithm: (id: string, name: string, moves: Move[]) => void;
  stopAlgorithm: () => void;
  markAlgorithmComplete: (algorithmId: string) => void;
}

export const useCubeStore = create<CubeStore>()((set, get) => ({
  state: {
    faces: INITIAL_FACE_COLORS,
    rotation: { x: -25, y: 45 },
    zoom: 15,
    isAlgorithmPlaying: false,
    currentAlgorithm: null,
  },
  dispatch: (action) => {
    const { state } = get();
    if (action.type === 'MOVE_FACE' && action.payload && action.move) {
      // This would be handled by the move logic
      set((prev) => ({
        state: {
          ...prev.state,
          faces: { ...prev.state.faces },
        },
      }));
    } else if (action.type === 'RESET_CUBE') {
      set({
        state: {
          faces: INITIAL_FACE_COLORS,
          rotation: { x: -25, y: 45 },
          zoom: 15,
          isAlgorithmPlaying: false,
          currentAlgorithm: null,
        },
      });
    } else if (action.type === 'ROTATE_CAMERA') {
      const rotation = action.payload as { x: number; y: number };
      set((prev) => ({
        state: {
          ...prev.state,
          rotation: {
            x: prev.state.rotation.x + rotation.x,
            y: prev.state.rotation.y + rotation.y,
          },
        },
      }));
    }
  },
  resetCube: () =>
    set({
      state: {
        faces: INITIAL_FACE_COLORS,
        rotation: { x: -25, y: 45 },
        zoom: 15,
        isAlgorithmPlaying: false,
        currentAlgorithm: null,
      },
    }),
  rotateFace: (x, y) =>
    set((prev) => ({
      state: {
        ...prev.state,
        rotation: { x, y },
      },
    })),
  setZoom: (zoom) =>
    set((prev) => ({
      state: {
        ...prev.state,
        zoom,
      },
    })),
  startAlgorithm: (id, name, moves) =>
    set((prev) => ({
      state: {
        ...prev.state,
        isAlgorithmPlaying: true,
        currentAlgorithm: { id, name, moves, currentIndex: 0 },
      },
    })),
  stopAlgorithm: () =>
    set((prev) => ({
      state: {
        ...prev.state,
        isAlgorithmPlaying: false,
        currentAlgorithm: null,
      },
    })),
  markAlgorithmComplete: (algorithmId: string) =>
    set((prev) => ({
      state: {
        ...prev.state,
        isAlgorithmPlaying: false,
        currentAlgorithm: null,
      },
    })),
}));
