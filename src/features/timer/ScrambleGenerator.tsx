import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useCubeStore } from '../../store/useCubeStore';

interface ScrambleGeneratorProps {
  onGenerate?: (scramble: string) => void;
}

export function ScrambleGenerator({ onGenerate }: ScrambleGeneratorProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const { state, dispatch } = useCubeStore();
  const [scramble, setScramble] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateScramble = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
      const modifiers = ['', "'", '2'];
      const moveCount = 20;
      let scramble = '';

      let lastFace = '';
      for (let i = 0; i < moveCount; i++) {
        let face;
        do {
          face = faces[Math.floor(Math.random() * faces.length)];
        } while (face === lastFace && i > 0);

        const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        scramble += `${face}${modifier} `;

        lastFace = face;
      }

      setScramble(scramble.trim());
      setIsGenerating(false);

      if (onGenerate) {
        onGenerate(scramble.trim());
      }
    }, 300);
  };

  const applyScramble = () => {
    if (!scramble) return;

    const moves = scramble.split(' ');
    let currentIndex = 0;

    const applyNextMove = () => {
      if (currentIndex < moves.length) {
        dispatch({
          type: 'MOVE_FACE',
          payload: state.faces,
          move: moves[currentIndex],
        });
        currentIndex++;
        setTimeout(applyNextMove, 100);
      }
    };

    applyNextMove();
  };

  const copyToClipboard = () => {
    if (scramble) {
      console.log(`Copied: ${scramble}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Scramble Generator
      </Text>

      <View style={[styles.scrambleBox, { backgroundColor: theme.background }]}>
        {isGenerating ? (
          <Text style={[styles.scramble, { color: theme.textSecondary }]}>
            Generating...
          </Text>
        ) : scramble ? (
          <Text style={[styles.scramble, { color: theme.text }]}>{scramble}</Text>
        ) : (
          <Text style={[styles.scramble, { color: theme.textSecondary }]}>
            No scramble generated yet
          </Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={generateScramble}
        >
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={applyScramble}
          disabled={!scramble}
        >
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={copyToClipboard}
          disabled={!scramble}
        >
          <Text style={styles.buttonText}>Copy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <Text style={[styles.statsLabel, { color: theme.textSecondary }]}>
          Recent Scrambles
        </Text>
        <View style={styles.scrambleHistory}>
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={[styles.historyItem, { backgroundColor: theme.background }]}
            >
              <Text style={[styles.historyNumber, { color: theme.textSecondary }]}>
                #{i}
              </Text>
              <Text style={[styles.historyScramble, { color: theme.textSecondary }]}>
                Generate a scramble to see history
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scrambleBox: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
    marginBottom: 12,
  },
  scramble: {
    fontSize: 14,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    marginTop: 12,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  scrambleHistory: {
    gap: 8,
  },
  historyItem: {
    padding: 10,
    borderRadius: 6,
  },
  historyNumber: {
    fontSize: 10,
    fontWeight: '600',
  },
  historyScramble: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },
});
