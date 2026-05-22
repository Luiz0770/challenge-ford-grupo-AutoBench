import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      width: '48%',
      borderRadius: 14,
      padding: 14,
      backgroundColor: category.color,
      height: 96,
      overflow: 'hidden',
      transform: pressed ? [{ scale: 0.985 }] : [{ scale: 1 }],
      opacity: pressed ? 0.95 : 1,
    })}
  >
    <Text
      style={{
        position: 'absolute',
        bottom: -10,
        right: -2,
        fontFamily: fonts.monoBold,
        fontSize: 56,
        color: category.accent,
        opacity: 0.22,
        letterSpacing: -3,
        lineHeight: 56,
      }}
    >
      {category.code}
    </Text>

    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
      <Feather name="arrow-up-right" size={14} color="rgba(255,255,255,0.55)" />
    </View>

    <View style={{ position: 'absolute', left: 14, bottom: 12 }}>
      <Text
        style={{
          fontFamily: fonts.sansBold,
          fontSize: 16,
          color: colors.bg.surface,
          letterSpacing: -0.4,
          lineHeight: 18,
        }}
      >
        {category.label}
      </Text>
      <Text
        style={{
          fontFamily: fonts.monoMedium,
          fontSize: 10,
          color: 'rgba(255,255,255,0.65)',
          letterSpacing: 0.4,
          marginTop: 4,
        }}
      >
        {category.count} modelos
      </Text>
    </View>
  </Pressable>
);
