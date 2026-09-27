import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { Rise } from './Rise';
import { WordmarkIcon } from './Wordmark';

interface HeroBrandRowProps {
  delay?: number;
}

// Linha de marca dos heroes escuros: símbolo à esquerda, nome + descrição
// centralizados na largura total (espaçador invisível equilibra o símbolo).
export const HeroBrandRow: React.FC<HeroBrandRowProps> = ({ delay = 0 }) => {
  return (
    <Rise
      delay={delay}
      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14 }}
    >
      <WordmarkIcon light />
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.sansBold, fontSize: 18, letterSpacing: -0.5, color: colors.bg.surface }}>
          AutoBench
        </Text>
        <Text
          style={{
            fontFamily: fonts.monoMedium,
            fontSize: 9,
            letterSpacing: 1.5,
            marginTop: 3,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Inteligência Automotiva
        </Text>
      </View>
      <View pointerEvents="none" style={{ opacity: 0 }}>
        <WordmarkIcon light />
      </View>
    </Rise>
  );
};
