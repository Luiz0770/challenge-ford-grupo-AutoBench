import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryCard } from '../../components/search/CategoryCard';
import { CategoryListView } from '../../components/search/CategoryListView';
import { Card } from '../../components/ui/Card';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { colors, fonts } from '../../constants/colors';
import { CatalogService } from '../../services/catalog';
import type { Category } from '../../types';

export default function BuscaScreen() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categories = CatalogService.getCategories();

  const matches = useMemo(() => CatalogService.getSuggestions(q), [q]);

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
          <View
            style={{
              backgroundColor: colors.bg.surface,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: focused ? colors.brand.blue : colors.bg.borderStrong,
              paddingHorizontal: 16,
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
            <Feather name="search" size={18} color={colors.brand.navy} />
            <TextInput
              value={q}
              onChangeText={setQ}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Maverick FX4 em 2 segundos"
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
            {q.length > 0 && (
              <Pressable
                onPress={() => setQ('')}
                hitSlop={8}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: colors.bg.elevated,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="x" size={11} color={colors.text.secondary} />
              </Pressable>
            )}
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
                  <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text.primary, flex: 1 }}>
                    <Text style={{ fontFamily: fonts.sansSemibold }}>{m.brand}</Text> {m.model}
                  </Text>
                  <Feather name="arrow-up-right" size={13} color={colors.text.muted} />
                </Pressable>
              ))}
            </Card>
          )}
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
