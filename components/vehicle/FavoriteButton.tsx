import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable } from 'react-native';
import { colors } from '../../constants/colors';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  size = 26,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(
      isFavorite ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    );
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={12}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavorite ? colors.status.danger : colors.text.secondary}
      />
    </Pressable>
  );
};
