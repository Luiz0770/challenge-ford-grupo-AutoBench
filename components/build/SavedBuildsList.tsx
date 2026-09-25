import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { platformLabel } from '../../constants/build';
import { colors, fonts } from '../../constants/colors';
import { BuildService } from '../../services/build';
import type { Build } from '../../types';

interface SavedBuildsListProps {
  builds: Build[];
  onOpen: (build: Build) => void;
  onDelete: (id: string) => void;
}

export const SavedBuildsList: React.FC<SavedBuildsListProps> = ({ builds, onOpen, onDelete }) => {
  if (builds.length === 0) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          padding: 18,
          borderRadius: 14,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: '#D5DAE0',
          backgroundColor: colors.bg.surface,
        }}
      >
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: colors.bg.elevated,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="tool" size={19} color={colors.text.secondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.brand.navy }}>
            Nenhuma montagem salva
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
            Suas montagens aparecem aqui para continuar editando depois.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.bg.border,
        backgroundColor: colors.bg.surface,
        overflow: 'hidden',
      }}
    >
      {builds.map((b, i) => {
        const base = b.baseId ? BuildService.getBase(b.baseId) : null;
        const { swaps } = BuildService.summarize(b);
        const sub = base
          ? `${base.model} · ${swaps} ${swaps === 1 ? 'peça trocada' : 'peças trocadas'}`
          : `Do zero · ${platformLabel(b.platform)}`;
        return (
          <Pressable key={b.id} onPress={() => onOpen(b)} accessibilityRole="button">
            {({ pressed }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 13,
                  borderTopWidth: i ? 1 : 0,
                  borderTopColor: colors.divider,
                  opacity: pressed ? 0.7 : 1,
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: 'rgba(0,102,255,0.08)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="tool" size={17} color={colors.brand.bright} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.brand.navy }}
                  >
                    {b.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: fonts.sans, fontSize: 11.5, color: colors.text.secondary, marginTop: 1 }}
                  >
                    {sub}
                  </Text>
                </View>
                <Pressable onPress={() => onDelete(b.id)} hitSlop={6} accessibilityLabel={`Excluir ${b.name}`}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: colors.bg.borderStrong,
                      backgroundColor: colors.bg.surface,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name="x" size={12} color={colors.text.secondary} />
                  </View>
                </Pressable>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};
