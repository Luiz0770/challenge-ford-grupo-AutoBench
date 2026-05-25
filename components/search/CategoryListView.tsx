import { Feather } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { CatalogService } from '../../services/catalog';
import type { Category } from '../../types';
import { VehicleListRow } from './VehicleListRow';

interface CategoryListViewProps {
  category: Category;
  onBack: () => void;
  onSelect: (vehicleId: string) => void;
}

export const CategoryListView: React.FC<CategoryListViewProps> = ({ category, onBack, onSelect }) => {
  const vehicles = CatalogService.getCategoryVehicles(category.id);
  const sorted = useMemo(() => [...vehicles], [vehicles]);

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
                Categorias
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
