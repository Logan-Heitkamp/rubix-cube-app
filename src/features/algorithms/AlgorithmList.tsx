import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useCubeStore } from '../../store/useCubeStore';
import { OLL_ALGORITHMS, PLL_ALGORITHMS, F2L_ALGORITHMS } from './algorithmDefinitions/algorithms';
import { AlgorithmPlayer } from './AlgorithmPlayer';
import { AlgorithmCard } from './components/AlgorithmCard';
import { CategoryTabs } from './components/CategoryTabs';
import { SearchBar } from './components/SearchBar';
import { AlgorithmListHeader } from './components/AlgorithmListHeader';
import { EmptyState } from './components/EmptyState';
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

  const renderAlgorithm = ({ item }: { item: Algorithm }) => (
    <AlgorithmCard algorithm={item} onPress={() => setSelectedAlgorithm(item)} />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AlgorithmListHeader count={filteredAlgorithms.length} />

      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredAlgorithms}
        keyExtractor={(item) => item.id}
        renderItem={renderAlgorithm}
        ListEmptyComponent={<EmptyState />}
      />

      {selectedAlgorithm && (
        <AlgorithmPlayer
          algorithm={selectedAlgorithm}
          onClose={() => setSelectedAlgorithm(null)}
        />
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  },
};
