import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { useFipePrice } from '../../hooks/useFipePrice';
import { CatalogService } from '../../services/catalog';
import { VehicleDataService } from '../../services/vehicleData';
import type { Category, CategoryVehicleEntry } from '../../types';
import { fmtBRLFromReais } from '../../utils/format';

type SortKey = 'relevance' | 'price-asc' | 'price-desc';

interface CategoryListViewProps {
  category: Category;
  onBack: () => void;
  onSelect: (vehicleId: string) => void;
}

export const CategoryListView: React.FC<CategoryListViewProps> = ({ category, onBack, onSelect }) => {
  const [sort, setSort] = useState<SortKey>('relevance');
  const vehicles = CatalogService.getCategoryVehicles(category.id);

  const sorted = useMemo(() => {
    const arr = [...vehicles];
    if (sort === 'price-asc') arr.sort((a, b) => a.fipe - b.fipe);
    if (sort === 'price-desc') arr.sort((a, b) => b.fipe - a.fipe);
    return arr;
  }, [sort, vehicles]);

  return (
    <View>
      <View
        style={{
          backgroundColor: category.color,
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
            color: category.accent,
            opacity: 0.13,
            letterSpacing: -6,
          }}
        >
          {category.code}
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
            onPress={onBack}
            style={({ pressed }) => ({
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
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Feather name="chevron-left" size={14} color={colors.bg.surface} />
            <Text style={{ fontFamily: fonts.sansMedium, fontSize: 12, color: colors.bg.surface }}>
              Categorias
            </Text>
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
              {category.count}
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
          Categoria
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
          {category.label}
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
          {sorted.length} veículos com matriz completa de especificações
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 14, gap: 6 }}
      >
        {(
          [
            { id: 'relevance', label: 'Relevância' },
            { id: 'price-asc', label: 'Menor preço' },
            { id: 'price-desc', label: 'Maior preço' },
          ] as { id: SortKey; label: string }[]
        ).map((opt) => {
          const active = sort === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => setSort(opt.id)}
              style={({ pressed }) => ({
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 999,
                backgroundColor: active ? colors.brand.navy : colors.bg.surface,
                borderWidth: 1,
                borderColor: active ? colors.brand.navy : colors.bg.borderStrong,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: fonts.sansMedium,
                  fontSize: 12,
                  color: active ? colors.bg.surface : colors.text.primary,
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

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
          {sorted.length === 0 ? (
            <View style={{ paddingVertical: 32, alignItems: 'center' }}>
              <Feather name="layers" size={28} color={colors.text.muted} />
              <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.text.secondary, marginTop: 10 }}>
                Nenhum veículo catalogado nesta categoria ainda.
              </Text>
            </View>
          ) : (
            sorted.map((v, i) => (
              <VehicleListRow
                key={v.vehicleId}
                vehicle={v}
                category={category}
                isFirst={i === 0}
                onPress={() => onSelect(v.vehicleId)}
              />
            ))
          )}
        </View>
      </View>

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
          {sorted.length} de {category.count} · ficha técnica determinística
        </Text>
      </View>
    </View>
  );
};

const VehicleListRow: React.FC<{
  vehicle: CategoryVehicleEntry;
  category: Category;
  isFirst: boolean;
  onPress: () => void;
}> = ({ vehicle, category, isFirst, onPress }) => {
  const vehicleObj = VehicleDataService.getVehicleById(vehicle.vehicleId);
  const { price, loading } = useFipePrice(vehicleObj);
  const fipe = price?.valor ?? vehicle.fipe;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderTopWidth: isFirst ? 0 : 1,
        borderTopColor: colors.divider,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 9,
          backgroundColor: category.color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: fonts.monoBold,
            fontSize: 11,
            color: category.accent,
            letterSpacing: 0.5,
          }}
        >
          {category.code}
        </Text>
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontFamily: fonts.monoMedium,
            fontSize: 9,
            color: colors.text.secondary,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {vehicle.brand}
        </Text>
        <Text
          style={{
            fontFamily: fonts.sansSemibold,
            fontSize: 14,
            color: colors.text.primary,
            letterSpacing: -0.2,
            marginTop: 1,
          }}
        >
          {vehicle.model}
        </Text>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 11.5,
            color: colors.text.secondary,
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {vehicle.version} · {vehicle.year}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            color: colors.text.muted,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          FIPE
        </Text>
        <Text
          style={{
            fontFamily: fonts.monoSemibold,
            fontSize: 12,
            color: colors.brand.navy,
            marginTop: 2,
          }}
        >
          {loading ? '...' : fmtBRLFromReais(fipe)}
        </Text>
      </View>
    </Pressable>
  );
};
