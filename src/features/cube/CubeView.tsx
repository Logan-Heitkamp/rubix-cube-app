import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useCubeStore } from '../../store/useCubeStore';
import { MinimalCube } from './components/MinimalCube';
import { SplitView } from './components/SplitView';

interface CubeViewProps {
  showControls?: boolean;
  showRotationControls?: boolean;
  showFaceControls?: boolean;
}

export function CubeView({
  showControls = false,
  showRotationControls = false,
  showFaceControls = false,
}: CubeViewProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const turnFace = useCubeStore((s) => s.turnFace);

  // Cube content (left pane)
  const cubeContent = <MinimalCube />;

  // Right pane content - currently empty, can be used for algorithms
  const rightContent = (
    <View style={styles.rightPane}>
      <View style={styles.controlsContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          Test Controls
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => turnFace('y', 1, 1, () => {
            console.log('Turn complete');
          })} // Turn top layer (y=1) 90 degrees clockwise
        >
          <Text style={styles.buttonText}>Turn Top Layer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SplitView left={cubeContent} right={rightContent} />
  );
}

const styles = StyleSheet.create({
  rightPane: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  controlsContainer: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
