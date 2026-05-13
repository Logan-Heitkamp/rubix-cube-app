import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../../store/useThemeStore';

interface StatsProps {
  bestTime: number | null;
  avg5: number | null;
  avg12: number | null;
  totalSolves: number;
  formatTime: (ms: number) => string;
}

export function Stats({ bestTime, avg5, avg12, totalSolves, formatTime }: StatsProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
          Best
        </Text>
        <Text style={[styles.statValue, { color: theme.text }]}>
          {bestTime ? formatTime(bestTime) : '--'}
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
          Ao5
        </Text>
        <Text style={[styles.statValue, { color: theme.text }]}>
          {avg5 ? formatTime(avg5) : '--'}
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
          Ao12
        </Text>
        <Text style={[styles.statValue, { color: theme.text }]}>
          {avg12 ? formatTime(avg12) : '--'}
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
          Total
        </Text>
        <Text style={[styles.statValue, { color: theme.text }]}>
          {totalSolves}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
