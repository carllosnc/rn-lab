import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
  title?: string;
  light?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, light = false }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.backButton, light && styles.backButtonLight]}
        >
          <Ionicons name="chevron-back" size={28} color={light ? '#000' : '#FFF'} />
        </TouchableOpacity>
        {title && <Text style={[styles.title, light && styles.titleLight]}>{title}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonLight: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'Inter_600Bold',
  },
  titleLight: {
    color: '#000',
  },
});
