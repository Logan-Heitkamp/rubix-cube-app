/** Represents a single Rubik's Cube move notation */
export type Move = string;

/** Axis of rotation for cube turns */
export type RotationAxis = 'x' | 'y' | 'z';

/** Map of face names to color values */
export type FaceColors = Record<string, string>;

/** Position of a cubie */
export interface CubiePosition {
  x: number;
  y: number;
  z: number;
}

/** Rotation of a cubie */
export interface CubieRotation {
  x: number;
  y: number;
  z: number;
}

/**
 * Represents the current state of the Rubik's Cube
 */
export interface CubeState {
  /** Current colors of each face */
  faces: FaceColors;
  /** Camera rotation angles */
  rotation: { x: number; y: number };
  /** Camera zoom level */
  zoom: number;
  /** Whether an algorithm is currently playing */
  isAlgorithmPlaying: boolean;
  /** Currently playing algorithm (if any) */
  currentAlgorithm: AlgorithmPlayback | null;
  /** Setup moves to apply to the cube initially */
  setupMoves: string;
  /** Algorithm moves to play back */
  algorithmMoves: string;
  /** Current move index in algorithm playback */
  currentMoveIndex: number;
  /** Cubie positions and rotations */
  cubiePositions: CubiePosition[];
  cubieRotations: CubieRotation[];
}

/**
 * Represents an algorithm being played back
 */
export interface AlgorithmPlayback {
  id: string;
  name: string;
  moves: Move[];
  currentIndex: number;
}

export const COLORS = {
  white: '#ffffff',
  yellow: '#facc15',
  green: '#22c55e',
  red: '#ef4444',
  blue: '#3b82f6',
  orange: '#f97316',
  black: '#1a1a1a',
};

export const INITIAL_FACE_COLORS: FaceColors = {
  up: COLORS.white,
  down: COLORS.yellow,
  left: COLORS.orange,
  right: COLORS.red,
  front: COLORS.green,
  back: COLORS.blue,
};

export const FACE_ROTATIONS = {
  U: { axis: 'y', angle: 90, face: 'top' },
  "U'": { axis: 'y', angle: -90, face: 'top' },
  U2: { axis: 'y', angle: 180, face: 'top' },
  D: { axis: 'y', angle: -90, face: 'bottom' },
  "D'": { axis: 'y', angle: 90, face: 'bottom' },
  D2: { axis: 'y', angle: 180, face: 'bottom' },
  L: { axis: 'x', angle: 90, face: 'left' },
  "L'": { axis: 'x', angle: -90, face: 'left' },
  L2: { axis: 'x', angle: 180, face: 'left' },
  R: { axis: 'x', angle: -90, face: 'right' },
  "R'": { axis: 'x', angle: 90, face: 'right' },
  R2: { axis: 'x', angle: 180, face: 'right' },
  F: { axis: 'z', angle: -90, face: 'front' },
  "F'": { axis: 'z', angle: 90, face: 'front' },
  F2: { axis: 'z', angle: 180, face: 'front' },
  B: { axis: 'z', angle: 90, face: 'back' },
  "B'": { axis: 'z', angle: -90, face: 'back' },
  B2: { axis: 'z', angle: 180, face: 'back' },
};

export function getOppositeFace(face: string): string {
  const opposites: Record<string, string> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
    front: 'back',
    back: 'front',
  };
  return opposites[face] || face;
}
