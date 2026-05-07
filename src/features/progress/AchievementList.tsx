import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useProgressStore } from '../../store/useProgressStore';

export function AchievementList() {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const { achievements } = useProgressStore();

  const achievementTiers = {
    bronze: {
      color: '#cd7f32',
      icon: '🥉',
      label: 'Bronze',
    },
    silver: {
      color: '#c0c0c0',
      icon: '🥈',
      label: 'Silver',
    },
    gold: {
      color: '#ffd700',
      icon: '🥇',
      label: 'Gold',
    },
    diamond: {
      color: '#b9f2ff',
      icon: '💎',
      label: 'Diamond',
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Achievements
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {achievements.length} unlocked
        </Text>
      </View>

      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const tier = achievementTiers[item.tier as keyof typeof achievementTiers] || achievementTiers.bronze;
          return (
            <View style={[styles.achievement, { backgroundColor: theme.surface }]}>
              <View style={[styles.iconContainer, { backgroundColor: `${tier.color}20` }]}>
                <Text style={[styles.icon, { color: tier.color }]}>{tier.icon}</Text>
              </View>
              <View style={styles.content}>
                <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                  {item.description}
                </Text>
                <View style={styles.footer}>
                  <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
                    <Text style={styles.tierText}>{tier.label}</Text>
                  </View>
                  <Text style={[styles.date, { color: theme.textSecondary }]}>
                    {new Date(item.earnedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyIcon, { color: theme.textSecondary }]}>
              🏆
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No achievements yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Complete solves and algorithms to earn badges
            </Text>
          </View>
        }
      />
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
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  achievement: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tierBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tierText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 10,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
});
