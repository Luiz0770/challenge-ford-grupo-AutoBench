import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { colors, fonts } from '../../constants/colors';
import type { VehicleMarket } from '../../types';
import { fmtBRLFromReais, fmtPct } from '../../utils/format';

interface MarketBandProps {
  market: VehicleMarket;
  fipeCode: string;
  fipeMonth: string;
}

const SPARK_W = 80;
const SPARK_H = 22;

export const MarketBand: React.FC<MarketBandProps> = ({ market, fipeCode, fipeMonth }) => {
  const pts = market.sparkline;
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const span = Math.max(0.0001, max - min);
  const points = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * SPARK_W;
      const y = SPARK_H - ((p - min) / span) * SPARK_H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const lastX = SPARK_W;
  const lastY = SPARK_H - ((pts[pts.length - 1] - min) / span) * SPARK_H;
  const up = market.delta30 >= 0;

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
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text
              style={{
                fontFamily: fonts.monoMedium,
                fontSize: 9,
                color: colors.text.secondary,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
              }}
            >
              Tabela FIPE
            </Text>
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                backgroundColor: 'rgba(0,102,204,0.08)',
                borderRadius: 3,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.monoSemibold,
                  fontSize: 9,
                  color: colors.brand.blue,
                  letterSpacing: 0.5,
                }}
              >
                {fipeCode}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 9,
              color: colors.text.muted,
            }}
          >
            Ref. {fipeMonth}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: fonts.monoBold,
                fontSize: 22,
                color: colors.brand.navy,
                letterSpacing: -0.6,
                lineHeight: 22,
              }}
            >
              {fmtBRLFromReais(market.fipeAvg)}
            </Text>
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 11,
                color: colors.text.secondary,
                marginTop: 4,
              }}
            >
              preço médio · {market.offers} ofertas ativas
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Svg width={SPARK_W} height={SPARK_H + 4}>
              <Polyline
                points={points}
                fill="none"
                stroke={colors.brand.blue}
                strokeWidth={1.6}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <Circle cx={lastX} cy={lastY} r={2.5} fill={colors.brand.blue} />
            </Svg>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
              <Feather
                name={up ? 'trending-up' : 'trending-down'}
                size={11}
                color={up ? colors.status.success : colors.status.warning}
              />
              <Text
                style={{
                  fontFamily: fonts.monoSemibold,
                  fontSize: 11,
                  color: up ? colors.status.success : colors.status.warning,
                }}
              >
                {fmtPct(market.delta30, true)}
              </Text>
              <Text style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.text.muted }}>30d</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12 }}>
        <Text
          style={{
            fontFamily: fonts.monoMedium,
            fontSize: 9,
            color: colors.text.secondary,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Concorrentes diretos · {market.ranking.segment}
        </Text>
        <View style={{ gap: 6 }}>
          {market.competitors.map((c) => {
            const cUp = c.delta >= 0;
            return (
              <View
                key={c.name}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 12.5,
                    color: colors.text.primary,
                    flex: 1,
                    marginRight: 8,
                  }}
                  numberOfLines={1}
                >
                  {c.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 11.5,
                      color: colors.text.secondary,
                    }}
                  >
                    {fmtBRLFromReais(c.fipe)}
                  </Text>
                  <View
                    style={{
                      backgroundColor: cUp
                        ? 'rgba(15,118,110,0.08)'
                        : 'rgba(180,83,9,0.08)',
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      borderRadius: 3,
                      minWidth: 48,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.monoSemibold,
                        fontSize: 10.5,
                        color: cUp ? colors.status.success : colors.status.warning,
                        textAlign: 'right',
                      }}
                    >
                      {fmtPct(c.delta, true)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
