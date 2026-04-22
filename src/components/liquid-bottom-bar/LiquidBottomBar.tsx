import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import {
  Canvas,
  Group,
  Circle,
  Blur,
  ColorMatrix,
  Path,
  Paint,
  Skia,
  Shadow,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useDerivedValue,
  interpolateColor,
  WithSpringConfig,
  SharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH;

const SPRING_CONFIG: WithSpringConfig = {
  damping: 14,
  stiffness: 120,
  mass: 1,
};

export type TabItem = {
  id: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  activeColor: string;
};

const DEFAULT_TABS: TabItem[] = [
  { id: 'home', label: 'Home', activeColor: '#6366F1', iconName: 'home-outline' },
  { id: 'search', label: 'Search', activeColor: '#3B82F6', iconName: 'search-outline' },
  { id: 'shop', label: 'Shop', activeColor: '#8B5CF6', iconName: 'basket-outline' },
  { id: 'cart', label: 'Cart', activeColor: '#10B981', iconName: 'cart-outline' },
  { id: 'profile', label: 'Profile', activeColor: '#F59E0B', iconName: 'person-outline' },
];

interface LiquidBottomBarProps {
  tabs?: TabItem[];
  activeIndex: SharedValue<number>;
  onTabChange?: (index: number) => void;
  barHeight?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export const LiquidBottomBar = ({
  tabs = DEFAULT_TABS,
  activeIndex,
  onTabChange,
  barHeight = 100,
  activeColor: globalActiveColor,
  inactiveColor = '#aaa'
}: LiquidBottomBarProps) => {
  const TAB_WIDTH = BAR_WIDTH / tabs.length;
  const CIRCLE_RADIUS = 36;

  const liquidPos = useDerivedValue(() => {
    return withSpring(activeIndex.value * TAB_WIDTH + TAB_WIDTH / 2, SPRING_CONFIG);
  });

  const activeIndicatorColor = useDerivedValue(() => {
    return interpolateColor(
      activeIndex.value,
      tabs.map((_, i) => i),
      tabs.map(t => t.activeColor || globalActiveColor || '#6366F1')
    );
  });

  const matrix = useMemo(() => [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 40, -15,
  ], []);

  const liquidPaint = useMemo(() => (
    <Paint>
      <Blur blur={14} />
      <ColorMatrix matrix={matrix} />
    </Paint>
  ), [matrix]);

  const backgroundPath = useMemo(() => {
    const path = Skia.Path.Make();
    const r = 32;
    path.moveTo(0, 40 + r);
    path.quadTo(0, 40, r, 40);
    path.lineTo(BAR_WIDTH - r, 40);
    path.quadTo(BAR_WIDTH, 40, BAR_WIDTH, 40 + r);
    path.lineTo(BAR_WIDTH, 40 + barHeight);
    path.lineTo(0, 40 + barHeight);
    path.close();
    return path;
  }, [barHeight]);

  return (
    <View style={styles.container}>
      <View style={[styles.barWrapper, { width: BAR_WIDTH, height: barHeight + 40 }]}>
        <Canvas style={styles.canvas}>
          <Group>
            <Path path={backgroundPath}>
              <LinearGradient
                start={vec(0, 40)}
                end={vec(0, 40 + barHeight)}
                colors={['#000000', '#2E1065']}
              />
              <Shadow dx={0} dy={10} blur={20} color="rgba(0,0,0,0.5)" />
            </Path>
          </Group>

          <Group layer={liquidPaint}>
            <Path path={backgroundPath} color="#000000" />
            <Circle cx={liquidPos} cy={40} r={CIRCLE_RADIUS} color="#000000" />
            <LinearGradient
              start={vec(0, 40)}
              end={vec(0, 40 + barHeight)}
              colors={['#000000', '#2E1065']}
            />
          </Group>

          <Circle cx={liquidPos} cy={45} r={28} color={activeIndicatorColor} />
        </Canvas>

        <View style={[styles.tabsLayer, { height: barHeight }]}>
          {tabs.map((tab, index) => (
            <Pressable
              key={tab.id}
              onPress={() => {
                activeIndex.value = index;
                onTabChange?.(index);
              }}
              style={styles.tabButton}
            >
              <TabIcon
                tab={tab}
                index={index}
                activeIndex={activeIndex}
              />
              <AnimatedText
                label={tab.label}
                index={index}
                activeIndex={activeIndex}
                inactiveColor={inactiveColor}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const TabIcon = ({
  tab,
  index,
  activeIndex,
}: {
  tab: TabItem,
  index: number,
  activeIndex: SharedValue<number>,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === index;
    return {
      transform: [
        { translateY: withSpring(isActive ? -34 : -12, SPRING_CONFIG) },
        { scale: withSpring(isActive ? 1.2 : 1, SPRING_CONFIG) }
      ],
      opacity: withSpring(isActive ? 1 : 0.7, SPRING_CONFIG),
    };
  });

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
       <Ionicons name={tab.iconName} size={24} color="#FFFFFF" />
    </Animated.View>
  );
};

const AnimatedText = ({
  label,
  index,
  activeIndex,
  inactiveColor
}: {
  label: string,
  index: number,
  activeIndex: SharedValue<number>,
  inactiveColor: string
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === index;
    return {
      opacity: withSpring(isActive ? 1 : 0.4, SPRING_CONFIG),
      color: isActive ? '#fff' : inactiveColor,
      transform: [
        { translateY: withSpring(isActive ? -16 : -12, SPRING_CONFIG) }
      ]
    };
  });

  return (
    <Animated.Text style={[styles.tabLabel, animatedStyle]}>
      {label}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  barWrapper: {
    position: 'relative',
  },
  canvas: {
    flex: 1,
  },
  tabsLayer: {
    flexDirection: 'row',
    width: BAR_WIDTH,
    position: 'absolute',
    top: 40,
    left: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 0.3,
  }
});
