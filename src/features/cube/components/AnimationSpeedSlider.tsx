import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, LayoutChangeEvent, Dimensions } from 'react-native';

interface AnimationSpeedSliderProps {
  value: number;
  onChange: (value: number) => void;
  theme: {
    primary: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

export function AnimationSpeedSlider({ value, onChange, theme }: AnimationSpeedSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<View>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };

  const handleValueChange = (clientX: number) => {
    if (sliderWidth === 0) return;

    // Calculate the position within the slider (0 to 1)
    const position = Math.max(0, Math.min(1, clientX / sliderWidth));

    // Convert to value (0.1 to 16)
    const newValue = 0.1 + position * 15.9;
    onChange(newValue);
  };

  const handlePress = (e: any) => {
    setIsDragging(true);
    handleValueChange(e.nativeEvent.locationX);
  };

  const handleMove = (e: any) => {
    if (isDragging) {
      handleValueChange(e.nativeEvent.locationX);
    }
  };

  const handleRelease = () => {
    setIsDragging(false);
  };

  // Calculate slider fill percentage
  const fillPercentage = ((value - 0.1) / 15.9) * 100;

  return (
    <View style={styles.container}>
      <View
        ref={sliderRef}
        style={styles.sliderContainer}
        onLayout={handleLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handlePress}
        onResponderMove={handleMove}
        onResponderRelease={handleRelease}
        onResponderTerminationRequest={() => {
          setIsDragging(false);
          return false;
        }}
      >
        {/* Track */}
        <View style={[styles.track, { backgroundColor: theme.border }]}>
          {/* Fill */}
          <View style={[styles.fill, { backgroundColor: theme.primary, width: `${fillPercentage}%` }]} />
        </View>

        {/* Thumb */}
        <TouchableOpacity
          style={[
            styles.thumb,
            {
              backgroundColor: theme.primary,
              left: `${fillPercentage}%`,
            },
          ]}
          activeOpacity={1}
        />
      </View>
    </View>
  );
}

const { width: windowWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 30,
    padding: 0,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    top: '50%',
    marginTop: -8,
    transform: [{ translateX: -8 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
});
