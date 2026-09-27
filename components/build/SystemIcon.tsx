import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../../constants/colors';
import type { SystemId } from '../../types';

interface SystemIconProps {
  id: SystemId;
  size?: number;
  color?: string;
}

// Ícones dos 7 sistemas (traços do protótipo, viewBox 24)
export const SystemIcon: React.FC<SystemIconProps> = ({ id, size = 18, color = colors.brand.navy }) => {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (id) {
    case 'motor':
      return (
        <Svg {...p}>
          <Rect x={6} y={8} width={12} height={10} rx={1} />
          <Path d="M9 8V5h6v3" />
          <Path d="M6 12H3v3h3M18 11h3v5h-3" />
          <Path d="M10 13h4" />
        </Svg>
      );
    case 'cambio':
      return (
        <Svg {...p}>
          <Circle cx={6} cy={6} r={2} />
          <Circle cx={12} cy={6} r={2} />
          <Circle cx={18} cy={6} r={2} />
          <Circle cx={6} cy={18} r={2} />
          <Circle cx={12} cy={18} r={2} />
          <Path d="M6 8v8M12 8v8M18 8v4H6" />
        </Svg>
      );
    case 'tracao':
      return (
        <Svg {...p}>
          <Rect x={3} y={3} width={4} height={6} rx={1} />
          <Rect x={17} y={3} width={4} height={6} rx={1} />
          <Rect x={3} y={15} width={4} height={6} rx={1} />
          <Rect x={17} y={15} width={4} height={6} rx={1} />
          <Path d="M7 6h10M7 18h10M12 6v12" />
        </Svg>
      );
    case 'susp':
      return (
        <Svg {...p}>
          <Path d="M12 2v3M12 19v3" />
          <Path d="M8 5h8l-8 3h8l-8 3h8l-8 3h8l-8 3h8" />
        </Svg>
      );
    case 'freios':
      return (
        <Svg {...p}>
          <Circle cx={12} cy={12} r={9} />
          <Circle cx={12} cy={12} r={3} />
          <Path d="M5 7a9 9 0 0 1 4-3.5" strokeWidth={3.5} />
        </Svg>
      );
    case 'rodas':
      return (
        <Svg {...p}>
          <Circle cx={12} cy={12} r={9} />
          <Circle cx={12} cy={12} r={2} />
          <Path d="M12 3v7M12 14v7M3 12h7M14 12h7" />
        </Svg>
      );
    default:
      return (
        <Svg {...p}>
          <Rect x={3} y={4} width={18} height={12} rx={2} />
          <Path d="M8 20h8M12 16v4" />
        </Svg>
      );
  }
};
