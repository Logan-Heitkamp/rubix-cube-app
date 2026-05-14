import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useCubeStore } from '../../../store/useCubeStore';

const { width, height } = Dimensions.get('window');

interface MinimalCubeProps {
  showGrid?: boolean;
}

export function MinimalCube({ showGrid = false }: MinimalCubeProps) {
  const store = useCubeStore();
  const state = store.state;
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubesRef = useRef<THREE.Mesh[]>([]);
  const edgeLinesRef = useRef<THREE.LineSegments | null>(null);
  // Use refs to track rotation without causing re-renders
  const rotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a'); // Dark background
    sceneRef.current = scene;

    // Get actual container dimensions for proper aspect ratio
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Camera setup - positioned for left half view with slight angle
    const camera = new THREE.PerspectiveCamera(35, containerWidth / containerHeight, 0.1, 100);
    // Position camera to the left and up for a good viewing angle
    camera.position.set(-2, 2, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting - minimal setup for clean look
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Create 27 cubies with clean materials
    const cubies: THREE.Mesh[] = [];
    // Cubie size - smaller than 1 to create visible gaps (edges)
    const cubieSize = 0.95;
    const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

    // Standard Rubik's colors
    const colors = {
      white: '#ffffff',
      yellow: '#facc15',
      orange: '#f97316',
      red: '#ef4444',
      green: '#22c55e',
      blue: '#3b82f6',
    };

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Materials order for BoxGeometry: Right, Left, Top, Bottom, Front, Back
          // Only color the outer faces, inner faces are black creating the edge effect
          const materials = [
            new THREE.MeshBasicMaterial({ color: x === 1 ? colors.red : '#000000' }),    // Right
            new THREE.MeshBasicMaterial({ color: x === -1 ? colors.orange : '#000000' }), // Left
            new THREE.MeshBasicMaterial({ color: y === 1 ? colors.white : '#000000' }),   // Top
            new THREE.MeshBasicMaterial({ color: y === -1 ? colors.yellow : '#000000' }), // Bottom
            new THREE.MeshBasicMaterial({ color: z === 1 ? colors.green : '#000000' }),   // Front
            new THREE.MeshBasicMaterial({ color: z === -1 ? colors.blue : '#000000' }),   // Back
          ];

          const cube = new THREE.Mesh(geometry, materials);
          cube.position.set(x, y, z);
          scene.add(cube);
          cubies.push(cube);
        }
      }
    }
    cubesRef.current = cubies;

    // Store initial rotation values
    rotationRef.current = { x: state.rotation.x, y: state.rotation.y };

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Sync rotation from store without triggering re-renders
      if (rotationRef.current.x !== state.rotation.x || rotationRef.current.y !== state.rotation.y) {
        rotationRef.current = { x: state.rotation.x, y: state.rotation.y };
      }

      // Rotate camera around the cube using spherical coordinates
      if (cameraRef.current && rendererRef.current) {
        const radius = 8;
        const angleX = (rotationRef.current.x * Math.PI) / 180;
        const angleY = (rotationRef.current.y * Math.PI) / 180;

        // Position camera using spherical coordinates
        cameraRef.current.position.x = radius * Math.sin(angleY) * Math.cos(angleX);
        cameraRef.current.position.y = radius * Math.sin(angleX);
        cameraRef.current.position.z = radius * Math.cos(angleY) * Math.cos(angleX);
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      if (cameraRef.current) {
        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
      }
      if (rendererRef.current) {
        rendererRef.current.setSize(newWidth, newHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Drag rotation handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      const sensitivity = 0.5;
      const newRotationX = rotationRef.current.x - deltaY * sensitivity;
      const newRotationY = rotationRef.current.y + deltaX * sensitivity;

      // Update rotation ref
      rotationRef.current = { x: newRotationX, y: newRotationY };

      // Update store
      store.rotateFace(newRotationX, newRotationY);

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;

      const sensitivity = 0.5;
      const newRotationX = rotationRef.current.x - deltaY * sensitivity;
      const newRotationY = rotationRef.current.y + deltaX * sensitivity;

      // Update rotation ref
      rotationRef.current = { x: newRotationX, y: newRotationY };

      // Update store
      store.rotateFace(newRotationX, newRotationY);

      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Add event listeners to container
    const canvas = containerRef.current;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current) {
        const canvas = containerRef.current;
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        containerRef.current.innerHTML = '';
      }
    };
  }, [state.rotation.x, state.rotation.y, showGrid]);

  return (
    <View style={styles.container}>
      <div
        ref={containerRef}
        style={canvasStyle}
      />
    </View>
  );
}

const canvasStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  cursor: 'grab',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
