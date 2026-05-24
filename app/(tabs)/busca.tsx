import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryCard } from '../../components/search/CategoryCard';
import { CategoryListView } from '../../components/search/CategoryListView';
import { HierarchicalSearchBar } from '../../components/search/HierarchicalSearchBar';
import { colors, fonts } from '../../constants/colors';
import { CatalogService } from '../../services/catalog';
import type { Category } from '../../types';

export default function BuscaScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categories = CatalogService.getCategories();

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
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 }}>
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
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14 }}>
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
            12 segmentos
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'space-between',
          }}
        >
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} onPress={() => setSelectedCategory(c)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
