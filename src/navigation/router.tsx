import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LiquidBottomBarScreen } from '../screens/LiquidBottomBarScreen';
import { CryptoButtonScreen } from '../screens/CryptoButtonScreen';

export type RootStackParamList = {
  Home: undefined;
  LiquidBottomBar: undefined;
  CryptoButton: undefined;
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
    </Stack.Navigator>
  );
};
