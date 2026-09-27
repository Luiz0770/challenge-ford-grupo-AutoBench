import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PLATFORMS } from '../../constants/build';
import { colors, fonts } from '../../constants/colors';
import type { Platform } from '../../types';
import { BuildSheet } from './BuildSheet';

interface PlatformSheetProps {
  open: boolean;
  onClose: () => void;
  onStart: (platform: Platform) => void;
}

export const PlatformSheet: React.FC<PlatformSheetProps> = ({ open, onClose, onStart }) => {
  const [plat, setPlat] = useState<Platform>('mono');

  useEffect(() => {
    if (open) setPlat('mono');
  }, [open]);

  return (
    <BuildSheet open={open} eyebrow="Criar do zero" title="Escolha a plataforma" onClose={onClose}>
      <View style={{ gap: 8, paddingHorizontal: 8 }}>
        {PLATFORMS.map((p) => {
          const on = plat === p.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => setPlat(p.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: on ? 1.5 : 1,
                  borderColor: on ? colors.brand.bright : colors.bg.borderStrong,
                  backgroundColor: on ? 'rgba(0,102,255,0.05)' : colors.bg.surface,
                }}
              >
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    borderWidth: on ? 5 : 1.5,
                    borderColor: on ? colors.brand.bright : '#CED4DA',
                    marginTop: 1,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.brand.navy }}>
                    {p.label}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: 12,
                      lineHeight: 17,
                      color: colors.text.secondary,
                      marginTop: 2,
                    }}
                  >
                    {p.desc}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}

        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 11.5,
            lineHeight: 16,
            color: colors.text.secondary,
            paddingHorizontal: 2,
            paddingVertical: 4,
          }}
        >
          Peças de veículos com outra plataforma podem ser usadas, mas serão marcadas como “requer adaptação”.
        </Text>

        <Pressable onPress={() => onStart(plat)} accessibilityRole="button">
          {({ pressed }) => (
            <View
              style={{
                marginTop: 4,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: colors.brand.bright,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              }}
            >
              <Text style={{ fontFamily: fonts.sansSemibold, fontSize: 15, color: colors.text.inverse }}>
                Começar montagem
              </Text>
              <Feather name="arrow-right" size={16} color={colors.text.inverse} />
            </View>
          )}
        </Pressable>
      </View>
    </BuildSheet>
  );
};
