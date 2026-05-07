import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useCubeStore } from '../../store/useCubeStore';
import { OLL_ALGORITHMS, PLL_ALGORITHMS, F2L_ALGORITHMS } from './algorithmData/algorithms';
import { AlgorithmPlayer } from './AlgorithmPlayer';
import { Algorithm, AlgorithmCategory } from './algorithmTypes';

type Category = AlgorithmCategory | 'all';

export function AlgorithmList() {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const { state } = useCubeStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

  const algorithms: Algorithm[] = [
    ...OLL_ALGORITHMS,
    ...PLL_ALGORITHMS,
    ...F2L_ALGORITHMS,
  ];

  const filteredAlgorithms = algorithms.filter((alg) => {
    const matchesCategory = selectedCategory === 'all' || alg.category === selectedCategory;
    const matchesSearch =
      alg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alg.notation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'oll', label: 'OLL' },
    { id: 'pll', label: 'PLL' },
    { id: 'f2l', label: 'F2L' },
  ];

  const difficultyColors = {
    beginner: '#22c55e',
    intermediate: '#f59e0b',
    advanced: '#ef4444',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Algorithm Library
        </Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>
          {filteredAlgorithms.length} algorithms
        </Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryTab,
              selectedCategory === cat.id && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === cat.id && styles.categoryTabTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: theme.surface, color: theme.text },
          ]}
          placeholder="Search algorithms..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Algorithm List */}
      <FlatList
        data={filteredAlgorithms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.algorithmItem, { backgroundColor: theme.surface }]}
            onPress={() => setSelectedAlgorithm(item)}
          >
            <View style={styles.algorithmHeader}>
              <View style={styles.algorithmNameContainer}>
                <Text style={[styles.algorithmName, { color: theme.text }]}>
                  {item.name}
                </Text>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{item.difficulty}</Text>
                </View>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
              </View>
            </View>
            <Text
              style={[styles.algorithmNotation, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {item.notation}
            </Text>
            <Text
              style={[styles.algorithmDescription, { color: theme.textSecondary }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No algorithms found
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Try adjusting your search or category
            </Text>
          </View>
        }
      />

      {/* Algorithm Player Modal */}
      {selectedAlgorithm && (
        <AlgorithmPlayer
          algorithm={selectedAlgorithm}
          onClose={() => setSelectedAlgorithm(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  categoryTabActive: {
    backgroundColor: 'rgba(59,130,246,0.2)',
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryTabTextActive: {
    color: '#3b82f6',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
  },
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
  emptyContainer: {
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
