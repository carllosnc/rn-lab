import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const HomeScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate('LiquidBottomBar')}
      >
        <Text style={styles.buttonText}>Liquid Bottom Bar Example</Text>
      </TouchableOpacity>
    </View>
  );
};

export const SearchScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Search Screen</Text>
  </View>
);

export const ShopScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Shop Screen</Text>
  </View>
);

export const CartScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Cart Screen</Text>
  </View>
);

export const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Profile Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
