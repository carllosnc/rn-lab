import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { useAnimatedStyle, useSharedValue, interpolateColor } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/router';

import { LiquidBottomBar } from '../components/liquid-bottom-bar/LiquidBottomBar';

export const LiquidBottomBarScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const activeIndex = useSharedValue(0);
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    { id: 'home', label: 'Home', activeColor: '#6366F1', iconName: 'home-outline' as any },
    { id: 'search', label: 'Search', activeColor: '#3B82F6', iconName: 'search-outline' as any },
    { id: 'shop', label: 'Shop', activeColor: '#8B5CF6', iconName: 'basket-outline' as any },
    { id: 'cart', label: 'Cart', activeColor: '#10B981', iconName: 'cart-outline' as any },
    { id: 'profile', label: 'Profile', activeColor: '#c03434ff', iconName: 'person-outline' as any },
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      activeIndex.value,
      tabs.map((_, i) => i),
      tabs.map(tab => tab.activeColor)
    );

    return {
      backgroundColor,
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{tabs[currentTab].label}</Text>
        </View>

        <LiquidBottomBar
          tabs={tabs}
          activeIndex={activeIndex}
          onTabChange={setCurrentTab}
        />

        <StatusBar style="light" />
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: 'normal',
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk_300Bold',
  },
});
