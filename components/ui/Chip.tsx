import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({ label, active = false, onPress, leading, trailing }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      opacity: pressed ? 0.85 : 1,
      transform: pressed ? [{ scale: 0.985 }] : [{ scale: 1 }],
    })}
  >
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: active ? colors.brand.navy : colors.bg.surface,
        borderWidth: 1,
        borderColor: active ? colors.brand.navy : colors.bg.borderStrong,
      }}
    >
      {leading}
      <Text
        style={{
          fontFamily: fonts.sansMedium,
          fontSize: 13,
          color: active ? colors.bg.surface : colors.text.primary,
        }}
      >
        {label}
      </Text>
      {trailing}
    </View>
  </Pressable>
);
