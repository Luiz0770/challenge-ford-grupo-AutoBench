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
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="2" width="20" height="20" rx="5" fill={accentColor} />
        <Path d="M7 16V8h4.5a2.5 2.5 0 0 1 0 5H9" stroke={innerColor} strokeWidth="2" strokeLinecap="square" />
        <Circle cx="16" cy="14.5" r="1.5" fill={dotColor} />
      </Svg>
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
