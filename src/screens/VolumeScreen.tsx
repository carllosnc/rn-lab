import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { VolumeControl } from '../components/volume/VolumeControl';
import { Header } from '../partials/Header';
import { StatusBar } from 'expo-status-bar';

export const VolumeScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Interactive Volume" light={true} />

      <View style={styles.content}>
        <VolumeControl initialValue={75} />
      </View>

      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
