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
  turnFace: (axis: RotationAxis, direction: 1 | -1, slice: number, angle: number, onComplete?: () => void, time?: number) => void;
  /** Turn a face by move notation (e.g., 'U', 'R\'', 'F2') */
  turnMove: (notation: string, onComplete?: () => void, time?: number) => void;
  /** Turn a face whole cube (x, y, z moves) */
  turnFaceWholeCube: (move: CubeMove, onComplete?: () => void, time?: number) => void;
  /** Turn a wide face (2 layers) */
  turnWideFace: (axis: RotationAxis, direction: 1 | -1, slice: number, angle?: number, onComplete?: () => void, time?: number) => void;
  /** Turn multiple moves in sequence */
  turnAlgorithm: (moves: string[], onComplete?: () => void, time?: number) => void;
  /** Apply moves to cubies without animation */
  applyMovesToCubies: (moves: string[], onComplete?: () => void) => void;
  /** Set setup moves */
  setSetupMoves: (moves: string) => void;
  /** Set algorithm moves */
  setAlgorithmMoves: (moves: string) => void;
  /** Play algorithm from current position */
  playAlgorithm: () => void;
  /** Pause algorithm playback */
  pauseAlgorithm: () => void;
  /** Reset algorithm playback */
  resetAlgorithm: () => void;
  /** Cubies array for face turning */
  cubies: THREE.Mesh[];
  /** Set the cubies array for face turning */
  setCubies: (cubies: THREE.Mesh[]) => void;
  /** Scene for face turning animations */
  scene: THREE.Scene | null;
  /** Set the scene for face turning animations */
  setScene: (scene: THREE.Scene) => void;
  /** Set animation state */
  setIsAnimating: (isAnimating: boolean) => void;
  /** Is animation currently running */
  isAnimating: boolean;
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
    rotation: { x: 45, y: 45 },
    zoom: 10,
    isAlgorithmPlaying: false,
    isAnimating: false,
    currentAlgorithm: null,
    setupMoves: '',
    algorithmMoves: '',
    currentMoveIndex: 0,
    cubiePositions: [],
    cubieRotations: [],
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
  getScene: () => get().scene,
  setIsAnimating: (isAnimating) =>
    set(() => ({
      isAnimating,
    })),
  isAnimating: false,
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
          setupMoves: '',
          algorithmMoves: '',
          currentMoveIndex: 0,
          cubiePositions: [],
          cubieRotations: [],
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
  resetCube: () => {
    const { cubies, scene, setCubies } = get();
    // Reset all cubies to original positions and rotations
    if (cubies.length > 0 && scene) {
      cubies.forEach((cube) => {
        const originalPos = (cube as any).originalPosition;
        const originalRot = (cube as any).originalRotation;
        if (originalPos) {
          cube.position.set(originalPos.x, originalPos.y, originalPos.z);
        } else {
          cube.position.set(0, 0, 0);
        }
        if (originalRot) {
          cube.rotation.set(originalRot.x, originalRot.y, originalRot.z);
        } else {
          cube.rotation.set(0, 0, 0);
        }
      });
    }

    set({
      state: {
        faces: INITIAL_FACE_COLORS,
        rotation: { x: 45, y: 45 },
        zoom: 10,
        isAlgorithmPlaying: false,
        currentAlgorithm: null,
        setupMoves: '',
        algorithmMoves: '',
        currentMoveIndex: 0,
        cubiePositions: [],
        cubieRotations: [],
      },
    });
  },
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
  // Helper function to turn a face
  turnFace: (axis, direction, slice = 0, angle = 90, onComplete?, time = 500) => {
    const { cubies, scene, isAnimating } = get();

    // Prevent new animations if one is already running
    if (isAnimating) {
      console.log('turnFace: Animation already in progress, ignoring');
      onComplete?.();
      return;
    }

    // Set animating flag
    set({ isAnimating: true });

    if (cubies.length === 0 || !scene) {
      console.log('turnFaceInternal: No cubies or scene');
      set({ isAnimating: false });
      onComplete?.();
      return;
    }

    console.log(`turnFaceInternal: axis=${axis}, direction=${direction}, slice=${slice}, cubies=${cubies.length}`);

    // Find cubies in the selected slice
    const sliceCubies = cubies.filter((cube) => {
      const result = (
        (axis === 'x' && Math.round(cube.position.x) === slice) ||
        (axis === 'y' && Math.round(cube.position.y) === slice) ||
        (axis === 'z' && Math.round(cube.position.z) === slice)
      );
      if (result) {
        console.log(`  Found cubie at (${cube.position.x.toFixed(2)}, ${cube.position.y.toFixed(2)}, ${cube.position.z.toFixed(2)})`);
      }
      return result;
    });

    console.log(`  Found ${sliceCubies.length} cubies in slice`);

    if (sliceCubies.length === 0) {
      console.log('  No cubies found, returning');
      set({ isAnimating: false });
      onComplete?.();
      return;
    }

    // Animation configuration
    const totalAngle = (direction * angle * Math.PI) / 180;

    // If time is 0, apply instantly without animation
    if (time === 0) {
      const parentGroup = new THREE.Group();
      scene.add(parentGroup);
      const originalParents: (THREE.Object3D | null)[] = [];
      sliceCubies.forEach((cube) => {
        originalParents.push(cube.parent);
        parentGroup.add(cube);
      });

      // Apply rotation instantly
      parentGroup.rotation.set(
        axis === 'x' ? totalAngle : 0,
        axis === 'y' ? totalAngle : 0,
        axis === 'z' ? totalAngle : 0
      );

      // Restore cubies
      sliceCubies.forEach((cube, i) => {
        if (cube.parent) cube.parent.remove(cube);
        if (originalParents[i]) originalParents[i].add(cube);

        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        cube.getWorldPosition(worldPosition);
        cube.getWorldQuaternion(worldQuaternion);

        worldPosition.x = Math.round(worldPosition.x);
        worldPosition.y = Math.round(worldPosition.y);
        worldPosition.z = Math.round(worldPosition.z);
        cube.position.copy(worldPosition);

        const euler = new THREE.Euler(0, 0, 0, 'XYZ');
        euler.setFromQuaternion(worldQuaternion);
        euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
        euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
        euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);
        cube.rotation.copy(euler);
      });

      scene.remove(parentGroup);
      set({ isAnimating: false });
      onComplete?.();
      return;
    }

    const frames = 15;
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
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / time, 1);
      currentAngle = totalAngle * progress;
      parentGroup.rotation.set(
        axis === 'x' ? currentAngle : 0,
        axis === 'y' ? currentAngle : 0,
        axis === 'z' ? currentAngle : 0
      );

      if (progress < 1) {
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
        set({ isAnimating: false });
        onComplete?.();
      }
    };

    animate();
  },
  // Helper function to turn entire cube (x, y, z moves)
  turnFaceWholeCube: (move: CubeMove, onComplete?: () => void, time: number = 500) => {
    const { cubies, scene, isAnimating } = get();

    // Prevent new animations if one is already running
    if (isAnimating) {
      console.log('turnFaceWholeCube: Animation already in progress, ignoring');
      onComplete?.();
      return;
    }

    set({ isAnimating: true });

    if (cubies.length === 0 || !scene) {
      console.log('turnFaceWholeCube: No cubies or scene');
      set({ isAnimating: false });
      onComplete?.();
      return;
    }

    console.log(`turnFaceWholeCube: axis=${move.axis}, direction=${move.direction}, slice=${move.slice}, angle=${move.angle}`);

    // All cubies rotate for whole cube turns
    const allCubies = [...cubies];

    // If time is 0, apply instantly without animation
    if (time === 0) {
      const parentGroup = new THREE.Group();
      scene.add(parentGroup);
      const originalParents: (THREE.Object3D | null)[] = [];
      allCubies.forEach((cube) => {
        originalParents.push(cube.parent);
        parentGroup.add(cube);
      });

      // Apply rotation instantly
      const totalAngle = (move.direction * move.angle * Math.PI) / 180;
      parentGroup.rotation.set(
        move.axis === 'x' ? totalAngle : 0,
        move.axis === 'y' ? totalAngle : 0,
        move.axis === 'z' ? totalAngle : 0
      );

      // Restore cubies
      allCubies.forEach((cube, i) => {
        if (cube.parent) cube.parent.remove(cube);
        if (originalParents[i]) originalParents[i].add(cube);

        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        cube.getWorldPosition(worldPosition);
        cube.getWorldQuaternion(worldQuaternion);

        worldPosition.x = Math.round(worldPosition.x);
        worldPosition.y = Math.round(worldPosition.y);
        worldPosition.z = Math.round(worldPosition.z);
        cube.position.copy(worldPosition);

        const euler = new THREE.Euler(0, 0, 0, 'XYZ');
        euler.setFromQuaternion(worldQuaternion);
        euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
        euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
        euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);
        cube.rotation.copy(euler);
      });

      scene.remove(parentGroup);
      set({ isAnimating: false });
      onComplete?.();
      return;
    }

    // Animation configuration
    const frames = 15;
    const totalAngle = (move.direction * move.angle * Math.PI) / 180;
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
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / time, 1);
      currentAngle = totalAngle * progress;
      parentGroup.rotation.set(
        move.axis === 'x' ? currentAngle : 0,
        move.axis === 'y' ? currentAngle : 0,
        move.axis === 'z' ? currentAngle : 0
      );

      if (progress < 1) {
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
        set({ isAnimating: false });
        onComplete?.();
      }
    };

    animate();
  },
  // Helper function to turn 2 layers (wide turn)
  turnWideFace: (axis, direction, slice, angle = 90, onComplete?, time: number = 500) => {
    const { cubies, scene, isAnimating } = get();

    // Prevent new animations if one is already running
    if (isAnimating) {
      console.log('turnWideFace: Animation already in progress, ignoring');
      onComplete?.();
      return;
    }

    set({ isAnimating: true });

    if (cubies.length === 0 || !scene) {
      console.log('turnWideFace: No cubies or scene');
      set({ isAnimating: false });
      onComplete?.();
      return;
    }

    console.log(`turnWideFace: axis=${axis}, direction=${direction}, slice=${slice}, angle=${angle}`);

    // Find cubies in the selected slice AND the middle slice
    const sliceCubies = cubies.filter((cube) => {
      const pos = axis === 'x' ? cube.position.x : axis === 'y' ? cube.position.y : cube.position.z;
      return Math.round(pos) === slice || Math.round(pos) === 0;
    });

    console.log(`  Found ${sliceCubies.length} cubies in slices ${slice} and 0`);

    if (sliceCubies.length === 0) {
      console.log('  No cubies found, returning');
      set({ isAnimating: false });
      onComplete?.();
      return;
    }

    // Animation configuration
    const totalAngle = (direction * angle * Math.PI) / 180;

    // If time is 0, apply instantly without animation
    if (time === 0) {
      const parentGroup = new THREE.Group();
      scene.add(parentGroup);
      const originalParents: (THREE.Object3D | null)[] = [];
      sliceCubies.forEach((cube) => {
        originalParents.push(cube.parent);
        parentGroup.add(cube);
      });

      // Apply rotation instantly
      parentGroup.rotation.set(
        axis === 'x' ? totalAngle : 0,
        axis === 'y' ? totalAngle : 0,
        axis === 'z' ? totalAngle : 0
      );

      // Restore cubies
      sliceCubies.forEach((cube, i) => {
        if (cube.parent) cube.parent.remove(cube);
        if (originalParents[i]) originalParents[i].add(cube);

        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        cube.getWorldPosition(worldPosition);
        cube.getWorldQuaternion(worldQuaternion);

        worldPosition.x = Math.round(worldPosition.x);
        worldPosition.y = Math.round(worldPosition.y);
        worldPosition.z = Math.round(worldPosition.z);
        cube.position.copy(worldPosition);

        const euler = new THREE.Euler(0, 0, 0, 'XYZ');
        euler.setFromQuaternion(worldQuaternion);
        euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
        euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
        euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);
        cube.rotation.copy(euler);
      });

      scene.remove(parentGroup);
      set({ isAnimating: false });
      onComplete?.();
      return;
    }

    const frames = 15;
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
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / time, 1);
      currentAngle = totalAngle * progress;
      parentGroup.rotation.set(
        axis === 'x' ? currentAngle : 0,
        axis === 'y' ? currentAngle : 0,
        axis === 'z' ? currentAngle : 0
      );

      if (progress < 1) {
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
        set({ isAnimating: false });
        onComplete?.();
      }
    };

    animate();
  },
  turnMove: (notation, onComplete?, time: number = 500) => {
    console.log(`turnMove called: ${notation}`);
    const move = parseMove(notation);
    if (!move) {
      console.warn(`Invalid move notation: ${notation}`);
      onComplete?.();
      return;
    }

    console.log(`Move parsed: axis=${move.axis}, direction=${move.direction}, slice=${move.slice}, angle=${move.angle}`);

    // For whole cube rotations (x, y, z), we need to rotate ALL cubies
    // For wide turns (lowercase), we need to turn 2 layers
    // For face turns, we use the slice parameter
    if (['x', 'y', 'z', "x'", "y'", "z'", 'x2', 'y2', 'z2'].includes(notation)) {
      console.log('Using turnFaceWholeCube');
      get().turnFaceWholeCube(move, onComplete, time);
    } else if (notation.length === 1 && notation === notation.toLowerCase()) {
      // Wide turn - turn this slice AND the middle slice
      console.log('Using wide turn');
      get().turnWideFace(move.axis, move.direction, move.slice, move.angle, onComplete, time);
    } else {
      console.log('Using turnFaceInternal');
      get().turnFace(move.axis, move.direction, move.slice, move.angle, onComplete, time);
    }
  },
  turnAlgorithm: (moves, onComplete?, time: number = 500) => {
    const { turnMove } = get();
    let completedCount = 0;

    const handleMoveComplete = () => {
      completedCount++;
      if (completedCount >= moves.length) {
        onComplete?.();
      }
    };

    moves.forEach((move, index) => {
      turnMove(move, index === moves.length - 1 ? handleMoveComplete : undefined, time);
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
  setSetupMoves: (moves) =>
    set((prev) => ({
      state: {
        ...prev.state,
        setupMoves: moves,
      },
    })),
  setAlgorithmMoves: (moves) =>
    set((prev) => ({
      state: {
        ...prev.state,
        algorithmMoves: moves,
        currentMoveIndex: 0,
      },
    })),
  playAlgorithm: () => {
    const { state, turnMove } = get();
    const moves = state.algorithmMoves.trim().split(/\s+/).filter(m => m.length > 0);
    if (moves.length === 0) return;

    // Start from the beginning when playing (not from currentMoveIndex)
    let currentIndex = 0;

    const playNextMove = () => {
      if (currentIndex >= moves.length) {
        set((prev) => ({
          state: {
            ...prev.state,
            isAlgorithmPlaying: false,
            currentMoveIndex: 0,
          },
        }));
        return;
      }

      set((prev) => ({
        state: {
          ...prev.state,
          isAlgorithmPlaying: true,
          currentMoveIndex: currentIndex,
        },
      }));

      turnMove(moves[currentIndex], () => {
        currentIndex++;
        playNextMove();
      });
    };

    playNextMove();
  },
  pauseAlgorithm: () =>
    set((prev) => ({
      state: {
        ...prev.state,
        isAlgorithmPlaying: false,
      },
    })),
  resetAlgorithm: () =>
    set((prev) => ({
      state: {
        ...prev.state,
        isAlgorithmPlaying: false,
        currentMoveIndex: 0,
      },
    })),
  // Apply moves and calculate cubie positions without animation
  applyMovesToCubies: (moves, onComplete?) => {
    const { cubies, scene, isAnimating } = get();

    console.log('applyMovesToCubies: Cubies count', cubies.length);
    if (scene) {
      console.log('applyMovesToCubies: Using scene', scene.uuid);
    }

    // Prevent new animations if one is already running
    if (isAnimating) {
      console.log('applyMovesToCubies: Animation already in progress, ignoring');
      onComplete?.();
      return;
    }

    // Set animating flag
    set({ isAnimating: true });

    if (cubies.length === 0 || !scene) {
      console.log('applyMovesToCubies: No cubies or scene');
      set({ isAnimating: false });
      onComplete?.();
      return;
    }

    // Apply each move directly without animation
    moves.forEach((moveNotation) => {
      const move = parseMove(moveNotation);
      if (!move) return;

      // Find cubies in the slice
      const sliceCubies = cubies.filter((cube) => {
        return (
          (move.axis === 'x' && Math.round(cube.position.x) === move.slice) ||
          (move.axis === 'y' && Math.round(cube.position.y) === move.slice) ||
          (move.axis === 'z' && Math.round(cube.position.z) === move.slice)
        );
      });

      console.log(`Move ${moveNotation}: Found ${sliceCubies.length} cubies`);
      if (sliceCubies.length === 0) {
        console.log('applyMovesToCubies: No cubies found, stopping');
        return;
      }

      // Create a temporary parent group at the origin
      const parentGroup = new THREE.Group();
      scene.add(parentGroup);

      // Store original parent for each cubie
      const originalParents: (THREE.Object3D | null)[] = [];

      // Add each cubie to the parent group
      console.log(`Move ${moveNotation}: Adding ${sliceCubies.length} cubies to parent group`);
      sliceCubies.forEach((cube) => {
        originalParents.push(cube.parent);
        parentGroup.add(cube);
      });

      // Apply the rotation instantly (no animation)
      const totalAngle = (move.direction * move.angle * Math.PI) / 180;
      console.log(`Move ${moveNotation}: Rotating parent group by ${totalAngle} radians around axis ${move.axis}`);
      parentGroup.rotation.set(
        move.axis === 'x' ? totalAngle : 0,
        move.axis === 'y' ? totalAngle : 0,
        move.axis === 'z' ? totalAngle : 0
      );

      // Check position before restore
      console.log(`Move ${moveNotation}: First cubie position after rotation (before restore):`, sliceCubies[0].position);

      // Restore cubies to their original parent
      sliceCubies.forEach((cube, i) => {
        if (cube.parent) {
          cube.parent.remove(cube);
        }

        if (originalParents[i]) {
          originalParents[i].add(cube);
        }

        // Get world position and rotation
        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        cube.getWorldPosition(worldPosition);
        cube.getWorldQuaternion(worldQuaternion);

        console.log(`Move ${moveNotation}: Cubie ${i} worldPosition after rotation:`, worldPosition);

        // Round to nearest integer for position
        worldPosition.x = Math.round(worldPosition.x);
        worldPosition.y = Math.round(worldPosition.y);
        worldPosition.z = Math.round(worldPosition.z);

        cube.position.copy(worldPosition);
        console.log(`Move ${moveNotation}: Cubie ${i} position after copy:`, cube.position);

        // Round rotation to nearest 90 degrees
        const euler = new THREE.Euler(0, 0, 0, 'XYZ');
        euler.setFromQuaternion(worldQuaternion);
        euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
        euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
        euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);
        cube.rotation.copy(euler);
      });

      // Check position after restore
      console.log(`Move ${moveNotation}: First cubie position after restore:`, sliceCubies[0].position);

      // Remove parent group
      scene.remove(parentGroup);
    });

    // Update state
    console.log('applyMovesToCubies: First cubie position before update:', cubies[0].position);
    const cubiePositions = cubies.map((cube) => ({
      x: cube.position.x,
      y: cube.position.y,
      z: cube.position.z,
    }));
    const cubieRotations = cubies.map((cube) => ({
      x: cube.rotation.x,
      y: cube.rotation.y,
      z: cube.rotation.z,
    }));

    console.log('applyMovesToCubies: First cubie position after mapping:', cubiePositions[0]);

    set({
      state: {
        ...get().state,
        cubiePositions,
        cubieRotations,
      },
    });

    console.log('applyMovesToCubies: After state update, first cubie position:', cubies[0].position);

    set({ isAnimating: false });
    onComplete?.();
  },
}));
