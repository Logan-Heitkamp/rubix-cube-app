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

  const rotateViews = {
    front: { x: 0, y: 0 },
    right: { x: 0, y: 90 },
    back: { x: 0, y: 180 },
    left: { x: 0, y: -90 },
    top: { x: -90, y: 0 },
    bottom: { x: 90, y: 0 },
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }, style]}>
      <View style={styles.row}>
        <RotationButton
          label="↑"
          onClick={() => rotateFace(rotateViews.top.x, rotateViews.top.y)}
          theme={theme}
        />
        <RotationButton
          label="F"
          onClick={() => rotateFace(rotateViews.front.x, rotateViews.front.y)}
          theme={theme}
        />
        <RotationButton
          label="↓"
          onClick={() => rotateFace(rotateViews.bottom.x, rotateViews.bottom.y)}
          theme={theme}
        />
      </View>
      <View style={styles.row}>
        <RotationButton
          label="←"
          onClick={() => rotateFace(rotateViews.left.x, rotateViews.left.y)}
          theme={theme}
        />
        <RotationButton
          label="R"
          onClick={() => rotateFace(rotateViews.right.x, rotateViews.right.y)}
          theme={theme}
        />
        <RotationButton
          label="Reset"
          onClick={onReset || undefined}
          theme={theme}
          variant="reset"
        />
      </View>
    </View>
  );
}

interface RotationButtonProps {
  label: string;
  onClick?: () => void;
  theme: any;
  variant?: 'default' | 'reset';
}

function RotationButton({ label, onClick, theme, variant = 'default' }: RotationButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.primary },
        variant === 'reset' && { backgroundColor: theme.border },
      ]}
      onPress={onClick}
    >
      <Text style={[styles.label, { color: variant === 'reset' ? theme.text : '#fff' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 4,
    padding: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
