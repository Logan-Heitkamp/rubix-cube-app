import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useCubeStore } from '../../store/useCubeStore';
import { useProgressStore } from '../../store/useProgressStore';
import { OLL_ALGORITHMS, PLL_ALGORITHMS, F2L_ALGORITHMS } from '../algorithms/algorithmDefinitions/algorithms';
import { Toast } from '../../shared/components/Toast';

type TrainerMode = 'practice' | 'check' | 'hint';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  notation: string;
  category: 'oll' | 'pll' | 'f2l';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  moves: string[];
}

export function Trainer() {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const { state, dispatch } = useCubeStore();
  const { progress, completeAlgorithm } = useProgressStore();
  const [mode, setMode] = useState<TrainerMode>('practice');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const allAlgorithms: Algorithm[] = [
    ...OLL_ALGORITHMS,
    ...PLL_ALGORITHMS,
    ...F2L_ALGORITHMS,
  ];

  const startPractice = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setCurrentMoveIndex(0);
    setMode('practice');
  };

  const checkMove = (move: string) => {
    if (!selectedAlgorithm) return;

    const expectedMove = selectedAlgorithm.moves[currentMoveIndex];
    if (move === expectedMove) {
      // Correct move
      if (currentMoveIndex < selectedAlgorithm.moves.length - 1) {
        setCurrentMoveIndex(currentMoveIndex + 1);
      } else {
        // Algorithm complete
        setMode('check');
      }
    } else {
      // Wrong move - show hint
      setToastMessage(`Wrong move! Expected: ${expectedMove}`);
      setToastType('error');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const getHint = () => {
    if (!selectedAlgorithm) return;
    const nextMove = selectedAlgorithm.moves[currentMoveIndex];
    setToastMessage(`Hint: The next move is ${nextMove}`);
    setToastType('info');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const resetAlgorithm = () => {
    setCurrentMoveIndex(0);
    setMode('practice');
    dispatch({
      type: 'RESET_CUBE',
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Learning Trainer
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Learn and practice algorithms step by step
        </Text>
      </View>

      {/* Mode Selection */}
      <View style={styles.modeSelector}>
        {(['practice', 'check', 'hint'] as const).map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.modeButton,
              mode === m && styles.modeButtonActive,
            ]}
            onPress={() => setMode(m)}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === m && styles.modeButtonTextActive,
              ]}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Algorithm List */}
      <View style={styles.algorithmList}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Available Algorithms
        </Text>
        {allAlgorithms.map((alg) => (
          <TouchableOpacity
            key={alg.id}
            style={[styles.algorithmItem, { backgroundColor: theme.surface }]}
            onPress={() => startPractice(alg)}
          >
            <View style={styles.algorithmItemHeader}>
              <Text style={[styles.algorithmName, { color: theme.text }]}>
                {alg.name}
              </Text>
              <Text style={[styles.algorithmCategory, { color: theme.primary }]}>
                {alg.category.toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.algorithmMoves, { color: theme.textSecondary }]}>
              {alg.notation}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Practice Session */}
      {selectedAlgorithm && mode === 'practice' && (
        <View style={[styles.practiceSession, { backgroundColor: theme.surface }]}>
          <Text style={[styles.practiceTitle, { color: theme.text }]}>
            Practicing: {selectedAlgorithm.name}
          </Text>
          <Text style={[styles.practiceDescription, { color: theme.textSecondary }]}>
            Follow the moves on the cube
          </Text>

          <View style={styles.moveProgress}>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(currentMoveIndex / selectedAlgorithm.moves.length) * 100}%`,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.moveCount, { color: theme.textSecondary }]}>
              Move {currentMoveIndex + 1} of {selectedAlgorithm.moves.length}
            </Text>
          </View>

          <View style={styles.practiceControls}>
            <TouchableOpacity
              style={[styles.practiceButton, { backgroundColor: theme.primary }]}
              onPress={() => checkMove(selectedAlgorithm.moves[currentMoveIndex])}
            >
              <Text style={styles.practiceButtonText}>Confirm Move</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.practiceButton, { backgroundColor: theme.surface }]}
              onPress={getHint}
            >
              <Text style={[styles.practiceButtonText, { color: theme.text }]}>
                Get Hint
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.practiceButton, { backgroundColor: '#ef4444' }]}
              onPress={resetAlgorithm}
            >
              <Text style={styles.practiceButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Check Mode */}
      {selectedAlgorithm && mode === 'check' && (
        <View style={[styles.checkSession, { backgroundColor: theme.surface }]}>
          <Text style={[styles.checkTitle, { color: theme.text }]}>
            Practice Complete!
          </Text>
          <Text style={[styles.checkDescription, { color: theme.textSecondary }]}>
            You've successfully practiced {selectedAlgorithm.name}
          </Text>

          <TouchableOpacity
            style={[styles.checkButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              completeAlgorithm(selectedAlgorithm.id);
              resetAlgorithm();
            }}
          >
            <Text style={styles.checkButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage || ''}
        visible={!!toastMessage}
        onClose={() => setToastMessage(null)}
        type={toastType}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(59,130,246,0.2)',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  modeButtonTextActive: {
    color: '#3b82f6',
  },
  algorithmList: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  algorithmItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  algorithmItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  algorithmName: {
    fontSize: 16,
    fontWeight: '600',
  },
  algorithmCategory: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  algorithmMoves: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  practiceSession: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  practiceDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  moveProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  moveCount: {
    fontSize: 12,
    textAlign: 'right',
  },
  practiceControls: {
    flexDirection: 'row',
    gap: 8,
  },
  practiceButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  practiceButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  checkSession: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  checkDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  checkButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
