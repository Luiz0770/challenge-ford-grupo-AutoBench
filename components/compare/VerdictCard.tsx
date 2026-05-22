import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { CountUp } from '../../components/ui/CountUp';
import { GrowBar } from '../../components/ui/GrowBar';
import { colors, fonts } from '../../constants/colors';
import type { CompareVerdict } from '../../types';

interface VerdictCardProps {
  verdict: CompareVerdict;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ verdict }) => (
  <View
    style={{
      backgroundColor: colors.brand.navy,
      borderRadius: 14,
      padding: 16,
      shadowColor: colors.brand.navy,
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 6 },
      overflow: 'hidden',
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <Feather name="zap" size={14} color={colors.accent.amber} />
      <Text
        style={{
          fontFamily: fonts.monoMedium,
          fontSize: 9,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
        }}
      >
        Oráculo IA
      </Text>
    </View>
    <Text
      style={{
        fontFamily: fonts.sansSemibold,
        fontSize: 15,
        color: colors.bg.surface,
        marginBottom: 6,
        letterSpacing: -0.3,
      }}
    >
      {verdict.title}
    </Text>
    <Text
      style={{
        fontFamily: fonts.sans,
        fontSize: 12.5,
        color: 'rgba(255,255,255,0.72)',
        lineHeight: 18,
        marginBottom: 14,
      }}
    >
      {verdict.summary}
    </Text>

    <View style={{ gap: 9, marginBottom: 14 }}>
      {verdict.scores.map((s, i) => (
        <View key={s.cat}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 4,
            }}
          >
            <CountUp
              to={s.a}
              duration={900}
              delay={320 + i * 110}
              style={{
                width: 28,
                fontFamily: fonts.monoSemibold,
                fontSize: 10,
                color: s.leans === 'a' ? colors.bg.surface : 'rgba(255,255,255,0.45)',
                textAlign: 'left',
              }}
            />
            <Text
              style={{
                fontFamily: fonts.sansMedium,
                fontSize: 11,
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              {s.cat}
            </Text>
            <CountUp
              to={s.b}
              duration={900}
              delay={320 + i * 110}
              style={{
                width: 28,
                fontFamily: fonts.monoSemibold,
                fontSize: 10,
                color: s.leans === 'b' ? colors.bg.surface : 'rgba(255,255,255,0.45)',
                textAlign: 'right',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: 5,
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.08)',
              alignItems: 'stretch',
            }}
          >
            <GrowBar
              pct={s.a}
              delay={280 + i * 110}
              trackColor="transparent"
              fillColor={s.leans === 'a' ? colors.brand.blueLight : 'rgba(255,255,255,0.18)'}
              height={5}
              style={{ flex: 1, borderRadius: 0 }}
            />
            <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.25)' }} />
            <GrowBar
              pct={s.b}
              delay={280 + i * 110}
              trackColor="transparent"
              fillColor={s.leans === 'b' ? colors.accent.amber : 'rgba(255,255,255,0.18)'}
              height={5}
              style={{ flex: 1, borderRadius: 0 }}
            />
          </View>
        </View>
      ))}
    </View>

    <View style={{ gap: 8, marginBottom: 12 }}>
      {verdict.recommendations.map((r) => (
        <View
          key={r.tag}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            borderRadius: 10,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor:
                r.winner === 'a' ? 'rgba(37,137,230,0.18)' : 'rgba(245,158,11,0.18)',
              borderWidth: 1,
              borderColor:
                r.winner === 'a' ? 'rgba(37,137,230,0.35)' : 'rgba(245,158,11,0.35)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: fonts.monoBold,
                fontSize: 11,
                color: r.winner === 'a' ? colors.brand.blueSoft : colors.accent.amberLight,
              }}
            >
              {r.winner === 'a' ? 'A' : 'B'}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={{
                fontFamily: fonts.monoMedium,
                fontSize: 9,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                marginBottom: 2,
              }}
            >
              {r.tag}
            </Text>
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 12,
                color: colors.bg.surface,
                lineHeight: 17,
              }}
            >
              {r.detail}
            </Text>
          </View>
        </View>
      ))}
    </View>

    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <Text
        style={{
          fontFamily: fonts.monoMedium,
          fontSize: 9.5,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        Diferença FIPE
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
        <Text
          style={{
            fontFamily: fonts.monoBold,
            fontSize: 13,
            color: colors.bg.surface,
          }}
        >
          R${' '}
        </Text>
        <CountUp
          to={verdict.priceGap.absolute}
          duration={1100}
          delay={1100}
          format={(n) => Math.round(n).toLocaleString('pt-BR')}
          style={{
            fontFamily: fonts.monoBold,
            fontSize: 13,
            color: colors.bg.surface,
          }}
        />
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 10,
            color: colors.accent.amberLight,
            marginLeft: 4,
          }}
        >
          {verdict.priceGap.cheaper.toUpperCase()} {verdict.priceGap.percent}% mais barato
        </Text>
      </View>
    </View>
  </View>
);
