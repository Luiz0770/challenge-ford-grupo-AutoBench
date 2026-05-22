import React, { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { colors } from '../../constants/colors';
import { useFipeBrands } from '../../hooks/useFipe';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { FipeBrand } from '../../types';

interface BrandSelectorProps {
  onSelect: (brand: FipeBrand) => void;
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({ onSelect }) => {
  const { brands, loading, error } = useFipeBrands();
  const [query, setQuery] = useState('');

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.status.danger, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  const filtered = brands.filter((b) =>
    b.nome.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar marca..."
        placeholderTextColor={colors.text.muted}
        style={{
          backgroundColor: colors.bg.surface,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: colors.text.primary,
          fontSize: 15,
          borderWidth: 1,
          borderColor: colors.bg.border,
          marginBottom: 12,
        }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.codigo}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelect(item)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.bg.border,
            })}
          >
            <Text style={{ color: colors.text.primary, fontSize: 15 }}>{item.nome}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};
