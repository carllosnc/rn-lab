import React from 'react';
import { StyleSheet, View, TextStyle, StyleProp } from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';

interface Props {
  value: string | number;
  style?: StyleProp<TextStyle>;
}

export const AnimatedNumber: React.FC<Props> = ({ value, style }) => {
  const chars = value.toString().split('');

  return (
    <View style={[styles.container, { flexDirection: 'row' }]}>
      {chars.map((char, index) => (
        <View key={index} style={{ overflow: 'hidden'}}>
          <Animated.Text
            key={`${char}-${index}`}
            entering={FadeInUp.duration(400).springify()}
            exiting={FadeOutDown.duration(400).springify()}
            style={[style, { margin: 0, padding: 0 }]}
          >
            {char}
          </Animated.Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    gap: -10,
    justifyContent: 'flex-end',
  },
});
