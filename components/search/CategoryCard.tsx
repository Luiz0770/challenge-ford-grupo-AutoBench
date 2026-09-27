import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { getCategoryVehicleImage, getCategoryVehicleImageScale } from '../../constants/categoryVehicleImages';
import type { Category } from '../../types';
import { FadeImage } from '../ui/FadeImage';
import { GradientFill } from '../ui/GradientFill';
import { PressableScale } from '../ui/PressableScale';
import { RadialFill, categoryGlow } from '../ui/RadialFill';
import { Rise } from '../ui/Rise';

interface CategoryCardProps {
  category: Category;
  // Posição na grade, usada no atraso da entrada escalonada
  index?: number;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0, onPress }) => {
  const vehicleImage = getCategoryVehicleImage(category.id);
  const vehicleImageScale = getCategoryVehicleImageScale(category.id);

  return (
    <Rise delay={index * 35} style={{ width: '48%' }}>
      <PressableScale
        onPress={onPress}
        accessibilityLabel={`${category.label}, ${category.count} modelos`}
        style={{
          height: 96,
          borderRadius: 14,
          overflow: 'hidden',
          backgroundColor: category.color,
          padding: 14,
        }}
      >
        <RadialFill layers={categoryGlow(category.accent, 0.15, 0.18)} />

        <Text
          style={{
            position: 'absolute',
            bottom: -10,
            right: -2,
            fontFamily: fonts.monoBold,
            fontSize: 56,
            color: category.accent,
            opacity: 0.22,
            letterSpacing: -3,
            lineHeight: 56,
          }}
        >
          {category.code}
        </Text>

        {/* Foto do carro atrás das escritas (fica embaixo no empilhamento, nunca
            cobre o texto). As imagens já vêm recortadas rente à silhueta do
            carro, então a mesma altura fixa deixa todos os modelos no mesmo
            tamanho aparente, cada um com sua proporção real. O fade
            esquerda→direita (na cor do card) funde a imagem no fundo e dá
            destaque ao carro do lado direito. As fotos vêm apontando da
            direita para a esquerda, por isso o espelhamento horizontal. */}
        {vehicleImage && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '68%',
              overflow: 'hidden',
            }}
          >
            <FadeImage
              source={vehicleImage}
              resizeMode="contain"
              style={{
                width: '100%',
                height: `${70 * vehicleImageScale}%`,
                position: 'absolute',
                bottom: 0,
                right: 0,
                transform: [{ scaleX: -1 }],
              }}
            />
            <GradientFill
              angle={90}
              stops={[
                { color: category.color, offset: 0, opacity: 1 },
                { color: category.color, offset: 1, opacity: 0 },
              ]}
            />
          </View>
        )}

        <View style={{ position: 'absolute', left: 14, bottom: 12 }}>
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 16,
              color: colors.bg.surface,
              letterSpacing: -0.4,
              lineHeight: 18,
            }}
          >
            {category.label}
          </Text>
          <Text
            style={{
              fontFamily: fonts.monoMedium,
              fontSize: 10,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: 0.4,
              marginTop: 4,
            }}
          >
            {category.count} modelos
          </Text>
        </View>

        <View style={{ position: 'absolute', top: 14, right: 14 }}>
          <Feather name="arrow-up-right" size={14} color="rgba(255,255,255,0.55)" />
        </View>
      </PressableScale>
    </Rise>
  );
};
