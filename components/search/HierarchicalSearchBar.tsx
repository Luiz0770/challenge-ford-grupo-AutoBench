import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { CatalogService } from '../../services/catalog';
import { Card } from '../ui/Card';

interface HierarchicalSearchBarProps {
  onExactSearch: (vehicleId: string) => void;
  onBroadSearch: (brand: string, model: string, version: string | null, year: number | null) => void;
}

export const HierarchicalSearchBar: React.FC<HierarchicalSearchBarProps> = ({
  onExactSearch,
  onBroadSearch,
}) => {
  const [modelQuery, setModelQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<{ brand: string; model: string } | null>(
    null
  );
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);

  const suggestions = useMemo(
    () => (selectedModel ? [] : CatalogService.searchGrouped(modelQuery)),
    [modelQuery, selectedModel]
  );

  const versions = useMemo(
    () =>
      selectedModel
        ? CatalogService.getModelVersionStrings(selectedModel.brand, selectedModel.model)
        : [],
    [selectedModel]
  );

  const years = useMemo(
    () =>
      selectedModel
        ? CatalogService.getModelYears(selectedModel.brand, selectedModel.model)
        : [],
    [selectedModel]
  );

  const handleSelectModel = (brand: string, model: string) => {
    setSelectedModel({ brand, model });
    setModelQuery(`${brand} ${model}`);
    setSelectedVersion(null);
    setSelectedYear(null);
  };

  const handleClear = () => {
    setModelQuery('');
    setSelectedModel(null);
    setSelectedVersion(null);
    setSelectedYear(null);
  };

  const handleSearch = () => {
    if (!selectedModel) return;
    if (selectedVersion && selectedYear) {
      const id = CatalogService.findExactVehicle(
        selectedModel.brand,
        selectedModel.model,
        selectedVersion,
        selectedYear
      );
      if (id) {
        onExactSearch(id);
        return;
      }
    }
    onBroadSearch(selectedModel.brand, selectedModel.model, selectedVersion, selectedYear);
  };

  const isDisabled = !selectedModel;

  return (
    <View>
      {/* Model text input */}
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
          elevation: focused ? 4 : 1,
        }}
      >
        <Feather name="search" size={18} color={colors.text.secondary} />
        <TextInput
          value={modelQuery}
          onChangeText={(text) => {
            setModelQuery(text);
            if (selectedModel) {
              setSelectedModel(null);
              setSelectedVersion(null);
              setSelectedYear(null);
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Busque por marca ou modelo"
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
        {modelQuery.length > 0 && (
          <Pressable
            onPress={handleClear}
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

      {/* Deduplicated autocomplete */}
      {suggestions.length > 0 && (
        <Card style={{ marginTop: 8, padding: 0, overflow: 'hidden' }}>
          {suggestions.map((s, i) => (
            <Pressable
              key={s.key}
              onPress={() => handleSelectModel(s.brand, s.model)}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 11,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: colors.divider,
                }}
              >
                <Feather name="search" size={14} color={colors.text.muted} />
                <Text
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 14,
                    color: colors.text.primary,
                    flex: 1,
                  }}
                >
                  <Text style={{ fontFamily: fonts.sansSemibold }}>{s.brand}</Text> {s.model}
                </Text>
                <Feather name="arrow-up-right" size={13} color={colors.text.muted} />
              </View>
            </Pressable>
          ))}
        </Card>
      )}

      {/* Version and Year dropdowns — side by side */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: isDisabled ? colors.bg.elevated : colors.bg.surface,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.bg.borderStrong,
            paddingHorizontal: 12,
            paddingVertical: 11,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={() => { if (!isDisabled) setShowVersionModal(true); }}
            style={{ flex: 1, marginRight: 6 }}
          >
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 13,
                color: selectedVersion ? colors.text.primary : colors.text.muted,
              }}
              numberOfLines={1}
            >
              {selectedVersion ?? 'Versão'}
            </Text>
          </Pressable>
          {selectedVersion && !isDisabled ? (
            <Pressable onPress={() => setSelectedVersion(null)} hitSlop={8}>
              <Feather name="x" size={14} color={colors.text.secondary} />
            </Pressable>
          ) : (
            <Feather
              name="chevron-down"
              size={14}
              color={isDisabled ? colors.text.muted : colors.text.secondary}
            />
          )}
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: isDisabled ? colors.bg.elevated : colors.bg.surface,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.bg.borderStrong,
            paddingHorizontal: 12,
            paddingVertical: 11,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={() => { if (!isDisabled) setShowYearModal(true); }}
            style={{ flex: 1, marginRight: 6 }}
          >
            <Text
              style={{
                fontFamily: fonts.sans,
                fontSize: 13,
                color: selectedYear != null ? colors.text.primary : colors.text.muted,
              }}
            >
              {selectedYear ?? 'Ano'}
            </Text>
          </Pressable>
          {selectedYear != null && !isDisabled ? (
            <Pressable onPress={() => setSelectedYear(null)} hitSlop={8}>
              <Feather name="x" size={14} color={colors.text.secondary} />
            </Pressable>
          ) : (
            <Feather
              name="chevron-down"
              size={14}
              color={isDisabled ? colors.text.muted : colors.text.secondary}
            />
          )}
        </View>
      </View>

      {/* Search button — only visible when model is selected */}
      {selectedModel && (
        <Pressable
          onPress={handleSearch}
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <View
            style={{
              marginTop: 12,
              backgroundColor: colors.brand.blue,
              borderRadius: 10,
              paddingVertical: 13,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Text style={{ fontFamily: fonts.sansSemibold, fontSize: 14, color: '#fff' }}>
              Buscar
            </Text>
            <Feather name="arrow-right" size={14} color="#fff" />
          </View>
        </Pressable>
      )}

      {/* Version picker sheet */}
      <Modal visible={showVersionModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
            onPress={() => setShowVersionModal(false)}
          />
          <View
            style={{
              backgroundColor: colors.bg.surface,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingTop: 12,
              paddingBottom: 32,
              maxHeight: '60%',
            }}
          >
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.bg.borderStrong,
                alignSelf: 'center',
                marginBottom: 16,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.sansSemibold,
                fontSize: 14,
                color: colors.text.primary,
                paddingHorizontal: 20,
                marginBottom: 8,
              }}
            >
              Versão
            </Text>
            <FlatList
              data={versions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedVersion(item);
                    setShowVersionModal(false);
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderTopWidth: 1,
                      borderTopColor: colors.divider,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text.primary }}>
                      {item}
                    </Text>
                    {selectedVersion === item && (
                      <Feather name="check" size={14} color={colors.brand.blue} />
                    )}
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Year picker sheet */}
      <Modal visible={showYearModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
            onPress={() => setShowYearModal(false)}
          />
          <View
            style={{
              backgroundColor: colors.bg.surface,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingTop: 12,
              paddingBottom: 32,
              maxHeight: '60%',
            }}
          >
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.bg.borderStrong,
                alignSelf: 'center',
                marginBottom: 16,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.sansSemibold,
                fontSize: 14,
                color: colors.text.primary,
                paddingHorizontal: 20,
                marginBottom: 8,
              }}
            >
              Ano
            </Text>
            <FlatList
              data={years}
              keyExtractor={(item) => String(item)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedYear(item);
                    setShowYearModal(false);
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderTopWidth: 1,
                      borderTopColor: colors.divider,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text.primary }}>
                      {item}
                    </Text>
                    {selectedYear === item && (
                      <Feather name="check" size={14} color={colors.brand.blue} />
                    )}
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
