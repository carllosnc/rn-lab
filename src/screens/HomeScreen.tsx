import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const EXAMPLES = [
  { id: 'LiquidBottomBar', title: 'Liquid Bottom Bar', icon: 'water' },
  { id: 'CryptoButton', title: 'Crypto Buttons', icon: 'logo-bitcoin' },
  { id: 'Glassmorphism', title: 'Glassmorphism Tab Bar (Soon)', icon: 'layers', disabled: true },
];

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RN Lab</Text>
      </View>

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
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
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
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});
