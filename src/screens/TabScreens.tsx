import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Home Screen</Text>
  </View>
);

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
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
