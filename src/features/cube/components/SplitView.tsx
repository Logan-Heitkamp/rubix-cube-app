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
  leftWidth = SCREEN_WIDTH / 2,
  rightWidth = SCREEN_WIDTH / 2,
}: SplitViewProps) {
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <View style={[styles.leftPane, !isMobile && { width: leftWidth }]}>
        {left}
      </View>
      {!isMobile && (
        <View style={[styles.rightPane, { width: rightWidth }]}>
          {right}
        </View>
      )}
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
  containerMobile: {
    flexDirection: 'column',
  },
  leftPane: {
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  leftPaneMobile: {
    height: '50%',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderRightWidth: 0,
  },
  rightPane: {
    height: '100%',
    flex: 1,
    overflow: 'hidden',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
});
