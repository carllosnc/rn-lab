import React from 'react';
import { Group, Path, rect, SkPath, Circle } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

interface CryptoChartProps {
  expandProgressDerived: SharedValue<number>;
  chartTranslateY: SharedValue<number>;
  chartHeight: SharedValue<number>;
  chartTransform: SharedValue<any>;
  dividerTransform: SharedValue<any>;
  animatedChartPath: SharedValue<SkPath>;
  animatedDividerPath: SharedValue<SkPath>;
  isTrendDown: boolean;
  CARD_WIDTH: number;
}

export const CryptoChart = ({
  expandProgressDerived,
  chartTransform,
  animatedChartPath,
  isTrendDown,
}: CryptoChartProps) => {
  return (
    <Group
      opacity={expandProgressDerived}
      transform={chartTransform}
    >
      <Path
        path={animatedChartPath}
        color={isTrendDown ? '#FF4B4B' : '#00FFA3'}
        style="stroke"
        strokeWidth={2}
        strokeJoin="round"
        strokeCap="round"
      />
    </Group>
  );
};
