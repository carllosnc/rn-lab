import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { ConditionalButton } from '../components/conditional-button/ConditionalButton';
import { Header } from '../partials';

export const ConditionalButtonScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Conditional Button" light />
      <View style={styles.content}>
        <ConditionalButton
          label="Delete Project"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          question="Permanently delete?"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
