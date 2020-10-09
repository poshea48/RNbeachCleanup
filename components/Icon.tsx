import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface IconType {
  name: string;
}
export default ({ name, ...props }: IconType) => (
  <Icon
    name={Platform.OS === 'ios' ? `ios-${name}` : `md-${name}`}
    {...props}
  />
);
