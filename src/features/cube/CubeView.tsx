import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useCubeStore } from '../../store/useCubeStore';
import { useThemeStore } from '../../store/useThemeStore';
import { CubeCanvas } from './CubeCanvas';
import { CubeControls } from './CubeControls';

/**
 * Props for CubeView component
 */
interface CubeViewProps {
  /** Whether to show controls overlay */
  showControls?: boolean;
}

/**
 * Main cube view component that combines the 3D cube canvas
 * with interactive controls for rotation and face turns
 */
export function CubeView({ showControls = true }: CubeViewProps) {
  const store = useCubeStore();
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const state = store.state;
  const rotateFace = (x: number, y: number) => store.rotateFace(x, y);
  const setZoom = (zoom: number) => store.setZoom(zoom);

  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (_, gesture) => {
        if (!isDragging) return;

        const deltaX = gesture.dx;
        const deltaY = gesture.dy;

        const sensitivity = 0.5;
        rotateFace(
          state.rotation.x - deltaY * sensitivity,
          state.rotation.y + deltaX * sensitivity
        );
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
      onPanResponderTerminationRequest: () => true,
    })
  ).current;

  return (
    <View style={styles.container}>
      <View
        {...panResponder.panHandlers}
        style={[styles.canvasContainer, { backgroundColor: theme.background }]}
      >
        <CubeCanvas />
      </View>

      {showControls && (
        <View style={styles.controlsOverlay}>
          <View style={styles.controlsRow}>
            <View style={styles.zoomControls}>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: theme.surface }]}
                onPress={() => setZoom(Math.max(5, state.zoom - 1))}
              >
                <Text style={[styles.controlButtonText, { color: theme.text }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.zoomText, { color: theme.text }]}>
                {state.zoom.toFixed(1)}x
              </Text>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: theme.surface }]}
                onPress={() => setZoom(Math.min(30, state.zoom + 1))}
              >
                <Text style={[styles.controlButtonText, { color: theme.text }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showControls && <CubeControls />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    elevation: 2,
  },
  zoomText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
