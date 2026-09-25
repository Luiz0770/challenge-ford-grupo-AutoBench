import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SortChips } from '../components/search/SortChips';
import { VehicleListRow } from '../components/search/VehicleListRow';
import { Rise } from '../components/ui/Rise';
import { colors, fonts } from '../constants/colors';
import { CatalogService } from '../services/catalog';
import { VehicleDataService } from '../services/vehicleData';
import type { Category } from '../types';
import { sortByName, type NameSort } from '../utils/sort';

// Sem a opção "Padrão": a ordem do catálogo não é significativa dentro de uma marca
const BRAND_SORT_OPTIONS: { id: NameSort; label: string }[] = [
  { id: 'name-asc', label: 'A–Z' },
  { id: 'name-desc', label: 'Z–A' },
];

const FALLBACK_CATEGORY: Category = {
  id: 'unknown',
  label: '',
  code: '—',
  count: 0,
  color: colors.brand.navy,
  accent: '#FFFFFF',
};

export default function BrandResultsScreen() {
  const router = useRouter();
  const { brand } = useLocalSearchParams<{ brand: string }>();
  const [sort, setSort] = useState<NameSort>('name-asc');

  const vehicles = useMemo(
    () => sortByName(VehicleDataService.getByBrand(brand ?? ''), sort),
    [brand, sort]
  );
  const modelCount = useMemo(() => new Set(vehicles.map((v) => v.model)).size, [vehicles]);

  const categoriesById = useMemo(
    () => new Map(CatalogService.getCategories().map((c) => [c.id, c])),
    []
  );
  const categoryOf = (vehicleId: string): Category =>
    categoriesById.get(VehicleDataService.getCategoryIdOf(vehicleId) ?? '') ?? FALLBACK_CATEGORY;

  const brandCode = (brand ?? '').slice(0, 3).toUpperCase();

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
            {brandCode}
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
            Marca
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
            {brand}
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
            {vehicles.length} {vehicles.length === 1 ? 'veículo' : 'veículos'} ·{' '}
            {modelCount} {modelCount === 1 ? 'modelo' : 'modelos'}
          </Text>
        </View>

        <SortChips value={sort} onChange={setSort} options={BRAND_SORT_OPTIONS} />

        {/* List */}
        <View style={{ paddingHorizontal: 16 }}>
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
                  Nenhum veículo catalogado para esta marca.
                </Text>
              </View>
            ) : (
              vehicles.map((v, i) => (
                <Rise key={`${sort}-${v.vehicleId}`} delay={Math.min(i, 10) * 40}>
                  <VehicleListRow
                    vehicle={v}
                    category={categoryOf(v.vehicleId)}
                    isFirst={i === 0}
                    onPress={() => router.push(`/vehicle/${v.vehicleId}`)}
                  />
                </Rise>
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
            {vehicles.length} {vehicles.length === 1 ? 'veículo' : 'veículos'} · ficha técnica
            determinística
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
