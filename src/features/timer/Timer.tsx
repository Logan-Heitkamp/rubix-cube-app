import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useCubeStore } from '../../store/useCubeStore';
import { useProgressStore } from '../../store/useProgressStore';

type TimerState = 'idle' | 'inspecting' | 'timing' | 'result';

const INSPECTION_TIME = 15;

export function Timer() {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const { state } = useCubeStore();
  const { addSolve, getStats, progress } = useProgressStore();

  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [time, setTime] = useState(0);
  const [inspectionTime, setInspectionTime] = useState(INSPECTION_TIME);
  const [solveHistory, setSolveHistory] = useState<number[]>([]);
  const [lastScramble, setLastScramble] = useState('');

  const startTimeRef = useRef<number | null>(null);
  const inspectionRef = useRef<any | null>(null);
  const timerRef = useRef<any | null>(null);

  const stats = useMemo(() => getStats(), [getStats]);

  const startInspection = useCallback(() => {
    setTimerState('inspecting');
    setInspectionTime(INSPECTION_TIME);
    inspectionRef.current = window.setInterval(() => {
      setInspectionTime((prev) => {
        if (prev <= 0) {
          if (inspectionRef.current) clearInterval(inspectionRef.current);
          setTimerState('timing');
          startTimeRef.current = Date.now();
          timerRef.current = window.setInterval(() => {
            setTime((prev) => prev + 10);
          }, 10);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (inspectionRef.current) clearInterval(inspectionRef.current);

    const endTime = Date.now();
    const startTime = startTimeRef.current || endTime;
    const elapsedTime = endTime - startTime;

    setTime(elapsedTime);
    setTimerState('result');

    // Add to history
    setSolveHistory((prev) => [elapsedTime, ...prev].slice(0, 100));

    // Save to progress
    addSolve({
      id: crypto.randomUUID(),
      time: elapsedTime,
      date: new Date().toISOString(),
      scramble: lastScramble,
      session: 'default',
    });
  }, [addSolve, lastScramble]);

  const handleSpacePress = useCallback(
    (e: React.KeyboardEvent | React.TouchEvent) => {
      e.preventDefault();

      if (timerState === 'idle' || timerState === 'result') {
        startInspection();
      } else if (timerState === 'inspecting') {
        if (inspectionTime > 0) {
          // DNF - inspection time exceeded
          if (inspectionRef.current) clearInterval(inspectionRef.current);
          setTimerState('result');
          setTime(INSPECTION_TIME * 1000 + 1);
          setSolveHistory((prev) => [INSPECTION_TIME * 1000 + 1, ...prev]);
          addSolve({
            id: crypto.randomUUID(),
            time: INSPECTION_TIME * 1000 + 1,
            date: new Date().toISOString(),
            scramble: lastScramble,
            session: 'default',
          });
        } else {
          startTimer();
        }
      } else if (timerState === 'timing') {
        stopTimer();
      }
    },
    [timerState, inspectionTime, startInspection, stopTimer, addSolve, lastScramble]
  );

  const startTimer = () => {
    setTimerState('timing');
    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      setTime((prev) => prev + 10);
    }, 10);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (inspectionRef.current) clearInterval(inspectionRef.current);
    setTimerState('idle');
    setTime(0);
    setInspectionTime(INSPECTION_TIME);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const milliseconds = ms % 1000;

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    }
    return `${remainingSeconds}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const generateScramble = () => {
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

    setLastScramble(scramble.trim());
  };

  React.useEffect(() => {
    generateScramble();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Speed Timer
        </Text>
        <TouchableOpacity
          style={[styles.scrambleButton, { backgroundColor: theme.surface }]}
          onPress={generateScramble}
        >
          <Text style={[styles.scrambleButtonText, { color: theme.text }]}>
            Generate Scramble
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scramble Display */}
      {lastScramble && (
        <View style={[styles.scrambleBox, { backgroundColor: theme.surface }]}>
          <Text style={[styles.scrambleText, { color: theme.textSecondary }]}>
            {lastScramble}
          </Text>
        </View>
      )}

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        {timerState === 'inspecting' ? (
          <View style={[styles.inspectionDisplay, { borderColor: inspectionTime <= 3 ? '#ef4444' : theme.primary }]}>
            <Text style={[styles.inspectionLabel, { color: theme.textSecondary }]}>
              Inspection
            </Text>
            <Text
              style={[
                styles.inspectionTime,
                { color: inspectionTime <= 3 ? '#ef4444' : theme.text },
              ]}
            >
              {inspectionTime}s
            </Text>
          </View>
        ) : (
          <View style={[styles.timeDisplay, { backgroundColor: theme.surface }]}>
            <Text
              style={[
                styles.timeText,
                { color: timerState === 'result' ? theme.primary : theme.text },
              ]}
            >
              {formatTime(time)}
            </Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Best
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.bestTime ? formatTime(stats.bestTime) : '--'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Ao5
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.avg5 ? formatTime(stats.avg5) : '--'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Ao12
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.avg12 ? formatTime(stats.avg12) : '--'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Total
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.totalSolves}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {timerState === 'result' ? (
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: theme.primary }]}
            onPress={resetTimer}
          >
            <Text style={styles.resetButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spaceHint}>
            <Text style={[styles.spaceHintText, { color: theme.textSecondary }]}>
              Press space to {timerState === 'idle' ? 'start inspection' : 'stop timer'}
            </Text>
          </View>
        )}
      </View>

      {/* History */}
      {solveHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={[styles.historyTitle, { color: theme.textSecondary }]}>
            Recent Solves
          </Text>
          <View style={styles.historyList}>
            {solveHistory.slice(0, 5).map((solveTime, index) => (
              <View
                key={index}
                style={[styles.historyItem, { backgroundColor: theme.surface }]}
              >
                <Text style={[styles.historyNumber, { color: theme.textSecondary }]}>
                  #{solveHistory.length - index}
                </Text>
                <Text
                  style={[
                    styles.historyTime,
                    { color: solveTime === stats.bestTime ? '#22c55e' : theme.text },
                  ]}
                >
                  {formatTime(solveTime)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrambleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  scrambleButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrambleBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  scrambleText: {
    fontSize: 14,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inspectionDisplay: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  inspectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inspectionTime: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  timeDisplay: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 72,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  controls: {
    alignItems: 'center',
  },
  spaceHint: {
    paddingVertical: 12,
  },
  spaceHintText: {
    fontSize: 14,
  },
  resetButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historyContainer: {
    marginTop: 16,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  historyNumber: {
    fontSize: 10,
    fontWeight: '600',
    marginRight: 12,
    width: 24,
  },
  historyTime: {
    fontSize: 16,
    fontWeight: '600',
  },
});
