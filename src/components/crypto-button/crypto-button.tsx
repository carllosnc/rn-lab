import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { AnimatedNumber } from '../animated-number/animated-number';
import { Ionicons } from '@expo/vector-icons';
import {
  Canvas,
  RoundedRect,
  LinearGradient,
  vec,
  Image as SkiaImage,
  Group,
  Shadow
} from '@shopify/react-native-skia';
import Animated, { useAnimatedRef, measure, runOnUI } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useCryptoButton, CryptoConfig } from './use-crypto-button';
import { PERIODS, BITCOIN_DATA } from './crypto-data';
import { CryptoChart } from './crypto-chart';
import { styles } from './crypto-button.styles';

export const BITCOIN_CONFIG: CryptoConfig = {
  name: 'Bitcoin',
  symbol: 'USD',
  logo: require('../../../assets/bitcoin.png'),
  gradientColors: ['#9c5e00ff', '#000000'],
  shadowColor: 'rgba(205, 135, 16, 1)',
  initialPrice: 75.937,
  initialChange: { abs: 115, pct: 0.15 },
  dataPoints: BITCOIN_DATA,
  simulate: true,
};

interface CryptoButtonProps {
  config?: Partial<CryptoConfig>;
}

export const CryptoButton = ({ config: userConfig }: CryptoButtonProps) => {
  const config = { ...BITCOIN_CONFIG, ...userConfig } as CryptoConfig;
  const containerRef = useAnimatedRef<View>();

  const {
    price,
    change,
    coinLogo,
    expandProgress,
    expandProgressDerived,
    tapGesture,
    handleClose,
    animatedRootStyle,
    closeButtonStyle,
    contentStyle,
    backdropStyle,
    layoutX,
    layoutY,
    chartTranslateY,
    chartHeight,
    skWidth,
    skHeight,
    skR,
    logoX,
    logoY,
    logoOpacity,
    animatedDividerPath,
    animatedChartPath,
    highlightOpacity,
    CARD_HEIGHT,
    CARD_WIDTH,
    selectedPeriod,
    onSelectPeriod,
    skiaClipRRect,
    isTrendDown,
    chartTransform,
    dividerTransform,
  } = useCryptoButton(config);

  const onLayout = () => {
    runOnUI(() => {
      if (expandProgress.value > 0) return; // Don't update coordinates while animating
      const m = measure(containerRef);
      if (m) {
        layoutX.value = m.pageX;
        layoutY.value = m.pageY;
      }
    })();
  };

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.fullscreen} onPress={handleClose} />
      </Animated.View>

      <View
        ref={containerRef}
        onLayout={onLayout}
        style={styles.buttonContainer}
      >
        <GestureDetector gesture={tapGesture}>
          <Animated.View style={[styles.root, animatedRootStyle]}>
            <Canvas style={styles.canvas}>
              <Group clip={skiaClipRRect}>
                <RoundedRect
                  x={0}
                  y={0}
                  width={skWidth}
                  height={skHeight}
                  r={skR}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, CARD_HEIGHT)}
                    colors={config.gradientColors}
                    positions={[0, 0.7]}
                  />
                  <Shadow dx={0} dy={12} blur={10} color={config.shadowColor} inner />
                </RoundedRect>

                {/* 3D Inner Top Highlight (Inner Shadow simulation) */}
                <Group opacity={highlightOpacity}>
                   <RoundedRect
                    x={0}
                    y={0}
                    width={skWidth}
                    height={skHeight}
                    r={skR}
                    style="stroke"
                    strokeWidth={2}
                  >
                    <LinearGradient
                      start={vec(0, 0)}
                      end={vec(0, 40)}
                      colors={['rgba(255,255,255,0.15)', 'transparent']}
                    />
                  </RoundedRect>
                </Group>

                {/* Compacted Button Logo */}
                {coinLogo && (
                  <SkiaImage
                    image={coinLogo}
                    x={logoX}
                    y={logoY}
                    width={64}
                    height={64}
                    opacity={logoOpacity}
                  />
                )}
              </Group>
            </Canvas>

            <Animated.View style={[styles.content, contentStyle]}>
              {/* Section 1: Header */}
              <View style={styles.header}>
                <Image
                  source={config.logo}
                  style={styles.bitcoinIcon}
                />
                <Text style={styles.coinTitle}>{config.name}</Text>
                <View style={styles.buyButton}>
                  <Text style={styles.buyText}>BUY</Text>
                </View>
              </View>

              {/* Section 2: Labels */}
              <View style={styles.labelRow}>
                <Text style={styles.currencyLabel}>{config.symbol}</Text>
                <Text style={styles.timestamp}>As of today at 13:32 GMT-3</Text>
              </View>

              {/* Section 3: Price */}
              <View style={styles.row}>
                <AnimatedNumber
                  value={price.toLocaleString()}
                  style={styles.priceText}
                />
                <AnimatedNumber
                  value={`${change.abs >= 0 ? '+' : ''}${change.abs} (${change.pct >= 0 ? '+' : ''}${change.pct}%)`}
                  style={[
                    styles.percentageText,
                    { color: change.abs >= 0 ? '#00FFA3' : '#FF4B4B' }
                  ]}
                />
              </View>

              <View style={styles.chartSpace}>
                <Canvas style={styles.canvas}>
                  <CryptoChart
                    expandProgressDerived={expandProgressDerived}
                    chartTranslateY={chartTranslateY}
                    chartHeight={chartHeight}
                    chartTransform={chartTransform}
                    dividerTransform={dividerTransform}
                    animatedChartPath={animatedChartPath}
                    animatedDividerPath={animatedDividerPath}
                    isTrendDown={isTrendDown}
                    CARD_WIDTH={CARD_WIDTH}
                  />
                </Canvas>
              </View>

              {/* Section 5: Footer */}
              <View style={styles.footer}>
                {PERIODS.map((period) => (
                  <Pressable
                    key={period}
                    onPress={() => onSelectPeriod(period)}
                    style={[
                      styles.chip,
                      selectedPeriod === period && styles.activeChip
                    ]}
                  >
                    <Text
                      style={selectedPeriod === period ? styles.chipTextActive : styles.chipText}
                    >
                      {period}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          </Animated.View>
        </GestureDetector>

        <Animated.View style={[styles.closeButtonWrapper, closeButtonStyle]}>
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && { transform: [{ scale: 0.95 }] }
            ]}
            onPress={handleClose}
          >
            <Ionicons name="close" size={40} color="white" />
          </Pressable>
        </Animated.View>
      </View>
    </>
  );
};
