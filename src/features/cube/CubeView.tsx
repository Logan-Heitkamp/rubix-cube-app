import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useCubeStore } from '../../store/useCubeStore';
import { MinimalCube } from './components/MinimalCube';
import { SplitView } from './components/SplitView';
import { AnimationSpeedSlider } from './components/AnimationSpeedSlider';

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
  const resetCubies = useCubeStore((s) => s.resetCubies);
  const setSetupMoves = useCubeStore((s) => s.setSetupMoves);
  const setAlgorithmMoves = useCubeStore((s) => s.setAlgorithmMoves);
  const playAlgorithm = useCubeStore((s) => s.playAlgorithm);
  const pauseAlgorithm = useCubeStore((s) => s.pauseAlgorithm);
  const resetAlgorithm = useCubeStore((s) => s.resetAlgorithm);
  const currentMoveIndex = useCubeStore((s) => s.state.currentMoveIndex);
  const isAlgorithmPlaying = useCubeStore((s) => s.state.isAlgorithmPlaying);
  const animationSpeed = useCubeStore((s) => s.state.animationSpeed);
  const setAnimationSpeed = useCubeStore((s) => s.setAnimationSpeed);

  const [setupMovesInput, setSetupMovesInput] = useState('');
  const [algorithmMovesInput, setAlgorithmMovesInput] = useState('');

  const setupMovesInputRef = useRef<TextInput>(null);
  const algorithmMovesInputRef = useRef<TextInput>(null);
  const setupDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Apply setup moves when input changes - reset cube then apply moves after debounce
  useEffect(() => {
    // Clear any pending debounce
    if (setupDebounceRef.current) {
      clearTimeout(setupDebounceRef.current);
      setupDebounceRef.current = null;
    }

    // Reset cube to initial state
    resetCube();

    // Apply all setup moves after a short delay (no animation)
    if (setupMovesInput && setupMovesInput.trim()) {
      setupDebounceRef.current = setTimeout(() => {
        const moves = setupMovesInput.trim().split(/\s+/).filter(m => m.length > 0);
        // Apply moves using the new function that calculates positions
        if (moves.length > 0) {
          useCubeStore.getState().applyMovesToCubies(moves);
        }
      }, 300); // 300ms debounce
    }
  }, [setupMovesInput]);

  // Sync input when setup moves change via other means
  React.useEffect(() => {
    setSetupMovesInput(useCubeStore.getState().state.setupMoves);
  }, [useCubeStore.getState().state.setupMoves]);

  // Sync input when algorithm moves change via other means
  React.useEffect(() => {
    setAlgorithmMovesInput(useCubeStore.getState().state.algorithmMoves);
  }, [useCubeStore.getState().state.algorithmMoves]);

  // Cube content (left pane)
  const cubeContent = <MinimalCube />;

  // Right pane content
  const rightContent = (
    <ScrollView style={styles.rightPane} contentContainerStyle={styles.scrollContent}>
      <View style={styles.controlsContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          Cube Setup & Playback
        </Text>

        {/* Setup Moves */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Setup Moves</Text>
          <TextInput
            ref={setupMovesInputRef}
            style={[
              styles.input,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text
              }
            ]}
            placeholder="Enter setup moves (e.g., R L U')"
            placeholderTextColor={theme.textSecondary}
            value={setupMovesInput}
            onChangeText={setSetupMovesInput}
            onSubmitEditing={() => {
              setSetupMoves(setupMovesInput);
            }}
            returnKeyType="done"
          />
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            Applies moves to set up the cube
          </Text>
        </View>

        {/* Algorithm Moves */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Moves</Text>
          <TextInput
            ref={algorithmMovesInputRef}
            style={[
              styles.input,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text
              }
            ]}
            placeholder="Enter algorithm moves (e.g., R U R' U')"
            placeholderTextColor={theme.textSecondary}
            value={algorithmMovesInput}
            onChangeText={setAlgorithmMovesInput}
            onSubmitEditing={() => {
              setAlgorithmMoves(algorithmMovesInput);
            }}
            returnKeyType="done"
            editable={!isAlgorithmPlaying}
          />
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            {isAlgorithmPlaying
              ? `Playing move ${currentMoveIndex + 1} of ${algorithmMovesInput.trim().split(/\s+/).filter(m => m.length > 0).length}`
              : 'Enter moves to animate'}
          </Text>
        </View>

        {/* Animation Speed Slider */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Animation Speed</Text>
          <AnimationSpeedSlider
            value={animationSpeed}
            onChange={setAnimationSpeed}
            theme={theme}
          />
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            Adjust animation speed from 0.1x to 16x
          </Text>
        </View>

        {/* Play/Pause/Reset Buttons */}
        <View style={styles.buttonRow}>
          {!isAlgorithmPlaying ? (
            <TouchableOpacity
              style={[styles.playButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                // Apply setup moves immediately without debounce
                resetCubies();
                const setupMoves = setupMovesInput.trim().split(/\s+/).filter(m => m.length > 0);
                if (setupMoves.length > 0) {
                  useCubeStore.getState().applyMovesToCubies(setupMoves);
                }
                setSetupMoves(setupMovesInput);
                setAlgorithmMoves(algorithmMovesInput);
                // Pause for 0.5 seconds before starting
                setTimeout(() => {
                  playAlgorithm();
                }, 500);
              }}
              disabled={isAlgorithmPlaying}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>Play</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.pauseButton, { backgroundColor: theme.border }]}
              onPress={pauseAlgorithm}
            >
              <Text style={[styles.buttonText, { color: theme.textSecondary }]}>Pause</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: theme.border }]}
            onPress={() => {
              pauseAlgorithm();
              resetAlgorithm();
              setAlgorithmMovesInput('');
            }}
          >
            <Text style={[styles.buttonText, { color: theme.textSecondary }]}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Reset Cube Button */}
        <TouchableOpacity
          style={[styles.resetCubeButton, { backgroundColor: theme.border }]}
          onPress={() => resetCube()}
        >
          <Text style={[styles.resetCubeText, { color: theme.textSecondary }]}>Reset Cube</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
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
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
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
  section: {
    width: '100%',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    borderWidth: 1,
  },
  hint: {
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  playButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  pauseButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resetCubeButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 10,
  },
  resetCubeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
});
