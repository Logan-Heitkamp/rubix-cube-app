import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplitViewProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: number;
  rightWidth?: number;
}

export function SplitView({
  left,
  right,
  leftWidth = 0.5,
  rightWidth = 0.5,
}: SplitViewProps) {
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  return (
    <View style={styles.container}>
      <View style={[styles.leftPane, { width: leftWidth }]}>
        {left}
      </View>
      <View style={[styles.rightPane, { width: rightWidth }]}>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  leftPane: {
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  rightPane: {
    height: '100%',
    flex: 1,
    overflow: 'hidden',
  },
});
