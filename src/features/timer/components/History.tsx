import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useThemeStore } from '../../../store/useThemeStore';

interface HistoryItemProps {
  time: number;
  rank: number;
  bestTime: number | null;
  formatTime: (ms: number) => string;
}

function HistoryItem({ time, rank, bestTime, formatTime }: HistoryItemProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;

  return (
    <View style={[styles.historyItem, { backgroundColor: theme.surface }]}>
      <Text style={[styles.historyNumber, { color: theme.textSecondary }]}>
        #{rank}
      </Text>
      <Text
        style={[
          styles.historyTime,
          { color: time === bestTime ? '#22c55e' : theme.text },
        ]}
      >
        {formatTime(time)}
      </Text>
    </View>
  );
}

interface HistoryProps {
  history: number[];
  bestTime: number | null;
  formatTime: (ms: number) => string;
}

export function History({ history, bestTime, formatTime }: HistoryProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>
        Recent Solves
      </Text>
      <FlatList
        data={history.slice(0, 5)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <HistoryItem
            time={item}
            rank={history.length - index}
            bestTime={bestTime}
            formatTime={formatTime}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
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
