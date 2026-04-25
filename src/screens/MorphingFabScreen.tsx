import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { MorphingFab } from '../components/morphing-fab/MorphingFab';
import { Header } from '../partials';
import { FONTS } from '../constants/settings';

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const ACTIONS = [
  { icon: 'camera', label: 'Camera', color: '#6366F1' },
  { icon: 'image', label: 'Gallery', color: '#8B5CF6' },
  { icon: 'mic', label: 'Voice', color: '#EC4899' },
  { icon: 'document-text', label: 'Note', color: '#F43F5E' },
];

export const MorphingFabScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Morphing FAB" light />
      <MorphingFab expandedColor="black">
        {({ toggle }) => (
          <View style={styles.menuContent}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Create New</Text>
              <Pressable onPress={toggle} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="white" />
              </Pressable>
            </View>
            <View style={styles.itemsGrid}>
              {ACTIONS.map((action, index) => (
                <Pressable
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggle();
                  }}
                >
                  <View style={[styles.iconContainer, { backgroundColor: action.color + '15' }]}>
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Text style={styles.itemLabel}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </MorphingFab>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  menuContent: {
    flex: 1,
    padding: 32,
    paddingTop: 80,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  menuTitle: {
    fontSize: 28,
    fontFamily: FONTS.inter.bold,
    color: 'white',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '45%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: 'rgba(255,255,255,0.7)',
  },
});
