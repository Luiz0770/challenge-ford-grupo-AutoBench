import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { getBrandLogo } from '../../constants/brandLogos';
import { FadeImage } from './FadeImage';
import { GradientFill } from './GradientFill';

interface BrandLogoProps {
  name: string;
  size?: number;
}

// Logo da marca sobre fundo claro (para não "sumir" no azul do app); sem logo
// mapeada, mantém o círculo em gradiente com as iniciais.
export const BrandLogo: React.FC<BrandLogoProps> = ({ name, size = 32 }) => {
  const logo = getBrandLogo(name);
  const base = {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  if (logo) {
    return (
      <View
        style={{
          ...base,
          backgroundColor: colors.bg.surface,
          borderWidth: 1,
          borderColor: colors.bg.border,
        }}
      >
        <FadeImage
          source={logo}
          resizeMode="contain"
          style={{ width: size * 0.66, height: size * 0.66 }}
          accessibilityLabel={name}
        />
      </View>
    );
  }

  return (
    <View style={base}>
      <GradientFill
        angle={135}
        stops={[
          { color: colors.brand.deep, offset: 0 },
          { color: colors.brand.mid, offset: 1 },
        ]}
      />
      <Text style={{ fontFamily: fonts.sansBold, fontSize: size * 0.36, color: colors.text.inverse }}>
        {name.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
};
