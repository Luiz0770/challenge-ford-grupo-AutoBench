import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { Wordmark } from '../../components/ui/Wordmark';
import { colors, fonts } from '../../constants/colors';
import { CatalogService } from '../../services/catalog';
import { useUserStore } from '../../store/userStore';
import { fmtBRLFromReais } from '../../utils/format';

export default function HomeScreen() {
  const router = useRouter();
  const favorites = useUserStore((s) => s.favorites);
  const history = useUserStore((s) => s.history);

  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);

  const matches = useMemo(() => CatalogService.getSuggestions(q), [q]);

  const recentTrimmed = history.slice(0, 3);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 18,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Wordmark />
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.bg.surface,
              borderWidth: 1,
              borderColor: colors.bg.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="user" size={17} color={colors.brand.navy} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 18 }}>
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 28,
              lineHeight: 32,
              color: colors.brand.navy,
              letterSpacing: -0.8,
              marginBottom: 6,
            }}
          >
            Qual veículo{'\n'}vamos analisar hoje?
          </Text>
          <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text.secondary, lineHeight: 20 }}>
            Especificações determinísticas + sinais preditivos do{' '}
            <Text style={{ fontFamily: fonts.sansSemibold, color: colors.brand.navy }}>Oráculo</Text>.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: colors.bg.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: focused ? colors.brand.blue : colors.bg.borderStrong,
              paddingHorizontal: 14,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              shadowColor: focused ? colors.brand.blue : '#101828',
              shadowOpacity: focused ? 0.18 : 0.04,
              shadowRadius: focused ? 8 : 2,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <Feather name="search" size={18} color={colors.text.secondary} />
            <TextInput
              value={q}
              onChangeText={setQ}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Busque por marca, modelo ou versão"
              placeholderTextColor={colors.text.muted}
              style={{
                flex: 1,
                fontFamily: fonts.sans,
                fontSize: 15,
                color: colors.text.primary,
                letterSpacing: -0.2,
                padding: 0,
              }}
            />
            <View style={{ width: 1, height: 18, backgroundColor: colors.bg.borderStrong }} />
            <Feather name="mic" size={18} color={colors.brand.blue} />
          </View>

          {matches.length > 0 && (
            <Card style={{ marginTop: 8, padding: 0, overflow: 'hidden' }}>
              {matches.map((m, i) => (
                <Pressable
                  key={`${m.vehicleId}-${i}`}
                  onPress={() => router.push(`/vehicle/${m.vehicleId}`)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 11,
                    borderTopWidth: i > 0 ? 1 : 0,
                    borderTopColor: colors.divider,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Feather name="search" size={14} color={colors.text.muted} />
                  <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text.primary }}>
                    <Text style={{ fontFamily: fonts.sansSemibold }}>{m.brand}</Text> {m.model}
                  </Text>
                </Pressable>
              ))}
            </Card>
          )}

          <View style={{ marginTop: 14, flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
            <Chip label="Marca" active />
            <Chip
              label="Modelo"
              trailing={<Feather name="chevron-down" size={12} color={colors.text.secondary} />}
            />
            <Chip
              label="Versão"
              trailing={<Feather name="chevron-down" size={12} color={colors.text.secondary} />}
            />
            <Chip
              label="Ano"
              trailing={<Feather name="chevron-down" size={12} color={colors.text.secondary} />}
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <SectionLabel>Favoritos · sincronizados</SectionLabel>
            <Text style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.text.secondary }}>
              {favorites.length}
            </Text>
          </View>
          {favorites.length === 0 ? (
            <Card style={{ padding: 16 }}>
              <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.text.secondary }}>
                Toque em qualquer veículo e marque com a estrela para vê-lo aqui.
              </Text>
            </Card>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {favorites.slice(0, 4).map((f) => (
                <FavoriteTile
                  key={f.vehicleId}
                  vehicleId={f.vehicleId}
                  name={f.vehicleName}
                  onPress={() => router.push(`/vehicle/${f.vehicleId}`)}
                />
              ))}
            </View>
          )}
        </View>

        {recentTrimmed.length > 0 && (
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <View style={{ marginBottom: 10 }}>
              <SectionLabel>Buscas recentes</SectionLabel>
            </View>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              {recentTrimmed.map((h, i) => (
                <Pressable
                  key={h.vehicleId}
                  onPress={() => router.push(`/vehicle/${h.vehicleId}`)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                    borderTopWidth: i > 0 ? 1 : 0,
                    borderTopColor: colors.divider,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: colors.bg.elevated,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name="clock" size={15} color={colors.text.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: fonts.sansSemibold,
                        fontSize: 14,
                        color: colors.text.primary,
                      }}
                    >
                      {h.vehicleName}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.sans,
                        fontSize: 11,
                        color: colors.text.secondary,
                        marginTop: 2,
                      }}
                    >
                      {new Date(h.viewedAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.text.muted} />
                </Pressable>
              ))}
            </Card>
          </View>
        )}

        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 28,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Feather name="database" size={11} color={colors.text.muted} />
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 9.5,
              color: colors.text.muted,
              letterSpacing: 0.4,
            }}
          >
            12.847 veículos · FIPE · ANFAVEA · OEMs
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const FavoriteTile: React.FC<{ vehicleId: string; name: string; onPress: () => void }> = ({
  vehicleId,
  name,
  onPress,
}) => {
  const meta = CatalogService.getVehicleMeta(vehicleId);
  const fipe = meta?.market.fipeAvg ?? 0;
  const parts = name.split(' ');
  const brand = parts[0] ?? '';
  const rest = parts.slice(1).join(' ');

  return (
    <Card style={{ flexBasis: '48%', flexGrow: 1, padding: 12 }} onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <Feather name="star" size={14} color={colors.brand.blue} />
        <Feather name="arrow-up-right" size={14} color={colors.text.muted} />
      </View>
      <Text
        style={{
          fontFamily: fonts.monoMedium,
          fontSize: 9,
          color: colors.text.secondary,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {brand}
      </Text>
      <Text
        style={{
          fontFamily: fonts.sansSemibold,
          fontSize: 14,
          color: colors.brand.navy,
          letterSpacing: -0.3,
          lineHeight: 17,
        }}
      >
        {rest}
      </Text>
      <View
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderStyle: 'dashed',
          borderTopColor: colors.bg.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            color: colors.text.muted,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          FIPE
        </Text>
        <Text
          style={{
            fontFamily: fonts.monoSemibold,
            fontSize: 12,
            color: colors.text.primary,
          }}
        >
          {fipe ? fmtBRLFromReais(fipe) : '—'}
        </Text>
      </View>
    </Card>
  );
};
