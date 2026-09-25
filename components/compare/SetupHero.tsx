import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '../../constants/colors';
import { GradientFill } from '../ui/GradientFill';
import { Rise } from '../ui/Rise';

interface SetupHeroProps {
  step: 1 | 2;
}

export const SetupHero: React.FC<SetupHeroProps> = ({ step }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top + 14, paddingBottom: 64, overflow: 'hidden' }}>
      <GradientFill
        angle={160}
        stops={[
          { color: colors.brand.deep, offset: 0 },
          { color: colors.brand.mid, offset: 0.85 },
        ]}
      />
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 390 240"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Circle cx={360} cy={30} r={110} fill="none" stroke="rgba(255,255,255,0.08)" />
        <Circle cx={360} cy={30} r={170} fill="none" stroke="rgba(255,255,255,0.05)" />
      </Svg>

      <Rise delay={0} style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 10,
            letterSpacing: 1.4,
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
          }}
        >
          Comparar · passo {step} de 2
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
