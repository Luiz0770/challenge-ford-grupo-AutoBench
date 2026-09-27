import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../constants/colors';
import { HeroBackground, useHeroBackdropHeight } from '../ui/HeroBackground';
import { HeroBrandRow } from '../ui/HeroBrandRow';
import { Rise } from '../ui/Rise';

// Altura mínima dos slots (SetupSlot) e quanto o azul deve invadir: metade deles.
export const SETUP_SLOT_HEIGHT = 168;
export const SETUP_HERO_OVERLAP = SETUP_SLOT_HEIGHT / 2;
// Folga entre o texto do hero e o topo dos slots (mesma do design: 64 - 42)
const HERO_GAP = 22;

interface SetupHeroProps {
  step: 1 | 2;
}

export const SetupHero: React.FC<SetupHeroProps> = ({ step }) => {
  const insets = useSafeAreaInsets();
  const [heroHeight, setHeroHeight] = useState(0);
  const backdropHeight = useHeroBackdropHeight(heroHeight);

  return (
    <View
      onLayout={(e) => setHeroHeight(e.nativeEvent.layout.height)}
      style={{ paddingTop: insets.top + 14, paddingBottom: HERO_GAP + SETUP_HERO_OVERLAP }}
    >
      <HeroBackground height={backdropHeight} />

      <HeroBrandRow />

      <Rise delay={60} style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 10,
            letterSpacing: 1.4,
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
          }}
        >
          Comparar
        </Text>
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: 28,
            lineHeight: 30,
            letterSpacing: -0.8,
            color: colors.text.inverse,
            marginTop: 10,
            marginBottom: 8,
          }}
        >
          Escolha dois veículos{'\n'}para comparar
        </Text>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 14,
            lineHeight: 21,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 300,
          }}
        >
          Mostramos lado a lado motorização, dimensões, tecnologia, segurança e o veredito do Oráculo.
        </Text>
      </Rise>
    </View>
  );
};
