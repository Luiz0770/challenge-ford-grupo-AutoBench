import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import type { CompareRow } from '../../types';
import { Rise } from '../ui/Rise';

interface CompareMatrixProps {
  rows: CompareRow[];
  aLabel: string;
  bLabel: string;
}

export const CompareMatrix: React.FC<CompareMatrixProps> = ({ rows, aLabel, bLabel }) => {
  const score = rows.reduce(
    (acc, r) => {
      if (r.w === 'a') acc.a++;
      else if (r.w === 'b') acc.b++;
      else if (r.w === 'tie') acc.t++;
      return acc;
    },
    { a: 0, b: 0, t: 0 }
  );

  return (
    <View
      style={{
        backgroundColor: colors.bg.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.bg.border,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 8,
          paddingVertical: 10,
          backgroundColor: colors.bg.subtle,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            paddingVertical: 6,
            paddingRight: 8,
            paddingLeft: 4,
            borderRadius: 8,
            backgroundColor: 'rgba(0,102,204,0.07)',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.monoBold,
              fontSize: 8.5,
              color: colors.brand.blue,
              letterSpacing: 1.2,
            }}
          >
            SLOT A
          </Text>
          <Text
            style={{
              fontFamily: fonts.sansSemibold,
              fontSize: 11.5,
              color: colors.brand.navy,
              marginTop: 1,
              lineHeight: 13,
            }}
            numberOfLines={1}
          >
            {aLabel}
          </Text>
        </View>
        <View style={{ width: 76, alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: fonts.monoMedium,
              fontSize: 9,
              color: colors.text.muted,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            atributo
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-start',
            paddingVertical: 6,
            paddingLeft: 8,
            paddingRight: 4,
            borderRadius: 8,
            backgroundColor: 'rgba(180,83,9,0.08)',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.monoBold,
              fontSize: 8.5,
              color: colors.status.warning,
              letterSpacing: 1.2,
            }}
          >
            SLOT B
          </Text>
          <Text
            style={{
              fontFamily: fonts.sansSemibold,
              fontSize: 11.5,
              color: colors.brand.navy,
              marginTop: 1,
              lineHeight: 13,
            }}
            numberOfLines={1}
          >
            {bLabel}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 6, paddingVertical: 4 }}>
        {rows.map((r, i) => (
          <Rise key={`${r.k}-${i}`} delay={i * 30}>
            <Row row={r} />
          </Rise>
        ))}
      </View>

      <View
        style={{
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          backgroundColor: colors.bg.subtle,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: 5,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: 'rgba(0,102,204,0.1)',
            }}
          >
            <Text
              style={{
                fontFamily: fonts.monoBold,
                fontSize: 9,
                color: colors.brand.blue,
                letterSpacing: 1,
              }}
            >
              A
            </Text>
            <Text
              style={{
                fontFamily: fonts.monoBold,
                fontSize: 16,
                color: colors.brand.blue,
              }}
            >
              {score.a}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.monoMedium,
              fontSize: 10,
              color: colors.text.secondary,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}
          >
            Vantagens
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: 5,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: 'rgba(180,83,9,0.12)',
            }}
          >
            <Text
              style={{
                fontFamily: fonts.monoBold,
                fontSize: 16,
                color: colors.status.warning,
              }}
            >
              {score.b}
            </Text>
            <Text
              style={{
                fontFamily: fonts.monoBold,
                fontSize: 9,
                color: colors.status.warning,
                letterSpacing: 1,
              }}
            >
              B
            </Text>
          </View>
        </View>
        {score.t > 0 && (
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 9.5,
              color: colors.text.muted,
              marginTop: 6,
            }}
          >
            Empate em {score.t} {score.t === 1 ? 'atributo' : 'atributos'}
          </Text>
        )}
      </View>
    </View>
  );
};

const Row: React.FC<{ row: CompareRow }> = ({ row }) => {
  const winA = row.w === 'a';
  const winB = row.w === 'b';

  const cellStyle = (isWin: boolean, isNull?: boolean) => ({
    fontFamily: row.num ? fonts.monoSemibold : fonts.sans,
    fontSize: 12.5,
    fontWeight: isWin ? ('700' as const) : ('500' as const),
    color: isNull
      ? colors.text.muted
      : isWin
        ? colors.brand.navy
        : row.w && !isWin
          ? colors.text.muted
          : colors.text.primary,
    fontStyle: isNull ? ('italic' as const) : ('normal' as const),
    letterSpacing: -0.1,
    lineHeight: 16,
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        gap: 4,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 4,
          padding: 8,
          borderRadius: 6,
          backgroundColor: winA ? 'rgba(0,102,204,0.06)' : 'transparent',
        }}
      >
        {winA && <Feather name="check" size={10} color={colors.brand.blue} />}
        <Text style={[cellStyle(winA, row.nullA), { textAlign: 'right' }]} numberOfLines={2}>
          {row.a}
        </Text>
      </View>
      <View style={{ width: 76, paddingHorizontal: 4 }}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: fonts.sansMedium,
            fontSize: 10.5,
            color: colors.text.secondary,
            lineHeight: 13,
          }}
        >
          {row.k}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          padding: 8,
          borderRadius: 6,
          backgroundColor: winB ? 'rgba(180,83,9,0.08)' : 'transparent',
        }}
      >
        <Text style={[cellStyle(winB, row.nullB), { flex: 1, textAlign: 'left' }]} numberOfLines={2}>
          {row.b}
        </Text>
        {winB && <Feather name="check" size={10} color={colors.status.warning} />}
      </View>
    </View>
  );
};
