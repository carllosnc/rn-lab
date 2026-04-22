import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

import { LiquidBottomBar } from './src/components/liquid-bottom-bar/LiquidBottomBar';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const activeIndex = useSharedValue(0);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        SpaceGrotesk_700Bold,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const tabs = [
    { id: 'home', label: 'Home', activeColor: '#6366F1', iconName: 'home-outline' as any },
    { id: 'search', label: 'Search', activeColor: '#3B82F6', iconName: 'search-outline' as any },
    { id: 'shop', label: 'Shop', activeColor: '#8B5CF6', iconName: 'basket-outline' as any },
    { id: 'cart', label: 'Cart', activeColor: '#10B981', iconName: 'cart-outline' as any },
    { id: 'profile', label: 'Profile', activeColor: '#F59E0B', iconName: 'person-outline' as any },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{tabs[currentTab].label}</Text>
          <Text style={styles.subtitle}>Premium Liquid Navigation</Text>
        </View>

        <LiquidBottomBar
          tabs={tabs}
          activeIndex={activeIndex}
          onTabChange={setCurrentTab}
        />

        <StatusBar style="light" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
});
