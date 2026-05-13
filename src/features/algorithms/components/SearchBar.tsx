import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useThemeStore } from '../../../store/useThemeStore';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search algorithms...' }: SearchBarProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
  },
});
