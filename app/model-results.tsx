import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VehicleListRow } from '../components/search/VehicleListRow';
import { colors, fonts } from '../constants/colors';
import { CatalogService } from '../services/catalog';
import { VehicleDataService } from '../services/vehicleData';

export default function ModelResultsScreen() {
  const router = useRouter();
  const { brand, model, version, year } = useLocalSearchParams<{
    brand: string;
    model: string;
    version?: string;
    year?: string;
  }>();

  const vehicles = useMemo(() => {
    const all = CatalogService.getModelVehicles(brand ?? '', model ?? '');
    if (version && year) return all.filter((v) => v.version === version && v.year === Number(year));
    if (version) return all.filter((v) => v.version === version);
    if (year) return all.filter((v) => v.year === Number(year));
    return all;
  }, [brand, model, version, year]);

  const categories = useMemo(() => CatalogService.getCategories(), []);

  const rowCategory = useMemo(() => {
    const firstFull = VehicleDataService.getVehicleById(vehicles[0]?.vehicleId ?? '');
    return (
      categories.find((c) => c.id === firstFull?.categoryId) ?? {
        id: 'unknown',
        label: '',
        code: '—',
        count: 0,
        color: colors.brand.navy,
        accent: '#FFFFFF',
      }
    );
  }, [vehicles, categories]);

  const modelCode = (model ?? '').slice(0, 3).toUpperCase();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.brand.navy,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 22,
            overflow: 'hidden',
          }}
        >
          <Text
            style={{
              position: 'absolute',
              bottom: -22,
              right: -6,
              fontFamily: fonts.monoBold,
              fontSize: 130,
              color: colors.brand.navyLight,
              opacity: 0.25,
              letterSpacing: -6,
            }}
          >
            {modelCode}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 6,
                  paddingLeft: 8,
                  paddingRight: 12,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.14)',
                }}
              >
                <Feather name="chevron-left" size={14} color={colors.bg.surface} />
                <Text style={{ fontFamily: fonts.sansMedium, fontSize: 12, color: colors.bg.surface }}>
                  Voltar
                </Text>
              </View>
            </Pressable>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingVertical: 4,
                paddingHorizontal: 9,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.12)',
              }}
            >
              <Feather name="sliders" size={11} color="rgba(255,255,255,0.7)" />
              <Text
                style={{
                  fontFamily: fonts.monoSemibold,
                  fontSize: 9.5,
                  color: colors.bg.surface,
                  letterSpacing: 0.4,
                }}
              >
                {vehicles.length}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontFamily: fonts.monoSemibold,
              fontSize: 9,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Modelo
          </Text>
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 28,
              color: colors.bg.surface,
              letterSpacing: -0.8,
              lineHeight: 30,
            }}
          >
            {brand} {model}
          </Text>
          <Text
            style={{
              fontFamily: fonts.sans,
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.72)',
              marginTop: 6,
              lineHeight: 17,
            }}
          >
            {vehicles.length} {vehicles.length === 1 ? 'versão disponível' : 'versões disponíveis'}
          </Text>
        </View>

        {/* List */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <View
            style={{
              backgroundColor: colors.bg.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.bg.border,
              overflow: 'hidden',
            }}
          >
            {vehicles.length === 0 ? (
              <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                <Feather name="layers" size={28} color={colors.text.muted} />
                <Text
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 13,
                    color: colors.text.secondary,
                    marginTop: 10,
                  }}
                >
                  Nenhuma versão catalogada para este modelo.
                </Text>
              </View>
            ) : (
              vehicles.map((v, i) => (
                <VehicleListRow
                  key={v.vehicleId}
                  vehicle={v}
                  category={rowCategory}
                  isFirst={i === 0}
                  onPress={() => router.push(`/vehicle/${v.vehicleId}`)}
                />
              ))
            )}
          </View>
        </View>

        {/* Footer */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
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
            {vehicles.length} {vehicles.length === 1 ? 'versão' : 'versões'} · ficha técnica
            determinística
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
