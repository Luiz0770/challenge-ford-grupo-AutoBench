import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon: Icon,
  iconColor = colors.text.secondary,
  action,
  onAction,
}) => (
  <View className="flex-row items-center justify-between px-1">
    <View className="flex-row items-center gap-1">
      {Icon && <Icon size={11} color={iconColor} strokeWidth={2.4} />}
      <Text className="font-mono-semibold text-[10px] uppercase tracking-[1.6px] text-ink-700">
        {title}
      </Text>
    </View>
    {action && (
      <Pressable onPress={onAction} hitSlop={8} className="flex-row items-center gap-0.5">
        <Text className="font-sans-medium text-xs text-brand-mid">{action}</Text>
        <ChevronRight size={13} color={colors.brand.mid} strokeWidth={2.4} />
      </Pressable>
    )}
  </View>
);
