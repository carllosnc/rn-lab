import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Canvas,
  Rect,
  Circle,
  Group,
  vec,
  Mask,
  Fill,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useDerivedValue,
  withTiming,
  runOnJS,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { FONTS } from '../../constants/settings';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const INPUT_WIDTH = SCREEN_WIDTH * 0.8;
const INPUT_HEIGHT = 60;
const BUTTON_SIZE = 84;

interface LockScreenProps {
  correctPassword?: string;
  onUnlocked?: () => void;
  statusBarStyle?: 'light' | 'dark' | 'auto';
  children: React.ReactNode;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  correctPassword = 'password',
  onUnlocked,
  statusBarStyle,
  children,
}) => {
  const [password, setPassword] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const transition = useSharedValue(0); // 0 = Locked, 1 = Input Mode
  const unlockProgress = useSharedValue(0); // 0 = Closed, 1 = Opened
  const shake = useSharedValue(0);
  const errorProgress = useSharedValue(0); // 0 = normal, 1 = error

  const springConfig = {
    damping: 18,
    stiffness: 150,
    mass: 1,
  };

  const handleLockButtonPress = () => {
    setIsInputVisible(true);
    transition.value = withSpring(1, springConfig);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleUnlock = () => {
    if (password === correctPassword) {
      setError(null);
      errorProgress.value = withTiming(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      unlockProgress.value = withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      }, (finished) => {
        if (finished) {
          runOnJS(setIsUnlocked)(true);
          if (onUnlocked) runOnJS(onUnlocked)();
        }
      });
    } else {
      setError('Incorrect password');
      errorProgress.value = withSpring(1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake.value = withTiming(1, { duration: 80 }, () => {
        shake.value = withTiming(-1, { duration: 80 }, () => {
          shake.value = withTiming(0, { duration: 80 });
        });
      });
      setPassword('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) {
      setError(null);
      errorProgress.value = withTiming(0);
    }
  };

  // Animated Styles
  const inputContainerStyle = useAnimatedStyle(() => {
    const width = interpolate(transition.value, [0, 1], [BUTTON_SIZE, INPUT_WIDTH]);
    const height = interpolate(transition.value, [0, 1], [BUTTON_SIZE, INPUT_HEIGHT]);
    const borderRadius = interpolate(transition.value, [0, 1], [BUTTON_SIZE / 2, 30]);
    const translateY = interpolate(transition.value, [0, 1], [0, -40]);
    const translateX = shake.value * 12;

    const borderColor = interpolateColor(
      errorProgress.value,
      [0, 1],
      ['transparent', '#ef4444']
    );

    const borderWidth = interpolate(errorProgress.value, [0, 1], [0, 2]);

    return {
      width,
      height,
      borderRadius,
      transform: [{ translateY }, { translateX }],
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      borderWidth,
      borderColor,
    };
  });

  const lockIconStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(transition.value, [0, 0.2], [1, 0]),
      transform: [{ scale: interpolate(transition.value, [0, 0.2], [1, 0.5]) }],
    };
  });

  const inputFieldStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(transition.value, [0.8, 1], [0, 1]),
      width: '100%',
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
    };
  });

  const submitButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(transition.value, [0.9, 1], [0, 1]),
      transform: [
        { translateY: interpolate(transition.value, [0.9, 1], [20, 0]) },
        { scale: interpolate(transition.value, [0.9, 1], [0.5, 1]) },
      ],
      marginTop: 0,
    };
  });

  const contentOpacity = useAnimatedStyle(() => {
    return {
      opacity: unlockProgress.value,
      transform: [{ scale: interpolate(unlockProgress.value, [0, 1], [0.95, 1]) }],
    };
  });

  const uiContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(unlockProgress.value, [0, 0.15], [1, 0]),
      transform: [{ scale: interpolate(unlockProgress.value, [0, 0.15], [1, 1.1]) }],
      pointerEvents: unlockProgress.value > 0.1 ? 'none' : 'auto',
    };
  });

  const revealRadius = useDerivedValue(() => {
    // Reveal from the center
    const maxRadius = Math.sqrt(SCREEN_WIDTH ** 2 + SCREEN_HEIGHT ** 2);
    return interpolate(unlockProgress.value, [0, 1], [0, maxRadius]);
  });

  const revealOpacity = useDerivedValue(() => {
    return interpolate(unlockProgress.value, [0, 0.2], [1, 1], 'clamp');
  });

  const errorTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(error ? 1 : 0),
      transform: [{ translateY: withTiming(error ? -30 : -20) }],
      position: 'absolute',
      top: -60,
    };
  });

  if (isUnlocked) {
    return <View style={styles.fullScreen}>{children}</View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar style={statusBarStyle || (isUnlocked ? 'dark' : 'light')} animated />
      {/* Background Content (Revealed after unlock) */}
      <Animated.View style={[styles.contentContainer, contentOpacity]}>
        {children}
      </Animated.View>

      {/* Skia Reveal Mask */}
      <Canvas style={styles.canvas}>
        <Mask
          mask={
            <Group>
              <Fill color="white" />
              <Circle
                c={vec(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)}
                r={revealRadius}
                color="black"
                blendMode="xor"
              />
            </Group>
          }
        >
          <Rect
            x={0}
            y={0}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            color="black"
            opacity={revealOpacity}
          />
        </Mask>
      </Canvas>

      {/* UI Overlay */}
      <Animated.View style={[styles.uiOverlay, uiContainerStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.centerContent}>
            {error && (
              <Animated.View style={errorTextStyle}>
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}
            <Animated.View style={inputContainerStyle}>
              {!isInputVisible ? (
                <Pressable onPress={handleLockButtonPress} style={styles.lockButtonTouch}>
                  <Animated.View style={lockIconStyle}>
                    <Ionicons name="lock-closed" size={36} color="black" />
                  </Animated.View>
                </Pressable>
              ) : (
                <Animated.View style={inputFieldStyle}>
                  <Ionicons name="lock-closed" size={20} color="#999" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={handlePasswordChange}
                    autoFocus
                    onSubmitEditing={handleUnlock}
                  />
                </Animated.View>
              )}
            </Animated.View>

            {isInputVisible && (
              <Animated.View style={submitButtonStyle}>
                <Pressable
                  style={({ pressed }) => [
                    styles.submitButton,
                    { opacity: pressed ? 0.8 : 1 }
                  ]}
                  onPress={handleUnlock}
                >
                  <Ionicons name="chevron-forward" size={32} color="black" />
                </Pressable>
              </Animated.View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  fullScreen: {
    flex: 1,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  uiOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  lockButtonTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontFamily: FONTS.inter.medium,
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
    flex: 1,
    height: '100%',
  },
  submitButton: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  submitButtonText: {
    color: 'white',
    fontFamily: FONTS.inter.semiBold,
    fontSize: 16,
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6868ff',
    fontFamily: FONTS.inter.medium,
    fontSize: 14,
    marginTop: 8,
  },
});
