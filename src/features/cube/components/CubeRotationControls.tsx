import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../../store/useThemeStore';
import { useCubeStore } from '../../../store/useCubeStore';

interface CubeRotationControlsProps {
  onReset?: () => void;
  style?: object;
}

export function CubeRotationControls({ onReset, style }: CubeRotationControlsProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const store = useCubeStore();
  const rotateFace = store.rotateFace;

  // Corner view rotations
  const rotateViews = {
    top: { x: -90, y: 0 },
    bottom: { x: 90, y: 0 },
    front: { x: 0, y: 0 },
    back: { x: 0, y: 180 },
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }, style]}>
      <View style={styles.row}>
        {/* Top-Left: Top view */}
        <RotationButton
          label="↑"
          tooltip="Top"
          onClick={() => rotateFace(rotateViews.top.x, rotateViews.top.y)}
          theme={theme}
        />
        {/* Top-Right: Back view */}
        <RotationButton
          label="↺"
          tooltip="Back"
          onClick={() => rotateFace(rotateViews.back.x, rotateViews.back.y)}
          theme={theme}
        />
      </View>
      <View style={styles.row}>
        {/* Bottom-Left: Front view */}
        <RotationButton
          label="F"
          tooltip="Front"
          onClick={() => rotateFace(rotateViews.front.x, rotateViews.front.y)}
          theme={theme}
        />
        {/* Bottom-Right: Bottom view */}
        <RotationButton
          label="↓"
          tooltip="Bottom"
          onClick={() => rotateFace(rotateViews.bottom.x, rotateViews.bottom.y)}
          theme={theme}
        />
      </View>
      {/* Reset button below */}
      <View style={styles.resetRow}>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: theme.border }]}
          onPress={onReset}
        >
          <Text style={[styles.resetText, { color: theme.textSecondary }]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface RotationButtonProps {
  label: string;
  tooltip?: string;
  onClick?: () => void;
  theme: any;
}

function RotationButton({ label, onClick, theme }: RotationButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.primary },
      ]}
      onPress={onClick}
    >
      <Text style={[styles.label, { color: '#fff' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 6,
    padding: 10,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  resetRow: {
    justifyContent: 'center',
    marginTop: 4,
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  resetText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
