import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { MorphingFab } from '../components/morphing-fab/MorphingFab';
import { Header } from '../partials';
import { FONTS } from '../constants/settings';

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const ACTIONS = [
  { icon: 'camera', label: 'Camera' },
  { icon: 'image', label: 'Gallery' },
  { icon: 'mic', label: 'Voice' },
  { icon: 'document-text', label: 'Note' },
  { icon: 'location', label: 'Location' },
  { icon: 'calendar', label: 'Events' },
  { icon: 'cloud-upload', label: 'Upload' },
  { icon: 'settings', label: 'Settings' },
  { icon: 'notifications', label: 'Alerts' },
];

export const MorphingFabScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Morphing FAB" light />
      <MorphingFab expandedColor="#000000ff" isDark={true} icon="apps">
        {({ toggle }) => (
          <View style={styles.menuContent}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Create New</Text>
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
                  <View style={styles.iconContainer}>
                    <Ionicons name={action.icon as any} size={28} color="white" />
                  </View>
                  <Text style={styles.itemLabel}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.footer}>
              <Pressable onPress={toggle} style={styles.bottomCloseButton}>
                <Ionicons name="close" size={32} color="white" />
              </Pressable>
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
    justifyContent: 'center',
  },
  menuHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  menuTitle: {
    fontSize: 22,
    fontFamily: FONTS.inter.regular,
    color: 'white',
    textAlign: 'center',
  },
  footer: {
    marginTop: 60,
    width: '100%',
    alignItems: 'center',
  },
  bottomCloseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 12,
    fontFamily: FONTS.inter.medium,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
