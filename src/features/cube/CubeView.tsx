import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
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
  const turnMove = useCubeStore((s) => s.turnMove);
  const resetCube = useCubeStore((s) => s.resetCube);

  // Cube content (left pane)
  const cubeContent = <MinimalCube />;

  // Right pane content - move controls
  const rightContent = (
    <ScrollView style={styles.rightPane} contentContainerStyle={styles.scrollContent}>
      <View style={styles.controlsContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          Cube Moves
        </Text>

        {/* Top face moves */}
        <View style={styles.moveGroup}>
          <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>Top (U)</Text>
          <View style={styles.moveRow}>
            <MoveButton notation="U" theme={theme} turnMove={turnMove} />
            <MoveButton notation="U'" theme={theme} turnMove={turnMove} />
            <MoveButton notation="U2" theme={theme} turnMove={turnMove} />
          </View>
        </View>

        {/* Bottom face moves */}
        <View style={styles.moveGroup}>
          <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>Bottom (D)</Text>
          <View style={styles.moveRow}>
            <MoveButton notation="D" theme={theme} turnMove={turnMove} />
            <MoveButton notation="D'" theme={theme} turnMove={turnMove} />
            <MoveButton notation="D2" theme={theme} turnMove={turnMove} />
          </View>
        </View>

        {/* Left face moves */}
        <View style={styles.moveGroup}>
          <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>Left (L)</Text>
          <View style={styles.moveRow}>
            <MoveButton notation="L" theme={theme} turnMove={turnMove} />
            <MoveButton notation="L'" theme={theme} turnMove={turnMove} />
            <MoveButton notation="L2" theme={theme} turnMove={turnMove} />
          </View>
        </View>

        {/* Right face moves */}
        <View style={styles.moveGroup}>
          <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>Right (R)</Text>
          <View style={styles.moveRow}>
            <MoveButton notation="R" theme={theme} turnMove={turnMove} />
            <MoveButton notation="R'" theme={theme} turnMove={turnMove} />
            <MoveButton notation="R2" theme={theme} turnMove={turnMove} />
          </View>
        </View>

        {/* Front face moves */}
        <View style={styles.moveGroup}>
          <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>Front (F)</Text>
          <View style={styles.moveRow}>
            <MoveButton notation="F" theme={theme} turnMove={turnMove} />
            <MoveButton notation="F'" theme={theme} turnMove={turnMove} />
            <MoveButton notation="F2" theme={theme} turnMove={turnMove} />
          </View>
        </View>

        {/* Back face moves */}
        <View style={styles.moveGroup}>
          <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>Back (B)</Text>
          <View style={styles.moveRow}>
            <MoveButton notation="B" theme={theme} turnMove={turnMove} />
            <MoveButton notation="B'" theme={theme} turnMove={turnMove} />
            <MoveButton notation="B2" theme={theme} turnMove={turnMove} />
          </View>
        </View>

        {/* Wide turns */}
        <View style={styles.moveGroup}>
          <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>Wide Turns</Text>
          <View style={styles.moveRow}>
            <MoveButton notation="u" theme={theme} turnMove={turnMove} />
            <MoveButton notation="d" theme={theme} turnMove={turnMove} />
            <MoveButton notation="l" theme={theme} turnMove={turnMove} />
            <MoveButton notation="r" theme={theme} turnMove={turnMove} />
            <MoveButton notation="f" theme={theme} turnMove={turnMove} />
            <MoveButton notation="b" theme={theme} turnMove={turnMove} />
          </View>
        </View>

        {/* Slice moves */}
        <View style={styles.moveGroup}>
          <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>Slice Moves</Text>
          <View style={styles.moveRow}>
            <MoveButton notation="M" theme={theme} turnMove={turnMove} />
            <MoveButton notation="E" theme={theme} turnMove={turnMove} />
            <MoveButton notation="S" theme={theme} turnMove={turnMove} />
          </View>
        </View>

        {/* Whole cube rotations */}
        <View style={styles.moveGroup}>
          <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>Cube Rotations</Text>
          <View style={styles.moveRow}>
            <MoveButton notation="x" theme={theme} turnMove={turnMove} />
            <MoveButton notation="y" theme={theme} turnMove={turnMove} />
            <MoveButton notation="z" theme={theme} turnMove={turnMove} />
          </View>
        </View>

        {/* Reset button */}
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: theme.border }]}
          onPress={() => resetCube()}
        >
          <Text style={[styles.resetText, { color: theme.textSecondary }]}>Reset Cube</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );

  return (
    <SplitView left={cubeContent} right={rightContent} />
  );
}

interface MoveButtonProps {
  notation: string;
  theme: any;
  turnMove: (notation: string, onComplete?: () => void) => void;
}

function MoveButton({ notation, theme, turnMove }: MoveButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.moveButton, { backgroundColor: theme.primary }]}
      onPress={() => {
        turnMove(notation, () => {
          console.log(`Move ${notation} complete`);
        });
      }}
    >
      <Text style={[styles.moveText, { color: '#fff' }]}>{notation}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rightPane: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  controlsContainer: {
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  moveGroup: {
    alignItems: 'center',
    gap: 8,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  moveRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  moveButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
