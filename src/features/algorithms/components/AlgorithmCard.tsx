import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useThemeStore } from '../../../store/useThemeStore';
import { Algorithm } from '../algorithmTypes';

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onPress: () => void;
}

export function AlgorithmCard({ algorithm, onPress }: AlgorithmCardProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;

  const difficultyColors = {
    beginner: '#22c55e',
    intermediate: '#f59e0b',
    advanced: '#ef4444',
  };

  const badgeColor = difficultyColors[algorithm.difficulty];

  return (
    <TouchableOpacity
      style={[styles.algorithmItem, { backgroundColor: theme.surface }]}
      onPress={onPress}
    >
      <View style={styles.algorithmHeader}>
        <View style={styles.algorithmNameContainer}>
          <Text style={[styles.algorithmName, { color: theme.text }]}>
            {algorithm.name}
          </Text>
          <View style={[styles.difficultyBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.difficultyText}>{algorithm.difficulty}</Text>
          </View>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{algorithm.category.toUpperCase()}</Text>
        </View>
      </View>
      <Text
        style={[styles.algorithmNotation, { color: theme.textSecondary }]}
        numberOfLines={1}
      >
        {algorithm.notation}
      </Text>
      <Text
        style={[styles.algorithmDescription, { color: theme.textSecondary }]}
        numberOfLines={2}
      >
        {algorithm.description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  algorithmItem: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  algorithmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  algorithmNameContainer: {
    flex: 1,
  },
  algorithmName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(59,130,246,0.1)',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3b82f6',
    textTransform: 'uppercase',
  },
  algorithmNotation: {
    fontSize: 13,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  algorithmDescription: {
    fontSize: 12,
  },
});
