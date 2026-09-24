import React, { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export interface GradientStop {
  color: string;
  offset: number; // 0–1
  opacity?: number;
}

interface GradientFillProps {
  stops: GradientStop[];
  angle?: number; // em graus, como no CSS: 90 = da esquerda para a direita
}

// Preenche o pai (absolute) com um gradiente linear equivalente ao
// linear-gradient(<angle>deg, ...) do CSS. O pai precisa de overflow: hidden
// para respeitar o borderRadius.
export const GradientFill: React.FC<GradientFillProps> = ({ stops, angle = 180 }) => {
  const id = `grad${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad) / 2;
  const dy = -Math.cos(rad) / 2;

  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={id} x1={0.5 - dx} y1={0.5 - dy} x2={0.5 + dx} y2={0.5 + dy}>
          {stops.map((s) => (
            <Stop key={s.offset} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity ?? 1} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
};
