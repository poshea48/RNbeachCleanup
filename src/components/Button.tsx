import React from 'react';
import { Pressable, Text } from 'react-native';
import colors from '../../colors';

/**
 * @param pressCb
 * @param styles: {container: {}, text: {}}
 * @param message: string
 */

interface ButtonType {
  pressCb: () => void;
  message: string;
  styles: {
    container: {
      [key: string]: string | number;
    };
    text: {
      [key: string]: string | number;
    };
  };
}
const Button: React.FC<ButtonType> = ({ pressCb, message, styles }) => {
  return (
    <Pressable
      onPress={pressCb}
      style={({ pressed }) => [
        {
          transform: [
            { translateX: pressed ? 0 : 0 },
            { translateY: pressed ? 5 : 0 },
          ],
          shadowColor: pressed ? 'transparent' : colors.black,
          shadowOffset: pressed
            ? { width: 0, height: 0 }
            : { width: 0, height: 5 },
          shadowOpacity: 1.0,
        },
        {
          width: '40%',
          height: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.finished,
          borderRadius: 10,
        },
        styles.container,
      ]}>
      <Text style={styles.text}>{message}</Text>
    </Pressable>
  );
};

export default Button;
