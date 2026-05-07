import { create } from 'zustand';
import { CubeState, FaceColors, INITIAL_FACE_COLORS, FACE_ROTATIONS, Move } from '../entities/types';

/**
 * State management for the Rubik's Cube
 */
interface CubeStore {
  /** Current cube state */
  state: CubeState;
  /** Dispatch actions to update cube state */
  dispatch: (action: { type: string; payload?: FaceColors | { x: number; y: number }; move?: string }) => void;
  /** Reset cube to initial state */
  resetCube: () => void;
  /** Rotate cube to specific angles */
  rotateFace: (x: number, y: number) => void;
  /** Set camera zoom level */
  setZoom: (zoom: number) => void;
  /** Start playing an algorithm */
  startAlgorithm: (id: string, name: string, moves: Move[]) => void;
  /** Stop algorithm playback */
  stopAlgorithm: () => void;
  /** Mark an algorithm as complete */
  markAlgorithmComplete: (algorithmId: string) => void;
}

/**
 * Zustand store for cube state management
 * Handles cube rotation, zoom, and algorithm playback
 */
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
