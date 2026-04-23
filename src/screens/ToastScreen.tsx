import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useToast } from '../components/toast/toast';
import { Header } from '../partials';

export const ToastScreen = () => {
  const { showToast } = useToast();

  return (
    <View style={styles.container}>
      <Header title="Toast Gallery" light />
      
      <SafeAreaView style={styles.content}>
        <Text style={styles.description}>
          A custom animated toast system with success, error, and info states.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.successButton]}
            onPress={() => showToast({
              title: 'Payment Successful',
              message: 'Your transaction of $45.00 has been processed. A receipt was sent to your email.',
              type: 'success'
            })}
          >
            <Text style={styles.buttonText}>Show Success Toast</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.errorButton]}
            onPress={() => showToast({
              title: 'Connection Error',
              message: 'Unable to sync your changes. Please check your internet connection and try again.',
              type: 'error'
            })}
          >
            <Text style={styles.buttonText}>Show Error Toast</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.messageButton]}
            onPress={() => showToast({
              title: 'Update Available',
              message: 'A new version of the app is ready. Install now to get the latest performance fixes.',
              type: 'message'
            })}
          >
            <Text style={styles.buttonText}>Show Info Toast</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Inter_400Regular',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  successButton: {
    backgroundColor: '#10B981',
  },
  errorButton: {
    backgroundColor: '#EF4444',
  },
  messageButton: {
    backgroundColor: '#3B82F6',
  },
});
