import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { CatalogService } from '../../services/catalog';
import type { CategoryVehicleEntry } from '../../types';
import { fmtBRLFromReais } from '../../utils/format';

interface SwapSheetProps {
  open: boolean;
  side: 'a' | 'b' | null;
  onClose: () => void;
  onPick: (entry: CategoryVehicleEntry) => void;
}

export const SwapSheet: React.FC<SwapSheetProps> = ({ open, side, onClose, onPick }) => {
  const alternatives = CatalogService.getCompareAlternatives();

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,28,70,0.42)',
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.bg.surface,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            paddingTop: 12,
            paddingBottom: 36,
            maxHeight: '75%',
          }}
        >
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 4,
              backgroundColor: colors.bg.borderStrong,
              alignSelf: 'center',
              marginBottom: 14,
            }}
          />
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: fonts.monoMedium,
                  fontSize: 9,
                  color: colors.text.secondary,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                Substituir slot {side?.toUpperCase()}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 17,
                  color: colors.brand.navy,
                  letterSpacing: -0.4,
                }}
              >
                Escolher veículo
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => ({
                width: 32,
                height: 32,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.bg.borderStrong,
                backgroundColor: colors.bg.surface,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Feather name="x" size={14} color={colors.text.secondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 14 }}>
            {alternatives.map((v) => (
              <Pressable
                key={v.vehicleId}
                onPress={() => onPick(v)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 12,
                  borderRadius: 10,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    backgroundColor: colors.bg.elevated,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="truck" size={18} color={colors.brand.navy} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={{
                      fontFamily: fonts.sansSemibold,
                      fontSize: 13.5,
                      color: colors.text.primary,
                      letterSpacing: -0.2,
                    }}
                  >
                    {v.brand} {v.model}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: 11.5,
                      color: colors.text.secondary,
                      marginTop: 1,
                    }}
                    numberOfLines={1}
                  >
                    {v.version} · {v.year}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 11,
                    color: colors.text.secondary,
                  }}
                >
                  {fmtBRLFromReais(v.fipe)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
