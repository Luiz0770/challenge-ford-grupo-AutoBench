import React, { useId } from 'react';
import { Text, View } from 'react-native';
import Svg, { Defs, G, Mask, Path, Polygon, Rect } from 'react-native-svg';
import { colors, fonts } from '../../constants/colors';

interface WordmarkProps {
  small?: boolean;
  light?: boolean;
}

// Proporção do símbolo oficial AutoBench (assets/images/autobench-simbolo-*.svg)
const SYMBOL_VIEWBOX = '3 8 45 32';
const SYMBOL_ASPECT = 45 / 32;

export const WordmarkIcon: React.FC<WordmarkProps> = ({ small = false, light = false }) => {
  const maskId = useId();
  const glyphHeight = small ? 20 : 26;
  const glyphWidth = glyphHeight * SYMBOL_ASPECT;
  const markColor = light ? colors.bg.surface : colors.brand.deep;
  const dotColor = light ? colors.brand.cyan : colors.brand.bright;

  return (
    // Símbolo oficial da marca (autobench-simbolo-padrao/negNavy)
    <Svg width={glyphWidth} height={glyphHeight} viewBox={SYMBOL_VIEWBOX}>
      <Defs>
        <Mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={56} height={48}>
          <Rect width={56} height={48} fill="#fff" />
          <Polygon points="31.5,40 51.5,8 53.5,8 33.5,40" fill="#000" />
        </Mask>
      </Defs>
      <G mask={`url(#${maskId})`}>
        <G fill={markColor}>
          <Rect x={23} y={8} width={5} height={32} />
          <Polygon points="3,40 23,8 23,17.6 9,40" />
          <Path fillRule="evenodd" d="M28 8H37A8 8 0 0 1 37 24H28ZM28 13H37A3 3 0 0 1 37 19H28Z" />
          <Path fillRule="evenodd" d="M28 19H37.5A10.5 10.5 0 0 1 37.5 40H28ZM28 24H37.5A5.5 5.5 0 0 1 37.5 35H28Z" />
        </G>
        <Polygon points="15.9,29 23,29 23,34 12.75,34" fill={dotColor} />
      </G>
    </Svg>
  );
};

export const Wordmark: React.FC<WordmarkProps> = ({ small = false, light = false }) => {
  const labelColor = light ? colors.bg.surface : colors.brand.navy;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: small ? 7 : 9 }}>
      <WordmarkIcon small={small} light={light} />

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
