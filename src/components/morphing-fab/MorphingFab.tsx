import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Dimensions, BackHandler } from 'react-native';
import {
  Canvas,
  RoundedRect,
  Group,
  Shadow,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const FAB_SIZE = 72;
const MENU_WIDTH = 220;
const MENU_HEIGHT = 280;
const RADIUS_COLLAPSED = 36;
const RADIUS_EXPANDED = 0;

interface MorphingFabProps {
  color?: string;
  expandedColor?: string;
  isDark?: boolean; // Manual override for status bar style
  icon?: string;
  children?: React.ReactNode | ((props: { toggle: () => void; isExpanded: boolean }) => React.ReactNode);
}

export const MorphingFab: React.FC<MorphingFabProps> = ({
  children,
  color = '#000000',
  expandedColor = 'white',
  isDark,
  icon = 'add',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const transition = useSharedValue(0); // 0 = collapsed, 1 = expanded
  const radiusTransition = useSharedValue(0);

  const toggleMenu = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    // Bouncy spring for layout (position/size)
    transition.value = withSpring(nextState ? 1 : 0, {
      damping: 25,
      stiffness: 220,
      mass: 1,
    });

    // Bouncy spring for border radius
    radiusTransition.value = withSpring(nextState ? 1 : 0, {
      damping: 25,
      stiffness: 150,
      mass: 1,
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  useEffect(() => {
    const backAction = () => {
      if (isExpanded) {
        toggleMenu();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isExpanded]);

  // Skia Animated Values
  const width = useDerivedValue(() => {
    return interpolate(transition.value, [0, 1], [FAB_SIZE, SCREEN_WIDTH]);
  });

  const height = useDerivedValue(() => {
    return interpolate(transition.value, [0, 1], [FAB_SIZE, SCREEN_HEIGHT]);
  });

  const borderRadius = useDerivedValue(() => {
    return interpolate(radiusTransition.value, [0, 1], [RADIUS_COLLAPSED, RADIUS_EXPANDED]);
  });

  const x = useDerivedValue(() => {
    return interpolate(transition.value, [0, 1], [SCREEN_WIDTH - FAB_SIZE - 24, 0]);
  });

  const y = useDerivedValue(() => {
    return interpolate(transition.value, [0, 1], [SCREEN_HEIGHT - FAB_SIZE - 60, 0]);
  });

  // Reanimated styles for UI overlay
  const fabIconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(transition.value, [0, 1], [0, 45])}deg` },
      { scale: interpolate(transition.value, [0, 0.2], [1, 0]) },
    ],
    opacity: interpolate(transition.value, [0, 0.1], [1, 0]),
  }));

  const menuItemsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(transition.value, [0.4, 1], [0, 1]),
    transform: [
      { translateY: interpolate(transition.value, [0.4, 1], [20, 0]) },
    ],
  }));

  const overlayContainerStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    left: x.value,
    top: y.value,
    borderRadius: borderRadius.value,
  }));

  // Helper to determine if the background is dark
  const isBackgroundDark = () => {
    if (isDark !== undefined) return isDark;
    
    const darkColors = ['black', '#000000', 'red', '#380000', '#380000ff'];
    const normalizedColor = expandedColor.toLowerCase();
    return darkColors.some(c => normalizedColor.startsWith(c));
  };

  return (
    <View style={[styles.container, { zIndex: isExpanded ? 1000 : 1 }]} pointerEvents="box-none">
      <StatusBar
        style={isExpanded && isBackgroundDark() ? 'light' : 'dark'} 
        animated
      />
      {/* Background Overlay when expanded */}
      {isExpanded && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={toggleMenu}
        />
      )}

      <Canvas style={styles.canvas} pointerEvents="none">
        <Group>
          <RoundedRect
            x={x}
            y={y}
            width={width}
            height={height}
            r={borderRadius}
            color={useDerivedValue(() => {
              return interpolateColor(transition.value, [0, 1], [color, expandedColor]);
            })}
          >
            <Shadow dx={0} dy={10} blur={20} color="rgba(0,0,0,0.1)" />
          </RoundedRect>
        </Group>
      </Canvas>

      <Animated.View style={[styles.overlayContainer, overlayContainerStyle]} pointerEvents="box-none">
        {/* FAB Plus Icon */}
        <Animated.View style={[styles.fabButton, fabIconStyle]}>
          <Ionicons name={icon as any} size={32} color="white" style={{ marginTop: 0 }} />
        </Animated.View>

        {/* Menu Items */}
        <Animated.View style={[styles.menuContent, menuItemsStyle, { position: 'absolute' }]} pointerEvents={isExpanded ? 'auto' : 'none'}>
          {typeof children === 'function' ? children({ toggle: toggleMenu, isExpanded }) : children}
        </Animated.View>

        {/* Interaction Pressable */}
        <Pressable
          style={[styles.touchArea, isExpanded ? styles.touchAreaExpanded : styles.touchAreaCollapsed]} 
          onPress={toggleMenu}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContainer: {
    position: 'absolute',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButton: {
    position: 'absolute',
    width: FAB_SIZE,
    height: FAB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchArea: {
    position: 'absolute',
    zIndex: 10,
  },
  touchAreaCollapsed: {
    width: FAB_SIZE,
    height: FAB_SIZE,
  },
  touchAreaExpanded: {
    top: 10,
    right: 10,
    width: 44,
    height: 44,
  },
  menuContent: {
    width: '100%',
    height: '100%',
  },
});

export { FAB_SIZE, MENU_WIDTH, MENU_HEIGHT };
