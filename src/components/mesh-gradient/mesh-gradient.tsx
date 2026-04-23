import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  Canvas,
  Vertices,
  vec,
  Blur,
  Group,
  Rect,
  Turbulence,
  SkPoint,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface MeshGradientProps {
  colors?: string[];
  blur?: number;
}

const DEFAULT_COLORS = [
  '#FF0080', '#7928CA', '#0070F3',
  '#00DFD8', '#FF4D4D', '#F9CB28',
  '#FF0080', '#0070F3', '#7928CA'
];

export const MeshGradient: React.FC<MeshGradientProps> = ({
  colors = DEFAULT_COLORS,
  blur = 40
}) => {
  const { width, height } = useWindowDimensions();

  const clock = useSharedValue(0);

  React.useEffect(() => {
    clock.value = withRepeat(
      withTiming(Math.PI * 2, {
        duration: 3000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [clock]);

  const vertices = useDerivedValue<SkPoint[]>(() => {
    const t = clock.value;
    const grid = 4;
    const pts: SkPoint[] = [];

    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const bx = (x / (grid - 1)) * width;
        const by = (y / (grid - 1)) * height;

        // Extreme multi-layered harmonics for very long-range but fast motion
        const offset = (x * 1.8 + y * 2.2);
        const dx = (
          Math.sin(t + offset) * 0.8 +
          Math.sin(t * 0.5 + offset * 2) * 0.5 +
          Math.cos(t * 0.3 + offset * 3) * 0.3
        ) * (width * 0.7);

        const dy = (
          Math.cos(t * 0.8 + offset) * 0.8 +
          Math.sin(t * 0.6 + offset * 1.5) * 0.5 +
          Math.cos(t * 0.4 + offset * 2.5) * 0.3
        ) * (height * 0.7);

        // Further increased boundary movement for massive flow
        const edgeFactorX = x === 0 || x === grid - 1 ? 0.6 : 1;
        const edgeFactorY = y === 0 || y === grid - 1 ? 0.6 : 1;

        pts.push(vec(bx + dx * edgeFactorX, by + dy * edgeFactorY));
      }
    }
    return pts;
  });

  const indices = useMemo(() => {
    const grid = 4;
    const ind: number[] = [];
    for (let y = 0; y < grid - 1; y++) {
      for (let x = 0; x < grid - 1; x++) {
        const i = y * grid + x;
        ind.push(i, i + 1, i + grid);
        ind.push(i + 1, i + grid + 1, i + grid);
      }
    }
    return ind;
  }, []);

  const skColors = useMemo<string[]>(() => {
    // Generate 16 colors (4x4) from the base palette
    const baseColors = colors || DEFAULT_COLORS;
    const extendedColors = [];
    for (let i = 0; i < 16; i++) {
      extendedColors.push(baseColors[i % baseColors.length]);
    }
    return extendedColors;
  }, [colors]);

  return (
    <Canvas style={styles.canvas}>
      <Group>
        <Blur blur={blur} />
        <Vertices
          vertices={vertices}
          colors={skColors}
          indices={indices}
        />
      </Group>

      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        blendMode="overlay"
        opacity={0.15}
      >
        <Turbulence freqX={0.8} freqY={0.8} octaves={4} seed={1} />
      </Rect>
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4e0064ff',
  },
});
