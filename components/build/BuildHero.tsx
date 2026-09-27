import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../constants/colors';
import { HeroBackground, useHeroBackdropHeight } from '../ui/HeroBackground';
import { Rise } from '../ui/Rise';

interface BuildHeroProps {
  eyebrow: string;
  title: string;
  sub?: string;
  onBack?: () => void;
  /** Conteúdo à direita da linha do botão voltar (ex.: "Restaurar original") */
  right?: React.ReactNode;
  bottomPad?: number;
}

export const heroPill = {
  height: 34,
  minWidth: 34,
  borderRadius: 17,
  paddingHorizontal: 12,
  backgroundColor: 'rgba(255,255,255,0.10)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export const BuildHero: React.FC<BuildHeroProps> = ({
  eyebrow,
  title,
  sub,
  onBack,
  right,
  bottomPad = 64,
}) => {
  const insets = useSafeAreaInsets();
  const [heroHeight, setHeroHeight] = useState(0);
  const backdropHeight = useHeroBackdropHeight(heroHeight);

  return (
    <View
      onLayout={(e) => setHeroHeight(e.nativeEvent.layout.height)}
      style={{ paddingTop: insets.top + 14, paddingBottom: bottomPad }}
    >
      <HeroBackground height={backdropHeight} />

      {(onBack || right) && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 6,
          }}
        >
          {onBack ? (
            <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Voltar">
              {({ pressed }) => (
                <View style={[heroPill, { width: 34, paddingHorizontal: 0, opacity: pressed ? 0.7 : 1 }]}>
                  <Feather name="chevron-left" size={16} color={colors.text.inverse} />
                </View>
              )}
            </Pressable>
          ) : (
            <View />
          )}
          {right}
        </View>
      )}

      <Rise delay={0} style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 10,
            letterSpacing: 1.4,
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </Text>
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: 27,
            lineHeight: 29,
            letterSpacing: -0.8,
            color: colors.text.inverse,
            marginTop: 10,
            marginBottom: sub ? 8 : 0,
          }}
        >
          {title}
        </Text>
        {sub ? (
          <Text
            style={{
              fontFamily: fonts.sans,
              fontSize: 14,
              lineHeight: 21,
              color: 'rgba(255,255,255,0.75)',
              maxWidth: 310,
            }}
          >
            {sub}
          </Text>
        ) : null}
      </Rise>
    </View>
  );
};
