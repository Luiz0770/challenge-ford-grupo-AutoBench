import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { statusLabel, type SystemDef } from '../../constants/build';
import { colors, fonts } from '../../constants/colors';
import type { BuildPart, PartStatus } from '../../types';
import { Rise } from '../ui/Rise';
import { StatusBadge } from './StatusBadge';
import { SystemIcon } from './SystemIcon';

interface SystemRowProps {
  system: SystemDef;
  part: BuildPart | null;
  status: PartStatus | null;
  hasBase: boolean;
  /** "Marca Modelo" da origem da peça */
  origin: string | null;
  index: number;
  onPress: () => void;
}

export const SystemRow: React.FC<SystemRowProps> = ({ system, part, status, hasBase, origin, index, onPress }) => (
  <Rise
    delay={120 + index * 40}
    style={{ borderTopWidth: index ? 1 : 0, borderTopColor: colors.divider }}
  >
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${system.label}: ${part ? part.name : 'escolher peça'}`}
    >
      {({ pressed }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 14,
            paddingVertical: 13,
            opacity: pressed ? 0.7 : 1,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: part ? 'rgba(0,61,165,0.08)' : colors.bg.canvas,
              borderWidth: part ? 0 : 1,
              borderStyle: 'dashed',
              borderColor: '#CED4DA',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SystemIcon id={system.id} color={part ? colors.brand.mid : colors.text.muted} />
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 9,
                  color: colors.text.secondary,
                  letterSpacing: 1.1,
                  textTransform: 'uppercase',
                }}
              >
                {system.label}
              </Text>
              {status && <StatusBadge tone={status} label={statusLabel(status, hasBase)} />}
            </View>
            {part ? (
              <>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: fonts.sansSemibold,
                    fontSize: 14,
                    color: colors.brand.navy,
                    marginTop: 3,
                    letterSpacing: -0.2,
                  }}
                >
                  {part.name}
                </Text>
                {origin ? (
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: fonts.sans, fontSize: 11.5, color: colors.text.secondary, marginTop: 1 }}
                  >
                    de {origin}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text
                style={{ fontFamily: fonts.sansMedium, fontSize: 13.5, color: colors.brand.bright, marginTop: 3 }}
              >
                Escolher peça
              </Text>
            )}
          </View>

          <Feather name="chevron-right" size={16} color={colors.text.muted} />
        </View>
      )}
    </Pressable>
  </Rise>
);
