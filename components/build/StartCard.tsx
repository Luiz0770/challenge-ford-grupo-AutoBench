import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { GradientFill } from '../ui/GradientFill';
import { PressableScale } from '../ui/PressableScale';
import { Rise } from '../ui/Rise';

interface StartCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  gradient: [string, string];
  delay?: number;
  onPress: () => void;
}

export const StartCard: React.FC<StartCardProps> = ({ title, desc, icon, gradient, delay = 0, onPress }) => (
  <Rise delay={delay}>
    <PressableScale
      onPress={onPress}
      accessibilityLabel={title}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.bg.border,
        backgroundColor: colors.bg.surface,
        shadowColor: '#001A4D',
        shadowOpacity: 0.1,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
      }}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <GradientFill
          angle={135}
          stops={[
            { color: gradient[0], offset: 0 },
            { color: gradient[1], offset: 1 },
          ]}
        />
        {icon}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{ fontFamily: fonts.sansBold, fontSize: 15, color: colors.brand.navy, letterSpacing: -0.3 }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 12,
            lineHeight: 17,
            color: colors.text.secondary,
            marginTop: 3,
          }}
        >
          {desc}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.text.muted} />
    </PressableScale>
  </Rise>
);
