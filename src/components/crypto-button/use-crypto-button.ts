import { useMemo, useState, useLayoutEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Skia,
  useImage,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useDerivedValue,
  withTiming,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { PERIODS, Period, DATA_POINTS } from './crypto-data';

export const BUTTON_SIZE = 80;

export interface CryptoConfig {
  name: string;
  symbol: string;
  logo: any;
  dataPoints?: Record<Period, { x: number; y: number }[]>;
  gradientColors: [string, string];
  shadowColor: string;
  initialPrice: number;
  initialChange: { abs: number; pct: number };
  simulate?: boolean;
}

export const useCryptoButton = (config: CryptoConfig) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const coinLogo = useImage(config.logo);
  const expandProgress = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const chartProgress = useSharedValue(1);

  // Position for centering
  const layoutX = useSharedValue(0);
  const layoutY = useSharedValue(0);
  const chartTranslateY = useSharedValue(0);
  const chartHeight = useSharedValue(100);
  const targetCardHeight = useSharedValue(400); // Dynamic target

  const [price, setPrice] = useState(config.initialPrice);
  const [change, setChange] = useState(config.initialChange);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1 day');

  const dataPoints = config.dataPoints || DATA_POINTS;

  const onSelectPeriod = (period: Period) => {
    setSelectedPeriod(period);
    chartProgress.value = 0;
    chartProgress.value = withTiming(1, { duration: 600 });
  };

  useLayoutEffect(() => {
    if (!config.simulate) return;

    const timer = setInterval(() => {
      // Use a scale that works for both $70k Bitcoin and $0.30 Cardano
      const multiplier = config.initialPrice < 1 ? 0.02 : 0.001;
      const delta = (Math.random() - 0.5) * (config.initialPrice * multiplier);
      
      setPrice(prev => {
        const next = prev + delta;
        // Show more decimals for low-value coins
        return config.initialPrice < 1 ? +next.toFixed(4) : +next.toFixed(3);
      });

      setChange(prev => ({
        abs: +(prev.abs + (delta * (config.initialPrice < 1 ? 100 : 1000))).toFixed(config.initialPrice < 1 ? 2 : 0),
        pct: +(prev.pct + (delta * (config.initialPrice < 1 ? 5 : 2.5))).toFixed(2)
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, [config.initialPrice, config.simulate]);

  const CARD_WIDTH = windowWidth * 0.94;
  const CARD_HEIGHT = 390; // Compact height for cleaner look
  const CARD_RADIUS = 40;

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      if (expandProgress.value === 0) {
        pressScale.value = withTiming(0.95, { duration: 100 });
      }
    })
    .onFinalize(() => {
      if (expandProgress.value === 0) {
        pressScale.value = withTiming(1, { duration: 100 });
      }
    })
    .onEnd(() => {
      if (expandProgress.value === 0) {
        expandProgress.value = withSpring(1, {
          mass: 1,
          damping: 15,
          stiffness: 100,
        });
      }
    });

  const animatedRootStyle = useAnimatedStyle(() => {
    const isExpanded = expandProgress.value > 0;
    
    // Calculate target translation to reach screen center (windowWidth/2, windowHeight/2)
    // from our current button center (layoutX + BUTTON_SIZE/2, layoutY + BUTTON_SIZE/2)
    const targetX = (windowWidth / 2) - (layoutX.value + BUTTON_SIZE / 2);
    const targetY = (windowHeight / 2) - (layoutY.value + BUTTON_SIZE / 2);

    return {
      width: interpolate(expandProgress.value, [0, 1], [BUTTON_SIZE, CARD_WIDTH]),
      height: interpolate(expandProgress.value, [0, 1], [BUTTON_SIZE, CARD_HEIGHT]),
      borderRadius: interpolate(expandProgress.value, [0, 1], [BUTTON_SIZE / 2, CARD_RADIUS]),
      transform: [
        { scale: pressScale.value },
        { translateX: interpolate(expandProgress.value, [0, 1], [0, targetX]) },
        { translateY: interpolate(expandProgress.value, [0, 1], [0, targetY]) },
      ],
      position: expandProgress.value > 0.01 ? 'absolute' : 'relative',
      zIndex: expandProgress.value > 0.01 ? 999 : 1,
    };
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expandProgress.value, [0, 1], [0, 1]),
    pointerEvents: expandProgress.value > 0.1 ? 'auto' : 'none',
  }));

  const closeButtonStyle = useAnimatedStyle(() => {
    const targetX = (windowWidth / 2) - (layoutX.value + BUTTON_SIZE / 2);
    const targetY = (windowHeight / 2) - (layoutY.value + BUTTON_SIZE / 2);

    return {
      opacity: interpolate(expandProgress.value, [0.9, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        { translateX: interpolate(expandProgress.value, [0, 1], [0, targetX]) },
        { translateY: interpolate(expandProgress.value, [0, 1], [0, targetY + CARD_HEIGHT / 2 + 60]) }, // Move below the card center
        { scale: interpolate(expandProgress.value, [0.8, 1], [0.5, 1], Extrapolation.CLAMP) },
      ],
      pointerEvents: expandProgress.value > 0.9 ? 'auto' : 'none',
      position: 'absolute',
      zIndex: 1000,
    };
  });

  const handleClose = () => {
    expandProgress.value = withSpring(0, {
      mass: 1,
      damping: 15,
      stiffness: 100,
    });
  };

  const skWidth = useDerivedValue(() =>
    interpolate(expandProgress.value, [0, 1], [BUTTON_SIZE, CARD_WIDTH])
  );
  const skHeight = useDerivedValue(() =>
    interpolate(expandProgress.value, [0, 1], [BUTTON_SIZE, CARD_HEIGHT])
  );
  const skR = useDerivedValue(() =>
    interpolate(expandProgress.value, [0, 1], [BUTTON_SIZE / 2, CARD_RADIUS])
  );

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expandProgress.value, [0.8, 1], [0, 1], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(expandProgress.value, [0, 1], [0.8, 1]) },
    ]
  }));

  const pathEnd = useDerivedValue(() =>
    interpolate(expandProgress.value, [0.4, 1], [0, 1], Extrapolation.CLAMP)
  );

  const logoX = useDerivedValue(() => skWidth.value / 2 - 32);
  const logoY = useDerivedValue(() => skHeight.value / 2 - 32);
  const logoOpacity = useDerivedValue(() =>
    interpolate(expandProgress.value, [0, 0.1], [1, 0], Extrapolation.CLAMP)
  );

  const dividerPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.moveTo(24, 0); // We'll translate the whole group
    path.lineTo(CARD_WIDTH - 24, 0);
    return path;
  }, [CARD_WIDTH]);

  const chartPath = useMemo(() => {
    const points = dataPoints[selectedPeriod];
    const path = Skia.Path.Make();
    path.moveTo(points[0].x, points[0].y);
    points.forEach(p => path.lineTo(p.x, p.y));
    return path;
  }, [selectedPeriod, dataPoints]);

  const animatedDividerPath = useDerivedValue(() => {
    const path = dividerPath.copy();
    path.trim(0, pathEnd.value, false);
    return path;
  });

  const animatedChartPath = useDerivedValue(() => {
    const path = chartPath.copy();
    path.trim(0, pathEnd.value * chartProgress.value, false);
    return path;
  });

  const yOffset = useDerivedValue(() => {
    const points = dataPoints[selectedPeriod];
    const sum = points.reduce((acc, p) => acc + p.y, 0);
    return sum / points.length;
  });

  const highlightOpacity = useDerivedValue(() =>
    interpolate(expandProgress.value, [0, 0.5], [0, 1])
  );

  const skiaClipRRect = useDerivedValue(() => ({
    rect: { x: 0, y: 0, width: skWidth.value, height: skHeight.value },
    rx: skR.value,
    ry: skR.value,
  }));

  const chartTransform = useDerivedValue(() => [
    { scaleX: CARD_WIDTH / 400 },
    { scaleY: 0.45 * interpolate(chartProgress.value, [0, 1], [0.8, 1]) },
    // After scaleY: 0.45, the middle point should be 50 (half of 100px height)
    // So 50 = (yOffset * 0.45) + ty => ty = 50 - (yOffset * 0.45)
    { translateY: 50 - (yOffset.value * 0.45) },
  ]);

  const dividerTransform = useDerivedValue(() => [
    // Fixed height is 100, so bottom is 100
    { translateY: 100 },
    { scale: expandProgress.value }
  ]);

  const expandProgressDerived = useDerivedValue(() => expandProgress.value);

  const isTrendDown = useMemo(() => {
    const points = dataPoints[selectedPeriod];
    return points[points.length - 1].y > points[0].y;
  }, [selectedPeriod, dataPoints]);

  return {
    // State & Values
    price,
    change,
    coinLogo,
    expandProgress,
    expandProgressDerived,
    selectedPeriod,
    onSelectPeriod,

    // Gests & Actions
    tapGesture,
    handleClose,

    // Animated Styles
    animatedRootStyle,
    closeButtonStyle,
    contentStyle,
    backdropStyle,

    // Layout
    layoutX,
    layoutY,
    chartTranslateY,
    chartHeight,
    chartTransform,
    dividerTransform,

    // Skia Values
    skWidth,
    skHeight,
    skR,
    logoX,
    logoY,
    logoOpacity,
    animatedDividerPath,
    animatedChartPath,
    highlightOpacity,
    skiaClipRRect,
    isTrendDown,

    // Constants (for Skia rendering)
    CARD_HEIGHT,
    CARD_WIDTH,
  };
};
