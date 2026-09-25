import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeader } from '../../components/home/SectionHeader';
import { CategoryCard } from '../../components/search/CategoryCard';
import { CategoryListView } from '../../components/search/CategoryListView';
import { HierarchicalSearchBar } from '../../components/search/HierarchicalSearchBar';
import { PressableScale } from '../../components/ui/PressableScale';
import { Rise } from '../../components/ui/Rise';
import { colors, fonts } from '../../constants/colors';
import { CatalogService } from '../../services/catalog';
import { VehicleDataService } from '../../services/vehicleData';
import type { Category } from '../../types';

const BRANDS_COLLAPSED = 12;

export default function BuscaScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const { categoria } = useLocalSearchParams<{ categoria?: string }>();

  const categories = CatalogService.getAvailableCategories();
  const totals = VehicleDataService.getTotals();
  const allBrands = VehicleDataService.getBrands();
  const brands = showAllBrands ? allBrands : allBrands.slice(0, BRANDS_COLLAPSED);

  // Aberta a partir da home (/busca?categoria=suv): mostra a categoria direto e
  // limpa o parâmetro para que o mesmo atalho funcione de novo depois
  useEffect(() => {
    if (!categoria) return;
    const category = CatalogService.getCategoryById(categoria);
    if (category) setSelectedCategory(category);
    router.setParams({ categoria: undefined });
  }, [categoria, router]);

  if (selectedCategory) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <CategoryListView
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
            onSelect={(vehicleId) => router.push(`/vehicle/${vehicleId}`)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Rise style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 }}>
          <HierarchicalSearchBar
            onExactSearch={(vehicleId) => router.push(`/vehicle/${vehicleId}`)}
            onBroadSearch={(brand, model, version, year) =>
              router.push({
                pathname: '/model-results',
                params: {
                  brand,
                  model,
                  ...(version ? { version } : {}),
                  ...(year != null ? { year: String(year) } : {}),
                },
              })
            }
          />
        </Rise>

        <Rise delay={60} style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14 }}>
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 22,
              color: colors.brand.navy,
              letterSpacing: -0.5,
              lineHeight: 24,
            }}
          >
            Categorias
          </Text>
          <Text
            style={{
              fontFamily: fonts.monoMedium,
              fontSize: 9.5,
              color: colors.text.secondary,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginTop: 6,
            }}
          >
            {categories.length} segmentos · {totals.vehicles} veículos catalogados
          </Text>
        </Rise>

        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
            rowGap: 10,
            justifyContent: 'space-between',
          }}
        >
          {categories.map((c, i) => (
            <CategoryCard
              key={c.id}
              category={c}
              index={i}
              onPress={() => setSelectedCategory(c)}
            />
          ))}
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
          <Rise delay={500} style={{ marginBottom: 10 }}>
            <SectionHeader
              title="Marcas no catálogo"
              action={
                allBrands.length > BRANDS_COLLAPSED
                  ? showAllBrands
                    ? 'Ver menos'
                    : 'Ver todas'
                  : undefined
              }
              onAction={() => setShowAllBrands((v) => !v)}
            />
          </Rise>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {brands.map((b, i) => (
              <Rise key={b.name} delay={540 + Math.min(i, 12) * 25}>
                <PressableScale
                  accessibilityLabel={`${b.name}, ${b.count} veículos`}
                  onPress={() =>
                    router.push({ pathname: '/brand-results', params: { brand: b.name } })
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    backgroundColor: colors.bg.surface,
                    borderWidth: 1,
                    borderColor: colors.bg.borderStrong,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.sansMedium,
                      fontSize: 12.5,
                      color: colors.text.primary,
                    }}
                  >
                    {b.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.monoSemibold,
                      fontSize: 9.5,
                      color: colors.text.secondary,
                    }}
                  >
                    {b.count}
                  </Text>
                </PressableScale>
              </Rise>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
