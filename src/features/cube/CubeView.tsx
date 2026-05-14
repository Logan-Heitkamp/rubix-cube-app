import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useCubeStore } from '../../store/useCubeStore';
import { useThemeStore } from '../../store/useThemeStore';
import { MinimalCube } from './components/MinimalCube';
import { CubeRotationControls } from './components/CubeRotationControls';
import { SplitView } from './components/SplitView';

interface CubeViewProps {
  showControls?: boolean;
  showRotationControls?: boolean;
  showFaceControls?: boolean;
}

export function CubeView({
  showControls = true,
  showRotationControls = true,
  showFaceControls = false,
}: CubeViewProps) {
  const store = useCubeStore();
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const rotateFace = (x: number, y: number) => store.rotateFace(x, y);
  const setZoom = (zoom: number) => store.setZoom(zoom);

  const resetRotation = () => {
    rotateFace(-25, 45);
  };

  // Cube content (left pane)
  const cubeContent = (
    <View style={styles.cubeContainer}>
      <MinimalCube />

      {/* Rotation controls - positioned at bottom left */}
      {showRotationControls && (
        <View style={styles.rotationControlsContainer}>
          <CubeRotationControls onReset={resetRotation} />
        </View>
      )}

      {/* Zoom controls - positioned at top left */}
      {showControls && (
        <View style={styles.zoomContainer}>
          <TouchableOpacity
            style={[styles.zoomButton, { backgroundColor: theme.surface }]}
            onPress={() => setZoom(Math.max(5, store.state.zoom - 1))}
          >
            <Text style={[styles.zoomText, { color: theme.text }]}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.zoomLabel, { color: theme.text }]}>
            {store.state.zoom.toFixed(1)}x
          </Text>
          <TouchableOpacity
            style={[styles.zoomButton, { backgroundColor: theme.surface }]}
            onPress={() => setZoom(Math.min(30, store.state.zoom + 1))}
          >
            <Text style={[styles.zoomText, { color: theme.text }]}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // Right pane content - currently empty, can be used for algorithms
  const rightContent = (
    <View style={styles.rightPane}>
      <View style={styles.emptyState}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Content area
        </Text>
        <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
          Show algorithms or other content here
        </Text>
      </View>
    </View>
  );

  return (
    <SplitView left={cubeContent} right={rightContent} />
  );
}

const styles = StyleSheet.create({
  cubeContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  rightPane: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  rotationControlsContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    zIndex: 10,
  },
  zoomContainer: {
    position: 'absolute',
    top: 24,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  zoomLabel: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
});
