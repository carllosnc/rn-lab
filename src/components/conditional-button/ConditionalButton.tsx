import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Canvas,
  RoundedRect,
  Group,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { FONTS } from '../../constants/settings';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_WIDTH = 180;
const BUTTON_HEIGHT = 56;
const GAP = 12;

interface ConditionalButtonProps {
  label?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  question?: string;
  successMessage?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConditionalButton: React.FC<ConditionalButtonProps> = ({
  label = 'Delete',
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  question = 'Are you sure?',
  successMessage = 'Deleted',
  onConfirm,
  onCancel,
}) => {
  const [isSplit, setIsSplit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const transition = useSharedValue(0); // 0 = single, 1 = split
  const isLoadingShared = useSharedValue(0);
  const isConfirmedShared = useSharedValue(0);

  const handlePress = () => {
    if (!isSplit && !isLoading && !isConfirmed) {
      setIsSplit(true);
      // Snappier spring physics with minimal bounce
      transition.value = withSpring(1, { damping: 55, stiffness: 450 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleConfirm = () => {
    setIsLoading(true);
    isLoadingShared.value = withSpring(1);
    setIsSplit(false);
    transition.value = withSpring(0, { damping: 45, stiffness: 450 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 3 seconds loading as requested
    setTimeout(() => {
      setIsLoading(false);
      isLoadingShared.value = withSpring(0);
      setIsConfirmed(true);
      isConfirmedShared.value = withSpring(1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onConfirm?.();

      // Reset to original state after showing confirmation for 2 seconds
      setTimeout(() => {
        setIsConfirmed(false);
        isConfirmedShared.value = withSpring(0);
      }, 2000);
    }, 3000);
  };

  const handleCancel = () => {
    onCancel?.();
    reset();
  };

  const reset = () => {
    setIsSplit(false);
    transition.value = withSpring(0, { damping: 45, stiffness: 450 });
  };

  // Animated values for Skia
  const leftButtonX = useDerivedValue(() => {
    return interpolate(transition.value, [0, 1], [0, -(BUTTON_WIDTH / 2 + GAP / 2)]);
  });

  const rightButtonX = useDerivedValue(() => {
    return interpolate(transition.value, [0, 1], [0, (BUTTON_WIDTH / 2 + GAP / 2)]);
  });

  const questionOpacity = useDerivedValue(() => {
    return interpolate(transition.value, [0, 0.8, 1], [0, 0, 1]);
  });

  const questionScale = useDerivedValue(() => {
    return interpolate(transition.value, [0, 1], [0.9, 1]);
  });

  const leftButtonTransform = useDerivedValue(() => [
    { translateX: leftButtonX.value },
  ]);

  const rightButtonTransform = useDerivedValue(() => [
    { translateX: rightButtonX.value },
  ]);

  // Animated styles for standard RN Text labels
  const leftLabelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftButtonX.value }],
    opacity: interpolate(transition.value, [0, 0.4, 0.6], [1, 1, 0]),
  }));

  const confirmLabelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftButtonX.value }],
    opacity: interpolate(transition.value, [0.4, 0.6, 1], [0, 1, 1]),
  }));

  const rightLabelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightButtonX.value }],
    opacity: transition.value,
  }));

  const questionStyle = useAnimatedStyle(() => ({
    opacity: questionOpacity.value,
    transform: [
      { translateY: interpolate(transition.value, [0, 1], [15, 0]) },
      { scale: questionScale.value },
    ],
  }));

  const successMessageStyle = useAnimatedStyle(() => ({
    opacity: isConfirmedShared.value,
    transform: [
      { translateY: interpolate(isConfirmedShared.value, [0, 1], [10, 0]) },
    ],
  }));

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Group transform={[{ translateX: SCREEN_WIDTH / 2 }, { translateY: 100 }]}>
          {/* Left Button Shape */}
          <Group transform={leftButtonTransform}>
            <RoundedRect
              x={-BUTTON_WIDTH / 2}
              y={-BUTTON_HEIGHT / 2}
              width={BUTTON_WIDTH}
              height={BUTTON_HEIGHT}
              r={28}
              color={useDerivedValue(() => {
                const baseColor = interpolateColor(transition.value, [0, 1], ['#1E293B', '#EF4444']);
                const loadingColor = interpolateColor(isLoadingShared.value, [0, 1], [baseColor, '#CBD5E1']);
                return interpolateColor(isConfirmedShared.value, [0, 1], [loadingColor, '#22C55E']);
              })}
            />
          </Group>

          {/* Right Button Shape */}
          <Group 
            transform={rightButtonTransform}
            opacity={transition}
          >
            <RoundedRect
              x={-BUTTON_WIDTH / 2}
              y={-BUTTON_HEIGHT / 2}
              width={BUTTON_WIDTH}
              height={BUTTON_HEIGHT}
              r={28}
              color="#0F172A"
            />
          </Group>
        </Group>
      </Canvas>

      {/* Overlay Labels (Centered absolute positioning) */}
      <View style={styles.overlay} pointerEvents="none">
        <Animated.View style={[styles.questionContainer, questionStyle]}>
          <Animated.Text style={styles.questionText}>{question}</Animated.Text>
        </Animated.View>

        <Animated.View style={[styles.labelWrapper, leftLabelStyle]}>
          {isLoading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Animated.Text style={styles.buttonText}>{label}</Animated.Text>
          )}
        </Animated.View>

        <Animated.View style={[styles.successContainer, successMessageStyle]}>
          <Animated.Text style={styles.successText}>{successMessage}</Animated.Text>
        </Animated.View>

        <Animated.View style={[styles.labelWrapper, confirmLabelStyle]}>
          <Animated.Text style={styles.buttonText}>{confirmLabel}</Animated.Text>
        </Animated.View>

        <Animated.View style={[styles.labelWrapper, rightLabelStyle]}>
          <Animated.Text style={styles.buttonText}>{cancelLabel}</Animated.Text>
        </Animated.View>
      </View>

      {/* Invisible Touch Areas for interaction */}
      <View style={styles.touchContainer} pointerEvents="box-none">
        {!isSplit ? (
          <Pressable style={styles.mainTouch} onPress={handlePress} />
        ) : (
          <View style={styles.splitTouchContainer}>
            <Pressable style={styles.splitTouch} onPress={handleConfirm} />
            <View style={{ width: GAP }} />
            <Pressable style={styles.splitTouch} onPress={handleCancel} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionContainer: {
    position: 'absolute',
    top: 30,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    color: '#64748B',
    fontSize: 15,
    fontFamily: FONTS.inter.medium,
    textAlign: 'center',
  },
  labelWrapper: {
    position: 'absolute',
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: FONTS.inter.medium,
    textAlign: 'center',
  },
  touchContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTouch: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
  },
  splitTouchContainer: {
    flexDirection: 'row',
    width: BUTTON_WIDTH * 2 + GAP,
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
  },
  splitTouch: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
  },
  successContainer: {
    position: 'absolute',
    top: 30,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: '#0d893aff',
    fontSize: 18,
    fontFamily: FONTS.inter.medium,
    textAlign: 'center',
  },
});
