import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useThemeStore } from './store/useThemeStore';
import { CubeView } from './features/cube/CubeView';
import { AlgorithmList } from './features/algorithms/AlgorithmList';
import { Timer } from './features/timer/Timer';
import { StatsDashboard } from './features/progress/StatsDashboard';
import { AchievementList } from './features/progress/AchievementList';
import { Trainer } from './features/trainer/Trainer';
import { ErrorBoundary } from './shared/components/ErrorBoundary';

type Tab = 'cube' | 'algorithms' | 'timer' | 'progress' | 'trainer';

export default function App() {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const mode = themeStore.mode;
  const toggleTheme = themeStore.toggleTheme;
  const [activeTab, setActiveTab] = useState<Tab>('cube');

 
  const tabs = [
    { id: 'cube', label: 'Cube', icon: '🧩' },
    { id: 'algorithms', label: 'Algorithms', icon: '📚' },
    { id: 'timer', label: 'Timer', icon: '⏱️' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'trainer', label: 'Trainer', icon: '🎯' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'cube':
        return <CubeView />;
      case 'algorithms':
        return <AlgorithmList />;
      case 'timer':
        return <Timer />;
      case 'progress':
        return <StatsDashboard />;
      case 'trainer':
        return <Trainer />;
      default:
        return <CubeView />;
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            CubeMaster
          </Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Text style={[styles.themeButtonIcon, { color: theme.text }]}>
              {mode === 'light' ? '🌙' : '☀️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {renderContent()}
        </View>

        {/* Bottom Navigation */}
        <View style={styles.navBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.navButton, activeTab === tab.id && styles.navButtonActive]}
              onPress={() => setActiveTab(tab.id as Tab)}
            >
              <Text style={[styles.navIcon, { color: activeTab === tab.id ? theme.primary : theme.textSecondary }]}>
                {tab.icon}
              </Text>
              <Text style={[styles.navLabel, { color: activeTab === tab.id ? theme.primary : theme.textSecondary }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 8,
  },
  themeButtonIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  navButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
