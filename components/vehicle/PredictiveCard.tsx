import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { CountUp } from '../../components/ui/CountUp';
import { GrowBar } from '../../components/ui/GrowBar';
import { LivePulse } from '../../components/ui/LivePulse';
import { colors, fonts } from '../../constants/colors';
import type { VehicleAi } from '../../types';

interface PredictiveCardProps {
  ai: VehicleAi;
}

export const PredictiveCard: React.FC<PredictiveCardProps> = ({ ai }) => (
  <View
    style={{
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: colors.brand.navy,
      padding: 16,
      shadowColor: colors.brand.navy,
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 6 },
    }}
  >
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.12)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="zap" size={14} color={colors.accent.amber} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: fonts.monoMedium,
              fontSize: 9,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: 1.4,
              textTransform: 'uppercase',
            }}
          >
            {ai.engine}
          </Text>
          <Text
            style={{
              fontFamily: fonts.sansSemibold,
              fontSize: 13,
              color: colors.bg.surface,
              letterSpacing: -0.2,
              marginTop: 1,
            }}
          >
            {ai.title}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
          paddingHorizontal: 8,
          paddingVertical: 4,
          backgroundColor: 'rgba(245,158,11,0.16)',
          borderWidth: 1,
          borderColor: 'rgba(245,158,11,0.4)',
          borderRadius: 999,
        }}
      >
        <LivePulse color={colors.accent.amber} size={5} />
        <Text
          style={{
            fontFamily: fonts.monoSemibold,
            fontSize: 10,
            color: colors.accent.amberLight,
            letterSpacing: 0.4,
          }}
        >
          ATENÇÃO
        </Text>
      </View>
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
      <CountUp
        to={ai.confidence}
        duration={1100}
        delay={140}
        style={{
          fontFamily: fonts.monoBold,
          fontSize: 44,
          letterSpacing: -2,
          lineHeight: 44,
          color: colors.bg.surface,
        }}
      />
      <Text
        style={{
          fontFamily: fonts.monoBold,
          fontSize: 22,
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        %
      </Text>
      <Text
        style={{
          fontFamily: fonts.sans,
          fontSize: 11,
          color: 'rgba(255,255,255,0.6)',
          flex: 1,
          lineHeight: 14,
        }}
      >
        de confiança{'\n'}· janela de {ai.timeframe}
      </Text>
    </View>

    <Text
      style={{
        fontFamily: fonts.sans,
        fontSize: 13.5,
        lineHeight: 19,
        color: colors.bg.surface,
        marginBottom: 8,
        letterSpacing: -0.1,
      }}
    >
      {ai.summary}
    </Text>
    <Text
      style={{
        fontFamily: fonts.sans,
        fontSize: 12.5,
        lineHeight: 19,
        color: 'rgba(255,255,255,0.72)',
        marginBottom: 14,
      }}
    >
      {ai.detail}
    </Text>

    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.10)',
        paddingTop: 12,
        marginBottom: 14,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.monoMedium,
          fontSize: 9,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Sinais combinados
      </Text>
      <View style={{ gap: 7 }}>
        {ai.signals.map((s, i) => (
          <View key={s.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text
              style={{
                width: 110,
                fontFamily: fonts.sans,
                fontSize: 11.5,
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {s.label}
            </Text>
            <GrowBar
              pct={s.weight * 100}
              delay={320 + i * 130}
              trackColor="rgba(255,255,255,0.08)"
              fillColor={colors.brand.blueLight}
              height={4}
              style={{ flex: 1 }}
            />
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 10.5,
                color: colors.bg.surface,
                minWidth: 64,
                textAlign: 'right',
              }}
            >
              {s.value}
            </Text>
          </View>
        ))}
      </View>
    </View>

    <View
      style={{
        backgroundColor: 'rgba(245,158,11,0.10)',
        borderWidth: 1,
        borderColor: 'rgba(245,158,11,0.25)',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <Feather name="zap" size={14} color={colors.accent.amberLight} style={{ marginTop: 2 }} />
      <Text
        style={{
          flex: 1,
          fontFamily: fonts.sans,
          fontSize: 12,
          lineHeight: 18,
          color: colors.accent.amberBg,
        }}
      >
        {ai.action}
      </Text>
    </View>

    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          fontFamily: fonts.mono,
          fontSize: 9.5,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: 0.4,
        }}
      >
        Último processamento · {ai.lastRun}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 9.5,
            color: colors.brand.blueSoft,
          }}
        >
          Detalhes
        </Text>
        <Feather name="chevron-right" size={10} color={colors.brand.blueSoft} />
      </View>
    </View>
  </View>
);
