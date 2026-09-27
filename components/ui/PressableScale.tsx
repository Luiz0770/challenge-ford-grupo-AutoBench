import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

interface PressableScaleProps {
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

// Feedback de toque do design (.ab-tap:active → scale 0.985)
export const PressableScale: React.FC<PressableScaleProps> = ({
  onPress,
  className,
  style,
  accessibilityLabel,
  children,
}) => (
  <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
    {({ pressed }) => (
      <View className={className} style={[style, { transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
        {children}
      </View>
    )}
  </Pressable>
);
