import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import type { NameSort } from '../../utils/sort';
import { Rise } from '../ui/Rise';

export const SORT_OPTIONS: { id: NameSort; label: string }[] = [
  { id: 'default', label: 'Padrão' },
  { id: 'name-asc', label: 'A–Z' },
  { id: 'name-desc', label: 'Z–A' },
];

interface SortChipsProps {
  value: NameSort;
  onChange: (value: NameSort) => void;
  options?: { id: NameSort; label: string }[];
}

export const SortChips: React.FC<SortChipsProps> = ({ value, onChange, options = SORT_OPTIONS }) => (
  <Rise delay={60} style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 }}>
    {options.map((opt) => {
      const active = value === opt.id;
      return (
        <Pressable
          key={opt.id}
          onPress={() => onChange(opt.id)}
          accessibilityRole="button"
          accessibilityState={{ selected: active }}
        >
          <View
            style={{
              paddingVertical: 7,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor: active ? colors.brand.navy : colors.bg.surface,
              borderWidth: 1,
              borderColor: active ? colors.brand.navy : colors.bg.borderStrong,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.sansMedium,
                fontSize: 12,
                color: active ? colors.bg.surface : colors.text.primary,
              }}
            >
              {opt.label}
            </Text>
          </View>
        </Pressable>
      );
    })}
  </Rise>
);
