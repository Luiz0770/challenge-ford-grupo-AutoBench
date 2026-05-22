import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

const baseStyle: ViewStyle = {
  backgroundColor: colors.bg.surface,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.bg.border,
  shadowColor: '#101828',
  shadowOpacity: 0.04,
  shadowRadius: 2,
  shadowOffset: { width: 0, height: 1 },
  elevation: 1,
};

export const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          baseStyle,
          { opacity: pressed ? 0.92 : 1, transform: pressed ? [{ scale: 0.99 }] : [{ scale: 1 }] },
          style as ViewStyle,
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[baseStyle, style as ViewStyle]}>{children}</View>;
};
