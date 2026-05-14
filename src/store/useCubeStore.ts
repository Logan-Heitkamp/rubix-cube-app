import { create } from 'zustand';
import { CubeState, FaceColors, INITIAL_FACE_COLORS, FACE_ROTATIONS, Move, RotationAxis } from '../entities/types';
import { FACE_MOVES, parseMove, CubeMove } from '../entities/moves';
import * as THREE from 'three';

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
  /** Turn a face of the cube (rotates actual pieces) */
  turnFace: (axis: RotationAxis, direction: 1 | -1, slice: number, onComplete?: () => void) => void;
  /** Turn a face by move notation (e.g., 'U', 'R\'', 'F2') */
  turnMove: (notation: string, onComplete?: () => void) => void;
  /** Turn multiple moves in sequence */
  turnAlgorithm: (moves: string[], onComplete?: () => void) => void;
  /** Cubies array for face turning */
  cubies: THREE.Mesh[];
  /** Set the cubies array for face turning */
  setCubies: (cubies: THREE.Mesh[]) => void;
  /** Scene for face turning animations */
  scene: THREE.Scene | null;
  /** Set the scene for face turning animations */
  setScene: (scene: THREE.Scene) => void;
  /** Start playing an algorithm */
  startAlgorithm: (id: string, name: string, moves: Move[]) => void;
  /** Stop algorithm playback */
  stopAlgorithm: () => void;
  /** Mark an algorithm as complete */
  markAlgorithmComplete: (algorithmId: string) => void;
}

/**
 * Turn a face of the cube - internal helper
 */
function turnFaceInternal(
  axis: RotationAxis,
  direction: 1 | -1,
  slice: number,
  onComplete?: () => void
) {
  const { cubies, scene } = get();
  if (cubies.length === 0 || !scene) {
    onComplete?.();
    return;
  }

  // Find cubies in the selected slice
  const sliceCubies = cubies.filter((cube) => {
    if (axis === 'x') return Math.round(cube.position.x) === slice;
    if (axis === 'y') return Math.round(cube.position.y) === slice;
    if (axis === 'z') return Math.round(cube.position.z) === slice;
    return false;
  });

  if (sliceCubies.length === 0) {
    onComplete?.();
    return;
  }

  // Animation configuration
  const frames = 15;
  const totalAngle = (direction * 90 * Math.PI) / 180;
  const anglePerFrame = totalAngle / frames;

  // Create a temporary parent group at the origin
  const parentGroup = new THREE.Group();
  scene.add(parentGroup);

  // Store original parent for each cubie
  const originalParents: (THREE.Object3D | null)[] = [];

  // Add each cubie to the parent group
  sliceCubies.forEach((cube) => {
    originalParents.push(cube.parent);
    parentGroup.add(cube);
  });

  // Rotate the parent group
  let currentAngle = 0;

  const animate = () => {
    currentAngle += anglePerFrame;
    parentGroup.rotation.set(
      axis === 'x' ? currentAngle : 0,
      axis === 'y' ? currentAngle : 0,
      axis === 'z' ? currentAngle : 0
    );

    if (Math.abs(currentAngle) < Math.abs(totalAngle)) {
      requestAnimationFrame(animate);
    } else {
      // Animation complete - restore cubies
      sliceCubies.forEach((cube, i) => {
        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        cube.getWorldPosition(worldPosition);
        cube.getWorldQuaternion(worldQuaternion);

        worldPosition.x = Math.round(worldPosition.x);
        worldPosition.y = Math.round(worldPosition.y);
        worldPosition.z = Math.round(worldPosition.z);

        if (cube.parent) {
          cube.parent.remove(cube);
        }

        if (originalParents[i] !== null) {
          originalParents[i].add(cube);
        }

        cube.position.copy(worldPosition);

        const euler = new THREE.Euler(0, 0, 0, 'XYZ');
        euler.setFromQuaternion(worldQuaternion);
        euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
        euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
        euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);
        cube.rotation.copy(euler);
      });

      scene.remove(parentGroup);
      onComplete?.();
    }
  };

  animate();
}

/**
 * Turn entire cube (x, y, z moves) - rotates all cubies
 */
function turnFaceWholeCube(move: CubeMove, onComplete?: () => void) {
  const { cubies, scene } = get();
  if (cubies.length === 0 || !scene) {
    onComplete?.();
    return;
  }

  // All cubies rotate for whole cube turns
  const allCubies = [...cubies];

  // Animation configuration
  const frames = 15;
  const totalAngle = (move.direction * 90 * Math.PI) / 180;
  const anglePerFrame = totalAngle / frames;

  // Create a temporary parent group at the origin
  const parentGroup = new THREE.Group();
  scene.add(parentGroup);

  // Store original parent for each cubie
  const originalParents: (THREE.Object3D | null)[] = [];

  // Add each cubie to the parent group
  allCubies.forEach((cube) => {
    originalParents.push(cube.parent);
    parentGroup.add(cube);
  });

  // Rotate the parent group
  let currentAngle = 0;

  const animate = () => {
    currentAngle += anglePerFrame;
    parentGroup.rotation.set(
      move.axis === 'x' ? currentAngle : 0,
      move.axis === 'y' ? currentAngle : 0,
      move.axis === 'z' ? currentAngle : 0
    );

    if (Math.abs(currentAngle) < Math.abs(totalAngle)) {
      requestAnimationFrame(animate);
    } else {
      // Animation complete - restore cubies
      allCubies.forEach((cube, i) => {
        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        cube.getWorldPosition(worldPosition);
        cube.getWorldQuaternion(worldQuaternion);

        worldPosition.x = Math.round(worldPosition.x);
        worldPosition.y = Math.round(worldPosition.y);
        worldPosition.z = Math.round(worldPosition.z);

        if (cube.parent) {
          cube.parent.remove(cube);
        }

        if (originalParents[i] !== null) {
          originalParents[i].add(cube);
        }

        cube.position.copy(worldPosition);

        const euler = new THREE.Euler(0, 0, 0, 'XYZ');
        euler.setFromQuaternion(worldQuaternion);
        euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
        euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
        euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);
        cube.rotation.copy(euler);
      });

      scene.remove(parentGroup);
      onComplete?.();
    }
  };

  animate();
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
  cubies: [] as THREE.Mesh[],
  scene: null,
  setCubies: (cubies) =>
    set((prev) => ({
      cubies,
    })),
  setScene: (scene) =>
    set(() => ({
      scene,
    })),
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
  turnFace: (axis, direction, slice = 0, onComplete?) => {
    turnFaceInternal(axis, direction, slice, onComplete);
  },
  turnMove: (notation, onComplete?) => {
    const move = parseMove(notation);
    if (!move) {
      console.warn(`Invalid move notation: ${notation}`);
      onComplete?.();
      return;
    }

    // For whole cube rotations (x, y, z), we need to rotate ALL cubies
    // For face turns, we use the slice parameter
    if (['x', 'y', 'z', "x'", "y'", "z'", 'x2', 'y2', 'z2'].includes(notation)) {
      turnFaceWholeCube(move, onComplete);
    } else {
      get().turnFace(move.axis, move.direction, move.slice, onComplete);
    }
  },
  turnAlgorithm: (moves, onComplete?) => {
    const { turnMove } = get();
    let completedCount = 0;

    const handleMoveComplete = () => {
      completedCount++;
      if (completedCount >= moves.length) {
        onComplete?.();
      }
    };

    moves.forEach((move, index) => {
      turnMove(move, index === moves.length - 1 ? handleMoveComplete : undefined);
    });
  },
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
