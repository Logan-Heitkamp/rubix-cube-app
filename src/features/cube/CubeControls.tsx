import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useCubeStore } from '../../store/useCubeStore';

interface CubeControlsProps {
  showRotation?: boolean;
}

export function CubeControls({ showRotation = false }: CubeControlsProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const store = useCubeStore();
  const state = store.state;
  const dispatch = store.dispatch;

  const faces = state.faces;

  console.log('CubeControls rendering');
 const handleFaceMove = (face: string, modifier: '' | "'" | '2' = '') => {
    dispatch({
      type: 'MOVE_FACE',
      payload: faces,
      move: `${face}${modifier}`,
    });
  };

  return (
    <View style={styles.container}>
      {/* Face Controls */}
      <View style={styles.faceControls}>
        <View style={styles.faceRow}>
          <FaceButton face="U" label="U" clockwise={true} />
          <FaceButton face="U" label="U'" clockwise={false} />
          <FaceButton face="U" label="U2" clockwise={true} modifier="2" />
        </View>
        <View style={styles.faceRow}>
          <FaceButton face="D" label="D" clockwise={true} />
          <FaceButton face="D" label="D'" clockwise={false} />
          <FaceButton face="D" label="D2" clockwise={true} modifier="2" />
        </View>
        <View style={styles.faceRow}>
          <FaceButton face="L" label="L" clockwise={true} />
          <FaceButton face="L" label="L'" clockwise={false} />
          <FaceButton face="L" label="L2" clockwise={true} modifier="2" />
        </View>
        <View style={styles.faceRow}>
          <FaceButton face="R" label="R" clockwise={true} />
          <FaceButton face="R" label="R'" clockwise={false} />
          <FaceButton face="R" label="R2" clockwise={true} modifier="2" />
        </View>
        <View style={styles.faceRow}>
          <FaceButton face="F" label="F" clockwise={true} />
          <FaceButton face="F" label="F'" clockwise={false} />
          <FaceButton face="F" label="F2" clockwise={true} modifier="2" />
        </View>
        <View style={styles.faceRow}>
          <FaceButton face="B" label="B" clockwise={true} />
          <FaceButton face="B" label="B'" clockwise={false} />
          <FaceButton face="B" label="B2" clockwise={true} modifier="2" />
        </View>
      </View>

      {/* Camera Rotation (if enabled) */}
      {showRotation && (
        <View style={styles.rotationControls}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Camera
          </Text>
          <View style={styles.rotationRow}>
            <TouchableOpacity
              style={[styles.rotationButton, { backgroundColor: theme.surface }]}
              onPress={() => dispatch({ type: 'ROTATE_CAMERA', payload: { x: 15, y: 0 } })}
            >
              <Text style={[styles.rotationText, { color: theme.text }]}>↑</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rotationRow}>
            <TouchableOpacity
              style={[styles.rotationButton, { backgroundColor: theme.surface }]}
              onPress={() => dispatch({ type: 'ROTATE_CAMERA', payload: { x: 0, y: -15 } })}
            >
              <Text style={[styles.rotationText, { color: theme.text }]}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rotationButton, { backgroundColor: theme.surface }]}
              onPress={() => dispatch({ type: 'ROTATE_CAMERA', payload: { x: 0, y: 15 } })}
            >
              <Text style={[styles.rotationText, { color: theme.text }]}>→</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rotationRow}>
            <TouchableOpacity
              style={[styles.rotationButton, { backgroundColor: theme.surface }]}
              onPress={() => dispatch({ type: 'ROTATE_CAMERA', payload: { x: -15, y: 0 } })}
            >
              <Text style={[styles.rotationText, { color: theme.text }]}>↓</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

interface FaceButtonProps {
  face: string;
  label: string;
  clockwise: boolean;
  modifier?: '' | '2';
}

function FaceButton({ face, label, clockwise, modifier = '' }: FaceButtonProps) {
  const themeStore = useThemeStore();
  const theme = themeStore.colors;
  const store = useCubeStore();
  const state = store.state;
  const dispatch = store.dispatch;

  const handlePress = () => {
    const move = `${face}${clockwise ? modifier : "'"}`;
    dispatch({
      type: 'MOVE_FACE',
      payload: state.faces,
      move,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.faceButton, { backgroundColor: theme.surface }]}
      onPress={handlePress}
    >
      <Text style={[styles.faceLabel, { color: theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  faceControls: {
    gap: 4,
  },
  faceRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  faceButton: {
    width: 40,
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  rotationControls: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 4,
    textAlign: 'center',
  },
  rotationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  rotationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotationText: {
    fontSize: 16,
  },
});
