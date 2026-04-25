import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LockScreen } from '../components/lock-screen/LockScreen';
import { FONTS } from '../constants/settings';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LockScreenScreen = () => {
  const navigation = useNavigation();
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <View style={styles.container}>
      <LockScreen correctPassword="1234" onUnlocked={() => setIsUnlocked(true)}>
        <View style={styles.revealedContent}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' }}
            style={styles.backgroundImage}
          />
          <View style={styles.contentOverlay}>
            <Pressable 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>You have successfully unlocked the vault.</Text>
            
            <View style={styles.card}>
              <View style={styles.row}>
                <View style={styles.circle} />
                <View style={styles.skeletonLine} />
              </View>
              <View style={[styles.skeletonLine, { width: '80%', marginTop: 20 }]} />
              <View style={[styles.skeletonLine, { width: '60%', marginTop: 12 }]} />
            </View>
          </View>
        </View>
      </LockScreen>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  revealedContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  contentOverlay: {
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.spaceGrotesk.bold,
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    width: SCREEN_WIDTH - 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 16,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    flex: 1,
  },
});
