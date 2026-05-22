import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  const containerStyle: ViewStyle = {
    backgroundColor: colors.bg.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.bg.border,
  };

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        <View style={[containerStyle, style]}>{children}</View>
      </Pressable>
    );
  }
  return <View style={[containerStyle, style]}>{children}</View>;
};
