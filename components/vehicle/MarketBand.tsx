import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { fmtBRLFromReais } from '../../utils/format';

interface MarketBandProps {
  fipeCode: string;
  fipeMonth: string;
  fipeAvg: number;
  modelo?: string;
  loading: boolean;
  error: boolean;
}

export const MarketBand: React.FC<MarketBandProps> = ({
  fipeCode,
  fipeMonth,
  fipeAvg,
  modelo,
  loading,
  error,
}) => (
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
      <Text style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.text.muted }}>
        Ref. {fipeMonth}
      </Text>
    </View>

    <View style={{ paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14 }}>
      {loading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <ActivityIndicator size="small" color={colors.brand.blue} />
          <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text.secondary }}>
            Consultando FIPE...
          </Text>
        </View>
      ) : (
        <>
          <Text
            style={{
              fontFamily: fonts.monoBold,
              fontSize: 28,
              color: colors.brand.navy,
              letterSpacing: -0.6,
              lineHeight: 30,
              marginBottom: modelo ? 4 : 10,
            }}
          >
            {fmtBRLFromReais(fipeAvg)}
          </Text>
          {modelo ? (
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 11.5,
                color: colors.text.secondary,
                marginBottom: 10,
              }}
              numberOfLines={1}
            >
              {modelo}
            </Text>
          ) : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Feather
              name={error ? 'alert-circle' : 'check-circle'}
              size={11}
              color={error ? colors.status.warning : colors.status.success}
            />
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 10,
                color: error ? colors.status.warning : colors.text.secondary,
              }}
            >
              {error ? 'Usando preço de referência local' : 'Preço oficial FIPE · ao vivo'}
            </Text>
          </View>
        </>
      )}
    </View>
  </View>
);
