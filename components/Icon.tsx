import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface IconType {
  name: string;
  size: number;
  color: string;
}

const IconComponent: React.FC<IconType> = ({ name, ...props }) => (
  <Icon
    name={Platform.OS === 'ios' ? `ios-${name}` : `md-${name}`}
    {...props}
  />
);

export default IconComponent;
