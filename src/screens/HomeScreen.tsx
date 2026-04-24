import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const EXAMPLES = [
  { id: 'LiquidBottomBar', title: 'Liquid Bottom Bar', icon: 'water' },
  { id: 'CryptoButton', title: 'Crypto Buttons', icon: 'logo-bitcoin' },
  { id: 'MeshGradient', title: 'Mesh Gradient', icon: 'color-palette' },
  { id: 'Toast', title: 'Toast Notifications', icon: 'notifications' },
  { id: 'Volume', title: 'Volume Control', icon: 'volume-high' },
  { id: 'Glassmorphism', title: 'Glassmorphism Tab Bar (Soon)', icon: 'layers', disabled: true },
];

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.title}>RN Lab</Text>
      </SafeAreaView>

      <FlatList
        data={EXAMPLES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, item.disabled && styles.disabled]}
            onPress={() => !item.disabled && navigation.navigate(item.id as any)}
            activeOpacity={0.7}
          >
            <View style={styles.itemContent}>
              <Ionicons name={item.icon as any} size={22} color="#475569" style={styles.icon} />
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 20,
    color: '#0F172A',
    fontFamily: 'Inter_700Bold',
  },
  listContent: {
    paddingVertical: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#334155',
    fontFamily: 'Inter_500Medium',
  },
  disabled: {
    opacity: 0.5,
  },
});
