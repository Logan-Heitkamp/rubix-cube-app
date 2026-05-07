import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useCubeStore } from '../../store/useCubeStore';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

interface CubeCanvasProps {
  showGrid?: boolean;
}

export function CubeCanvas({ showGrid = true }: CubeCanvasProps) {
  const store = useCubeStore();
  const state = store.state;
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-10, -10, -10);
    scene.add(backLight);

    // Create 27 cubies
    const cubies: THREE.Mesh[] = [];
    const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const colors = {
            top: y === 1 ? '#ffffff' : '#1a1a1a',
            bottom: y === -1 ? '#facc15' : '#1a1a1a',
            left: x === -1 ? '#f97316' : '#1a1a1a',
            right: x === 1 ? '#ef4444' : '#1a1a1a',
            front: z === 1 ? '#22c55e' : '#1a1a1a',
            back: z === -1 ? '#3b82f6' : '#1a1a1a',
          };

          // Create materials for each face
          const materials = [
            new THREE.MeshStandardMaterial({ color: colors.left, side: THREE.DoubleSide }),
            new THREE.MeshStandardMaterial({ color: colors.right, side: THREE.DoubleSide }),
            new THREE.MeshStandardMaterial({ color: colors.top, side: THREE.DoubleSide }),
            new THREE.MeshStandardMaterial({ color: colors.bottom, side: THREE.DoubleSide }),
            new THREE.MeshStandardMaterial({ color: colors.front, side: THREE.DoubleSide }),
            new THREE.MeshStandardMaterial({ color: colors.back, side: THREE.DoubleSide }),
          ];

          const cube = new THREE.Mesh(geometry, materials);
          cube.position.set(x, y, z);
          scene.add(cube);
          cubies.push(cube);
        }
      }
    }
    cubesRef.current = cubies;

    // Grid
    if (showGrid) {
      const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
      gridHelper.position.y = -1.5;
      scene.add(gridHelper);
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Update camera position based on state
      if (cameraRef.current) {
        cameraRef.current.position.x = state.rotation.y * 0.2;
        cameraRef.current.position.y = -state.rotation.x * 0.2;
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Rotate cubes slightly for visual effect
      const time = Date.now() * 0.001;
      cubesRef.current.forEach((cube, i) => {
        cube.rotation.x = Math.sin(time + i) * 0.1;
        cube.rotation.y = Math.cos(time + i) * 0.1;
      });

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
