import React, { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export interface RadialLayer {
  // Centro e raios em fração do pai (equivale ao "120% 80% at 100% 0%" do CSS)
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  color: string;
  opacity: number;
  // Fração do raio em que o gradiente já ficou transparente
  fade: number;
}

// Brilho da cor de destaque no canto superior direito e sombra no inferior
// esquerdo, usados nos cards, banners e selos de categoria
export const categoryGlow = (accent: string, glow: number, shade = 0): RadialLayer[] => [
  { cx: 1, cy: 0, rx: 1.2, ry: 0.8, color: accent, opacity: glow, fade: 0.55 },
  ...(shade > 0
    ? [{ cx: 0, cy: 1, rx: 0.8, ry: 0.6, color: '#000000', opacity: shade, fade: 0.6 }]
    : []),
];

interface RadialFillProps {
  layers: RadialLayer[];
}

// Preenche o pai (absolute) com gradientes radiais empilhados, como o
// radial-gradient() do CSS. O pai precisa de overflow: hidden para respeitar
// o borderRadius.
export const RadialFill: React.FC<RadialFillProps> = ({ layers }) => {
  const base = `radial${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        {layers.map((l, i) => (
          <RadialGradient key={i} id={`${base}${i}`} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry}>
            <Stop offset={0} stopColor={l.color} stopOpacity={l.opacity} />
            <Stop offset={l.fade} stopColor={l.color} stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>
      {layers.map((_, i) => (
        <Rect key={i} width="100%" height="100%" fill={`url(#${base}${i})`} />
      ))}
    </Svg>
  );
};
