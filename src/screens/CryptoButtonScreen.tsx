import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CryptoButton, BITCOIN_CONFIG } from '../components/crypto-button/crypto-button';
import { CARDANO_DATA, AVALANCHE_DATA } from '../components/crypto-button/crypto-data';

const CARDANO_CONFIG = {
  name: 'Cardano',
  symbol: 'USD',
  logo: require('../../assets/cardano.png'),
  gradientColors: ['#2660e8ff', '#000000'] as [string, string],
  shadowColor: 'rgba(92, 173, 255, 0.6)',
  initialPrice: 0.384,
  initialChange: { abs: 0.012, pct: 3.2 },
  dataPoints: CARDANO_DATA,
  simulate: true,
};

const AVALANCHE_CONFIG = {
  name: 'Avalanche',
  symbol: 'USD',
  logo: require('../../assets/avalanche.png'),
  gradientColors: ['#e51d1dff', '#000000'] as [string, string],
  shadowColor: 'rgba(255, 84, 84, 0.6)',
  initialPrice: 34.21,
  initialChange: { abs: -0.85, pct: -2.4 },
  dataPoints: AVALANCHE_DATA,
  simulate: true,
};

export const CryptoButtonScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.buttonList}>
            <View style={styles.row}>
              <View style={styles.item}>
                <CryptoButton config={BITCOIN_CONFIG} />
                <Text style={styles.label}>Bitcoin</Text>
              </View>
              <View style={styles.item}>
                <CryptoButton config={CARDANO_CONFIG} />
                <Text style={styles.label}>Cardano</Text>
              </View>
              <View style={styles.item}>
                <CryptoButton config={AVALANCHE_CONFIG} />
                <Text style={styles.label}>Avalanche</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <StatusBar style="dark" />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    color: '#0F172A',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  buttonList: {
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  item: {
    alignItems: 'center',
    width: '28%',
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
    fontFamily: 'SpaceGrotesk_500Medium',
  },
});
