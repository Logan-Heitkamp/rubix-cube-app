import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../../store/useThemeStore';

interface AlgorithmListHeaderProps {
  count: number;
}

export function AlgorithmListHeader({ count }: AlgorithmListHeaderProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.text }]}>
        Algorithm Library
      </Text>
      <Text style={[styles.count, { color: theme.textSecondary }]}>
        {count} algorithms
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
    marginTop: 4,
  },
});
