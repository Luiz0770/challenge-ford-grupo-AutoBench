import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, fonts } from '../../constants/colors';

interface WordmarkProps {
  small?: boolean;
  light?: boolean;
}

export const Wordmark: React.FC<WordmarkProps> = ({ small = false, light = false }) => {
  const box = small ? 22 : 28;
  const glyph = small ? 14 : 18;
  const labelColor = light ? colors.bg.surface : colors.brand.navy;
  const dotColor = light ? colors.brand.cyan : colors.brand.bright;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: small ? 7 : 9 }}>
      {/* Símbolo da marca */}
      <View
        style={{
          width: box,
          height: box,
          borderRadius: small ? 6 : 8,
          backgroundColor: light ? 'rgba(255,255,255,0.16)' : colors.brand.navy,
          borderWidth: light ? 1 : 0,
          borderColor: 'rgba(255,255,255,0.18)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 18V6h8a3.5 3.5 0 0 1 0 7H7"
            stroke="#fff"
            strokeWidth={2.6}
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <Circle cx={17.5} cy={16} r={2} fill={dotColor} />
        </Svg>
      </View>

      <View>
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: small ? 16 : 18,
            color: labelColor,
            letterSpacing: -0.5,
          }}
        >
          AutoBench
        </Text>
        {!small && (
          <Text
            style={{
              fontFamily: fonts.monoMedium,
              fontSize: 9,
              color: light ? 'rgba(255,255,255,0.6)' : colors.text.secondary,
              letterSpacing: 1.5,
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
