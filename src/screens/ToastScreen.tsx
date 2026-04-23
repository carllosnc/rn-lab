import React from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView } from 'react-native';
import { useToast } from '../components/toast/toast';
import { Header } from '../partials';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ToastButton = ({ 
  title, 
  message, 
  type, 
  label, 
  onPress 
}: { 
  title: string; 
  message: string; 
  type: 'success' | 'error' | 'message'; 
  label: string;
  onPress: (options: any) => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress({ title, message, type })}
      style={[styles.button, animatedStyle]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </AnimatedPressable>
  );
};

export const ToastScreen = () => {
  const { showToast } = useToast();

  return (
    <View style={styles.container}>
      <Header title="Toast Gallery" light />

      <SafeAreaView style={styles.content}>
        <View style={styles.buttonContainer}>
          <ToastButton
            label="Success Toast"
            title="Payment Successful"
            message="Your transaction of $45.00 has been processed. A receipt was sent to your email."
            type="success"
            onPress={showToast}
          />

          <ToastButton
            label="Error Toast"
            title="Connection Error"
            message="Unable to sync your changes. Please check your internet connection and try again."
            type="error"
            onPress={showToast}
          />

          <ToastButton
            label="Info Toast"
            title="Update Available"
            message="A new version of the app is ready. Install now to get the latest performance fixes."
            type="message"
            onPress={showToast}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    height: 56,
    width: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dadada',
  },
  buttonText: {
    color: '#3b3b3bff',
    fontSize: 15,
  },
});
