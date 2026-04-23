import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MeshGradient } from '../components/mesh-gradient';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../partials';

export const MeshGradientScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <MeshGradient />

      <SafeAreaView style={styles.overlay}>
        <Header title="Mesh Gradient" />

        <View style={styles.content}>
          <Text style={styles.title}>Liquid Dreams</Text>
          <Text style={styles.poem}>
            Colors dance in light,{"\n"}
            A fluid, neon sea,{"\n"}
            Merging in the night,{"\n"}
            Wild and truly free.{"\n"}
            {"\n"}
            Grid of moving stars,{"\n"}
            Vertices in flight,{"\n"}
            Healing all the scars,{"\n"}
            With an endless light.
          </Text>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'Inter_700Bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  poem: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 34,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
