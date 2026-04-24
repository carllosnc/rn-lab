import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import {
  Canvas,
  Circle,
  Path,
  Skia,
  rect,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useDerivedValue,
  runOnJS,
  withTiming,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedNumber } from '../animated-number/animated-number';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIZE = SCREEN_WIDTH * 0.8;
const RADIUS = SIZE / 2;
const STROKE_WIDTH = 30;
const ARC_RADIUS = RADIUS - STROKE_WIDTH / 2 - 10;

// Arc configuration (270 degrees)
const START_ANGLE = 135;
const SWEEP_ANGLE = 270;

interface VolumeControlProps {
  initialValue?: number;
  onValueChange?: (value: number) => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  initialValue = 75,
  onValueChange,
}) => {
  const [displayValue, setDisplayValue] = React.useState(initialValue);
  const volume = useSharedValue(initialValue);
  const lastVolume = useSharedValue(initialValue > 0 ? initialValue : 75);
  
  const isMuted = displayValue === 0;

  useAnimatedReaction(
    () => volume.value,
    (val) => {
      runOnJS(setDisplayValue)(Math.round(val));
    }
  );

  const updateVolume = useCallback((x: number, y: number) => {
    'worklet';
    const dx = x - RADIUS;
    const dy = y - RADIUS;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    if (angle < 0) angle += 360;

    let shiftedAngle = angle - START_ANGLE;
    if (shiftedAngle < 0) shiftedAngle += 360;

    if (shiftedAngle > SWEEP_ANGLE) {
      if (shiftedAngle < SWEEP_ANGLE + (360 - SWEEP_ANGLE) / 2) {
        shiftedAngle = SWEEP_ANGLE;
      } else {
        shiftedAngle = 0;
      }
    }

    const newValue = Math.round((shiftedAngle / SWEEP_ANGLE) * 100);
    volume.value = newValue;

    if (onValueChange) {
      runOnJS(onValueChange)(newValue);
    }
  }, [onValueChange]);

  const toggleMute = useCallback(() => {
    if (displayValue > 0) {
      lastVolume.value = displayValue;
      volume.value = withTiming(0, { duration: 500 });
      if (onValueChange) onValueChange(0);
    } else {
      const restoreValue = lastVolume.value > 0 ? lastVolume.value : 75;
      volume.value = withTiming(restoreValue, { duration: 500 });
      if (onValueChange) onValueChange(restoreValue);
    }
  }, [displayValue, onValueChange, lastVolume, volume]);

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      updateVolume(e.x, e.y);
    })
    .onUpdate((e) => {
      updateVolume(e.x, e.y);
    });

  const backgroundPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.addArc(
      rect(RADIUS - ARC_RADIUS, RADIUS - ARC_RADIUS, ARC_RADIUS * 2, ARC_RADIUS * 2),
      START_ANGLE,
      SWEEP_ANGLE
    );
    return path;
  }, []);

  const progressPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const currentSweep = (volume.value / 100) * SWEEP_ANGLE;
    path.addArc(
      rect(RADIUS - ARC_RADIUS, RADIUS - ARC_RADIUS, ARC_RADIUS * 2, ARC_RADIUS * 2),
      START_ANGLE,
      currentSweep
    );
    return path;
  });

  const handlePath = useDerivedValue(() => {
    const currentSweep = (volume.value / 100) * SWEEP_ANGLE;
    const angle = (START_ANGLE + currentSweep) * (Math.PI / 180);
    const x = RADIUS + ARC_RADIUS * Math.cos(angle);
    const y = RADIUS + ARC_RADIUS * Math.sin(angle);

    const path = Skia.Path.Make();
    const handleLength = STROKE_WIDTH + 10;

    const x1 = x + (handleLength / 2) * Math.cos(angle);
    const y1 = y + (handleLength / 2) * Math.sin(angle);
    const x2 = x - (handleLength / 2) * Math.cos(angle);
    const y2 = y - (handleLength / 2) * Math.sin(angle);

    path.moveTo(x1, y1);
    path.lineTo(x2, y2);

    return path;
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={{ width: SIZE, height: SIZE }}>
          <Canvas style={{ flex: 1 }}>
            <Path
              path={backgroundPath}
              color="#E2E8F0"
              style="stroke"
              strokeWidth={STROKE_WIDTH}
              strokeCap="round"
            />

            <Path
              path={progressPath}
              color="#00D2FF"
              style="stroke"
              strokeWidth={STROKE_WIDTH}
              strokeCap="round"
            />

            <Path
              path={handlePath}
              color="#000000"
              style="stroke"
              strokeWidth={10}
              strokeCap="round"
            />

            <Circle
              cx={RADIUS}
              cy={RADIUS}
              r={ARC_RADIUS - STROKE_WIDTH / 2 - 20}
              color="#000000"
            />
          </Canvas>

          <View style={[styles.numberContainer, { width: SIZE, height: SIZE }]}>
             <AnimatedNumber
                value={displayValue}
                style={styles.number}
             />
          </View>
        </View>
      </GestureDetector>

      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={toggleMute}
        style={styles.muteButton}
      >
        <Ionicons 
          name={isMuted ? "volume-mute" : "volume-medium"} 
          size={24} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  number: {
    fontSize: 60,
    color: '#FFFFFF',
    fontFamily: 'Inter_600Regular',
    fontVariant: ['tabular-nums'],
  },
  muteButton: {
    position: 'absolute',
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000000',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
