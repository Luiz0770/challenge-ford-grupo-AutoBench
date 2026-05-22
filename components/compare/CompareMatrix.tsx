import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import type { CompareRow } from '../../types';

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
        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 8 }}>
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
        <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 8 }}>
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
          <Row key={`${r.k}-${i}`} row={r} />
        ))}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          backgroundColor: colors.bg.subtle,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.monoMedium,
            fontSize: 10.5,
            color: colors.text.secondary,
          }}
        >
          Placar parcial
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: fonts.monoBold,
              fontSize: 10.5,
              color: colors.brand.blue,
            }}
          >
            A · {score.a}
          </Text>
          <Text style={{ color: colors.text.muted }}>·</Text>
          <Text style={{ fontFamily: fonts.mono, fontSize: 10.5, color: colors.text.secondary }}>
            Empate {score.t}
          </Text>
          <Text style={{ color: colors.text.muted }}>·</Text>
          <Text
            style={{
              fontFamily: fonts.monoBold,
              fontSize: 10.5,
              color: colors.status.warning,
            }}
          >
            B · {score.b}
          </Text>
        </View>
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
          backgroundColor: winB ? 'rgba(0,102,204,0.06)' : 'transparent',
        }}
      >
        <Text style={[cellStyle(winB, row.nullB), { flex: 1, textAlign: 'left' }]} numberOfLines={2}>
          {row.b}
        </Text>
        {winB && <Feather name="check" size={10} color={colors.brand.blue} />}
      </View>
    </View>
  );
};
