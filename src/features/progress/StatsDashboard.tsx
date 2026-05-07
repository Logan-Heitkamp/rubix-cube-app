import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useProgressStore } from '../../store/useProgressStore';

export function StatsDashboard() {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const { progress, getStats } = useProgressStore();
  const stats = getStats();

  const skillLevels = progress.skillLevels;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Progress Dashboard
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Track your cube solving journey
        </Text>
      </View>

      {/* Streak Counter */}
      <View style={[styles.streakCard, { backgroundColor: theme.surface }]}>
        <View style={styles.streakIcon}>
          <Text style={[styles.streakEmoji, { color: '#f59e0b' }]}>🔥</Text>
        </View>
        <View style={styles.streakInfo}>
          <Text style={[styles.streakLabel, { color: theme.textSecondary }]}>
            Current Streak
          </Text>
          <Text style={[styles.streakValue, { color: theme.text }]}>
            {progress.dailyStreak} day{progress.dailyStreak !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Total Solves
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.totalSolves}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Best Time
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.bestTime ? formatTime(stats.bestTime) : '--'}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Ao5
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.avg5 ? formatTime(stats.avg5) : '--'}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Ao12
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.avg12 ? formatTime(stats.avg12) : '--'}
          </Text>
        </View>
      </View>

      {/* Skill Progress */}
      <View style={[styles.skillsCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.skillsTitle, { color: theme.text }]}>
          Skill Levels
        </Text>
        {(['cross', 'f2l', 'oll', 'pll'] as const).map((skill) => (
          <View key={skill} style={styles.skillRow}>
            <Text style={[styles.skillName, { color: theme.text }]}>
              {skill.toUpperCase()}
            </Text>
            <View style={styles.skillBarContainer}>
              <View
                style={[
                  styles.skillBar,
                  {
                    width: `${Math.min(100, skillLevels[skill] * 10)}%`,
                    backgroundColor: getSkillColor(skill),
                  },
                ]}
              />
            </View>
            <Text style={[styles.skillLevel, { color: theme.textSecondary }]}>
              {skillLevels[skill]}
            </Text>
          </View>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={[styles.activityCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.activityTitle, { color: theme.text }]}>
          Recent Activity
        </Text>
        {progress.solves.length === 0 ? (
          <Text style={[styles.emptyActivity, { color: theme.textSecondary }]}>
            No solves yet. Start timing!
          </Text>
        ) : (
          <View style={styles.activityList}>
            {progress.solves.slice(0, 5).map((solve, index) => (
              <View key={index} style={styles.activityItem}>
                <Text style={[styles.solveTime, { color: theme.text }]}>
                  {formatTime(solve.time)}
                </Text>
                <Text style={[styles.solveDate, { color: theme.textSecondary }]}>
                  {new Date(solve.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const milliseconds = ms % 1000;

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }
  return `${remainingSeconds}.${milliseconds.toString().padStart(3, '0')}`;
}

function getSkillColor(skill: 'cross' | 'f2l' | 'oll' | 'pll'): string {
  const colors = {
    cross: '#22c55e',
    f2l: '#3b82f6',
    oll: '#f59e0b',
    pll: '#ef4444',
  };
  return colors[skill];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  streakIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakInfo: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  streakValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
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
  skillsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
    width: 50,
  },
  skillBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillBar: {
    height: '100%',
    borderRadius: 4,
  },
  skillLevel: {
    fontSize: 12,
    width: 24,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  activityList: {
    gap: 8,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  solveTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  solveDate: {
    fontSize: 12,
  },
  emptyActivity: {
    textAlign: 'center',
    padding: 16,
  },
});
