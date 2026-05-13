import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../../store/useThemeStore';

type Category = 'all' | 'oll' | 'pll' | 'f2l';

interface CategoryTabsProps {
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

export function CategoryTabs({ selectedCategory, onSelect }: CategoryTabsProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'oll', label: 'OLL' },
    { id: 'pll', label: 'PLL' },
    { id: 'f2l', label: 'F2L' },
  ];

  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.tab,
            selectedCategory === cat.id && styles.tabActive,
          ]}
          onPress={() => onSelect(cat.id)}
        >
          <Text
            style={[
              styles.tabText,
              selectedCategory === cat.id && styles.tabTextActive,
            ]}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  tabActive: {
    backgroundColor: 'rgba(59,130,246,0.2)',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#3b82f6',
  },
});
