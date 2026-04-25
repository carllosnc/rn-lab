import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LiquidBottomBarScreen } from '../screens/LiquidBottomBarScreen';
import { CryptoButtonScreen } from '../screens/CryptoButtonScreen';
import { MeshGradientScreen } from '../screens/MeshGradientScreen';
import { ToastScreen } from '../screens/ToastScreen';
import { VolumeScreen } from '../screens/VolumeScreen';
import { ConditionalButtonScreen } from '../screens/ConditionalButtonScreen';
import { MorphingFabScreen } from '../screens/MorphingFabScreen';
import { LockScreenScreen } from '../screens/LockScreenScreen';

export type RootStackParamList = {
  Home: undefined;
  LiquidBottomBar: undefined;
  CryptoButton: undefined;
  MeshGradient: undefined;
  Toast: undefined;
  Volume: undefined;
  ConditionalButton: undefined;
  MorphingFab: undefined;
  LockScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Router = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="LiquidBottomBar"
        component={LiquidBottomBarScreen}
      />
      <Stack.Screen
        name="CryptoButton"
        component={CryptoButtonScreen}
      />
      <Stack.Screen
        name="MeshGradient"
        component={MeshGradientScreen}
      />
      <Stack.Screen
        name="Toast"
        component={ToastScreen}
      />
      <Stack.Screen
        name="Volume"
        component={VolumeScreen}
      />
      <Stack.Screen
        name="ConditionalButton"
        component={ConditionalButtonScreen}
      />
      <Stack.Screen
        name="MorphingFab"
        component={MorphingFabScreen}
      />
      <Stack.Screen
        name="LockScreen"
        component={LockScreenScreen}
      />
    </Stack.Navigator>
  );
};
