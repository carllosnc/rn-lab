import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { CryptoButton } from './src/components/crypto-button/crypto-button';
import { CARDANO_DATA, AVALANCHE_DATA } from './src/components/crypto-button/crypto-data';

import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <CryptoButton />
          <CryptoButton
            config={{
              name: 'Cardano',
              symbol: 'USD',
              logo: require('./assets/cardano.png'),
              gradientColors: ['#1060ffff', '#000000'],
              shadowColor: 'rgba(93, 141, 255, 1)',
              initialPrice: 0.354,
              initialChange: { abs: 12, pct: 1.2 },
              dataPoints: CARDANO_DATA,
              simulate: true,
            }}
          />
          <CryptoButton
            config={{
              name: 'Avalanche',
              symbol: 'USD',
              logo: require('./assets/avalanche.png'),
              gradientColors: ['#E84142ff', '#000000'],
              shadowColor: 'rgba(232, 65, 66, 1)',
              initialPrice: 38.42,
              initialChange: { abs: -2.1, pct: -5.2 },
              dataPoints: AVALANCHE_DATA,
              simulate: true,
            }}
          />
        </View>
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    gap: 20,
    alignItems: 'center',
  },
});
