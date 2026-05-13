import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../../store/useThemeStore';

export function EmptyState() {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;

  return (
    <View style={styles.container}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        No algorithms found
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
        Try adjusting your search or category
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
});
