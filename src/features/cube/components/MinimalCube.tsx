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
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubesRef = useRef<THREE.Mesh[]>([]);
  const initialRotationRef = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0, 'YXZ'));

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a'); // Dark background
    sceneRef.current = scene;

    // Camera setup - slightly angled for 3D effect
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(4, 3, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting - minimal setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Create 27 cubies with clean materials
    const cubies: THREE.Mesh[] = [];
    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);

    // Standard Rubik's colors
    const colors = {
      white: '#ffffff',
      yellow: '#facc15',
      orange: '#f97316',
      red: '#ef4444',
      green: '#22c55e',
      blue: '#3b82f6',
      internal: '#111827', // Very dark gray
    };

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Determine colors for each face based on position
          const materials = [
            new THREE.MeshBasicMaterial({ color: x === -1 ? colors.orange : colors.internal }), // Left
            new THREE.MeshBasicMaterial({ color: x === 1 ? colors.red : colors.internal }),    // Right
            new THREE.MeshBasicMaterial({ color: y === 1 ? colors.white : colors.internal }),  // Top
            new THREE.MeshBasicMaterial({ color: y === -1 ? colors.yellow : colors.internal }), // Bottom
            new THREE.MeshBasicMaterial({ color: z === 1 ? colors.green : colors.internal }),  // Front
            new THREE.MeshBasicMaterial({ color: z === -1 ? colors.blue : colors.internal }),  // Back
          ];

          const cube = new THREE.Mesh(geometry, materials);
          cube.position.set(x, y, z);
          scene.add(cube);
          cubies.push(cube);
        }
      }
    }
    cubesRef.current = cubies;

    // Store initial rotation for reference
    initialRotationRef.current.copy(camera.rotation);

    // Grid (optional, minimal)
    if (showGrid) {
      const gridHelper = new THREE.GridHelper(6, 6, 0x374151, 0x1f2937);
      gridHelper.position.y = -1;
      scene.add(gridHelper);
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Update camera position based on state rotation
      if (cameraRef.current) {
        // Apply rotation to camera
        cameraRef.current.position.x = 4 + state.rotation.y * 0.05;
        cameraRef.current.position.y = 3 - state.rotation.x * 0.05;
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [state.rotation.x, state.rotation.y, showGrid]);

  return (
    <View style={styles.container}>
      <div ref={containerRef} style={styles.canvas} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  canvas: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});
