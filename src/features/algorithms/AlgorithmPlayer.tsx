import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useCubeStore } from '../../store/useCubeStore';
import { Algorithm } from './algorithmTypes';
import { Toast } from '../../shared/components/Toast';

interface AlgorithmPlayerProps {
  algorithm: Algorithm;
  onClose: () => void;
}

export function AlgorithmPlayer({ algorithm, onClose }: AlgorithmPlayerProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const { state, dispatch } = useCubeStore();

  const [currentMoveIndex, setCurrentMoveIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(800);

  React.useEffect(() => {
    setCurrentMoveIndex(0);
    setIsPlaying(false);
  }, [algorithm]);

  const playAlgorithm = () => {
    setIsPlaying(true);
    let index = 0;

    const playNext = () => {
      if (index >= algorithm.moves.length) {
        setIsPlaying(false);
        return;
      }

      dispatch({
        type: 'MOVE_FACE',
        payload: state.faces,
        move: algorithm.moves[index],
      });

      setCurrentMoveIndex(index + 1);
      index++;
      setTimeout(playNext, playbackSpeed);
    };

    playNext();
  };

  const pauseAlgorithm = () => {
    setIsPlaying(false);
  };

  const resetAlgorithm = () => {
    setIsPlaying(false);
    setCurrentMoveIndex(0);
    // Reset cube
    dispatch({
      type: 'RESET_CUBE',
    });
  };

  const applyScramble = () => {
    setIsPlaying(false);
    setCurrentMoveIndex(0);

    let index = 0;
    const applyNext = () => {
      if (index >= algorithm.moves.length) return;

      dispatch({
        type: 'MOVE_FACE',
        payload: state.faces,
        move: algorithm.moves[index],
      });

      setCurrentMoveIndex(index + 1);
      index++;
      setTimeout(applyNext, 150);
    };

    applyNext();
  };

  const invertNotation = () => {
    const moves = algorithm.moves;
    const inverted = moves.map((move) => {
      if (move.endsWith("'")) return move.slice(0, -1);
      if (move.endsWith('2')) return move;
      return `${move}'`;
    });
    return inverted.reverse().join(' ');
  };

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleInvert = () => {
    setToastMessage(`Inverted: ${invertNotation()}`);
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.algorithmName, { color: theme.text }]}>
              {algorithm.name}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={{ fontSize: 24 }}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text
            style={[styles.algorithmDescription, { color: theme.textSecondary }]}
          >
            {algorithm.description}
          </Text>

          {/* Notation */}
          <View style={[styles.notationBox, { backgroundColor: theme.surface }]}>
            <Text style={[styles.notationLabel, { color: theme.textSecondary }]}>
              Notation
            </Text>
            <Text style={[styles.notation, { color: theme.text }]}>
              {algorithm.notation}
            </Text>
            <TouchableOpacity
              style={[styles.invertButton, { backgroundColor: theme.primary }]}
              onPress={handleInvert}
            >
              <Text style={styles.invertButtonText}>Invert</Text>
            </TouchableOpacity>
          </View>

          {/* Cube Display */}
          <View style={styles.cubeDisplay}>
            <View style={styles.cubePreview}>
              <Text style={[styles.cubePreviewText, { color: theme.textSecondary }]}>
                Current Move: {currentMoveIndex > 0 ? algorithm.moves[currentMoveIndex - 1] : 'Start'}
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            {!isPlaying ? (
              <TouchableOpacity
                style={[styles.playButton, { backgroundColor: theme.primary }]}
                onPress={playAlgorithm}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.pauseButton, { backgroundColor: '#ef4444' }]}
                onPress={pauseAlgorithm}
              >
                <Text style={styles.pauseButtonText}>Pause</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: theme.surface }]}
              onPress={resetAlgorithm}
            >
              <Text style={[styles.resetButtonText, { color: theme.text }]}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Apply Button */}
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: theme.primary }]}
            onPress={applyScramble}
          >
            <Text style={styles.applyButtonText}>Apply to Cube</Text>
          </TouchableOpacity>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(currentMoveIndex / algorithm.moves.length) * 100}%`,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              {currentMoveIndex} / {algorithm.moves.length}
            </Text>
          </View>
        </View>

        <Toast
          message={toastMessage || ''}
          visible={!!toastMessage}
          onClose={() => setToastMessage(null)}
          type="info"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  algorithmName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  algorithmDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  notationBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  notationLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  notation: {
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  invertButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  invertButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cubeDisplay: {
    marginBottom: 20,
    alignItems: 'center',
  },
  cubePreview: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  cubePreviewText: {
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  playButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pauseButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  applyButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
  },
});
