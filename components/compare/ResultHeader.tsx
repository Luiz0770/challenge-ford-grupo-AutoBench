import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../constants/colors';
import { GradientFill } from '../ui/GradientFill';

interface ResultHeaderProps {
  onBack: () => void;
  onNew: () => void;
}

const roundButton = {
  width: 34,
  height: 34,
  borderRadius: 17,
  backgroundColor: 'rgba(255,255,255,0.10)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export const ResultHeader: React.FC<ResultHeaderProps> = ({ onBack, onNew }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top + 6, paddingBottom: 30, overflow: 'hidden' }}>
      <GradientFill
        angle={180}
        stops={[
          { color: colors.brand.navyLight, offset: 0 },
          { color: colors.brand.navy, offset: 0.6 },
        ]}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 6,
          paddingBottom: 4,
        }}
      >
        <Pressable
          onPress={onBack}
          accessibilityLabel="Voltar"
          style={({ pressed }) => [roundButton, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name="chevron-left" size={16} color={colors.text.inverse} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: fonts.monoMedium,
              fontSize: 9,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: 1.4,
              textTransform: 'uppercase',
            }}
          >
            Análise lado-a-lado
          </Text>
          <Text
            style={{
              fontFamily: fonts.sansSemibold,
              fontSize: 15,
              color: colors.text.inverse,
              marginTop: 4,
              letterSpacing: -0.2,
            }}
          >
            Comparar
          </Text>
        </View>
        <Pressable
          onPress={onNew}
          accessibilityLabel="Nova comparação"
          style={({ pressed }) => [roundButton, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name="plus" size={16} color={colors.text.inverse} />
        </Pressable>
      </View>
    </View>
  );
};
