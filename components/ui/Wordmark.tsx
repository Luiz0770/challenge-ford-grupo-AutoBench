import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, fonts } from '../../constants/colors';

interface WordmarkProps {
  small?: boolean;
  light?: boolean;
}

export const Wordmark: React.FC<WordmarkProps> = ({ small = false, light = false }) => {
  const size = small ? 18 : 22;
  const accentColor = light ? colors.bg.surface : colors.brand.navy;
  const innerColor = light ? colors.brand.navy : colors.bg.surface;
  const dotColor = light ? colors.brand.blue : colors.brand.blueLight;
  const labelColor = light ? colors.bg.surface : colors.brand.navy;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: small ? 6 : 8 }}>
      <View>
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: small ? 15 : 17,
            color: labelColor,
            letterSpacing: -0.4,
          }}
        >
          AutoBench
        </Text>
        {!small && (
          <Text
            style={{
              fontFamily: fonts.monoMedium,
              fontSize: 9,
              color: light ? 'rgba(255,255,255,0.55)' : colors.text.secondary,
              letterSpacing: 1.4,
              marginTop: 3,
              textTransform: 'uppercase',
            }}
          >
            Inteligência Automotiva
          </Text>
        )}
      </View>
    </View>
  );
};
