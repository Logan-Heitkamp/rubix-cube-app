import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
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

  // Cube content (left pane)
  const cubeContent = <MinimalCube />;

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
});
