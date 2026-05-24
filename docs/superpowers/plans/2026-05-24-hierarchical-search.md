# Hierarchical Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat vehicle autocomplete with a two-step hierarchical search (model → version/year dropdowns) that routes directly to a vehicle detail page or to a model results listing.

**Architecture:** New query functions in `VehicleDataService` power a shared `HierarchicalSearchBar` component used in both `index.tsx` and `busca.tsx`. A new `app/model-results.tsx` screen handles broad (model-only) searches, reusing the extracted `VehicleListRow` component. All navigation passes through `onExactSearch` / `onBroadSearch` props so the component stays route-agnostic.

**Tech Stack:** React Native, Expo Router, TypeScript, Jest (`npm test`)

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `services/vehicleData.ts` | Add 6 new query functions |
| Modify | `__tests__/services/vehicleData.test.ts` | Extend with tests for the 6 new functions |
| Modify | `services/catalog.ts` | Add thin wrappers for new functions |
| Create | `components/search/VehicleListRow.tsx` | Extracted shared row component |
| Modify | `components/search/CategoryListView.tsx` | Import VehicleListRow from new file |
| Create | `components/search/HierarchicalSearchBar.tsx` | Two-step search bar with dropdowns |
| Create | `app/model-results.tsx` | Model results listing screen |
| Modify | `app/_layout.tsx` | Register model-results route |
| Modify | `app/(tabs)/busca.tsx` | Swap search UI for HierarchicalSearchBar |
| Modify | `app/(tabs)/index.tsx` | Swap search UI for HierarchicalSearchBar |

---

### Task 1: Extend VehicleDataService with new query functions

**Files:**
- Modify: `services/vehicleData.ts`
- Modify: `__tests__/services/vehicleData.test.ts`

- [ ] **Step 1: Append new test cases to `__tests__/services/vehicleData.test.ts`**

Add the following blocks at the end of the existing file (after line 50, keep all existing tests):

```typescript
describe('VehicleDataService.searchGrouped', () => {
  it('deduplicates brand+model results', () => {
    const results = VehicleDataService.searchGrouped('ranger');
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({ brand: 'Ford', model: 'Ranger', key: 'Ford|Ranger' });
  });

  it('returns empty array for empty query', () => {
    expect(VehicleDataService.searchGrouped('')).toHaveLength(0);
  });

  it('matches on brand name', () => {
    const results = VehicleDataService.searchGrouped('ford');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].brand).toBe('Ford');
  });
});

describe('VehicleDataService.getModelVersionStrings', () => {
  it('returns unique version strings for a brand+model', () => {
    const versions = VehicleDataService.getModelVersionStrings('Ford', 'Ranger');
    expect(versions).toContain('Raptor');
    expect(versions).toContain('Limited');
    expect(versions).toContain('XLS');
    expect(new Set(versions).size).toBe(versions.length);
  });

  it('returns empty array for unknown brand+model', () => {
    expect(VehicleDataService.getModelVersionStrings('Unknown', 'Car')).toHaveLength(0);
  });
});

describe('VehicleDataService.getModelYears', () => {
  it('returns unique years sorted descending', () => {
    const years = VehicleDataService.getModelYears('Ford', 'Ranger');
    expect(years).toContain(2024);
    expect(new Set(years).size).toBe(years.length);
    for (let i = 0; i < years.length - 1; i++) {
      expect(years[i]).toBeGreaterThanOrEqual(years[i + 1]);
    }
  });

  it('returns empty array for unknown brand+model', () => {
    expect(VehicleDataService.getModelYears('Unknown', 'Car')).toHaveLength(0);
  });
});

describe('VehicleDataService.findExactVehicle', () => {
  it('returns vehicleId for exact match', () => {
    const id = VehicleDataService.findExactVehicle('Ford', 'Ranger', 'Raptor', 2024);
    expect(id).toBe('ford-ranger-raptor-2024');
  });

  it('returns null when year does not match', () => {
    const id = VehicleDataService.findExactVehicle('Ford', 'Ranger', 'Raptor', 2020);
    expect(id).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to confirm the new cases fail**

```bash
npm test -- --testPathPattern=vehicleData --no-coverage
```

Expected: Existing tests pass. New tests FAIL with `is not a function`.

- [ ] **Step 3: Add 6 new functions to `services/vehicleData.ts`**

Inside the `VehicleDataService` object in `services/vehicleData.ts`, after the existing `search` function (after line 61), add:

```typescript
  getVersionsByModel(brand: string, model: string): CategoryVehicleEntry[] {
    return vehicles
      .filter((v) => v.brand === brand && v.model === model)
      .map((v) => ({
        vehicleId: v.id,
        brand: v.brand,
        model: v.model,
        version: v.version,
        year: v.year,
      }));
  },

  searchByBrandModelFipeCodes(
    brandFipeCode: string,
    modelFipeCode: string
  ): CategoryVehicleEntry[] {
    return vehicles
      .filter(
        (v) => v.brandFipeCode === brandFipeCode && v.modelFipeCode === modelFipeCode
      )
      .map((v) => ({
        vehicleId: v.id,
        brand: v.brand,
        model: v.model,
        version: v.version,
        year: v.year,
      }));
  },

  searchGrouped(query: string): { brand: string; model: string; key: string }[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const seen = new Set<string>();
    const results: { brand: string; model: string; key: string }[] = [];
    for (const v of vehicles) {
      if (v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)) {
        const key = `${v.brand}|${v.model}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ brand: v.brand, model: v.model, key });
        }
        if (results.length >= 6) break;
      }
    }
    return results;
  },

  getModelVersionStrings(brand: string, model: string): string[] {
    return [
      ...new Set(
        vehicles
          .filter((v) => v.brand === brand && v.model === model)
          .map((v) => v.version)
      ),
    ];
  },

  getModelYears(brand: string, model: string): number[] {
    return [
      ...new Set(
        vehicles
          .filter((v) => v.brand === brand && v.model === model)
          .map((v) => v.year)
      ),
    ].sort((a, b) => b - a);
  },

  findExactVehicle(
    brand: string,
    model: string,
    version: string,
    year: number
  ): string | null {
    const found = vehicles.find(
      (v) =>
        v.brand === brand &&
        v.model === model &&
        v.version === version &&
        v.year === year
    );
    return found?.id ?? null;
  },
```

- [ ] **Step 4: Run all tests to confirm everything passes**

```bash
npm test -- --testPathPattern=vehicleData --no-coverage
```

Expected: All tests PASS (existing + new).

- [ ] **Step 5: Commit**

```bash
git add services/vehicleData.ts __tests__/services/vehicleData.test.ts
git commit -m "feat: add hierarchical search query functions to VehicleDataService"
```

---

### Task 2: Add CatalogService wrappers

**Files:**
- Modify: `services/catalog.ts`

- [ ] **Step 1: Add wrappers inside the `CatalogService` object in `services/catalog.ts`**

After the `getSuggestions` function (after line 54), add:

```typescript
  searchGrouped(query: string) {
    return VehicleDataService.searchGrouped(query);
  },

  getModelVersionStrings(brand: string, model: string) {
    return VehicleDataService.getModelVersionStrings(brand, model);
  },

  getModelYears(brand: string, model: string) {
    return VehicleDataService.getModelYears(brand, model);
  },

  findExactVehicle(brand: string, model: string, version: string, year: number) {
    return VehicleDataService.findExactVehicle(brand, model, version, year);
  },

  getModelVehicles(brand: string, model: string) {
    return VehicleDataService.getVersionsByModel(brand, model);
  },
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add services/catalog.ts
git commit -m "feat: expose hierarchical search methods on CatalogService"
```

---

### Task 3: Extract VehicleListRow to its own file

**Files:**
- Create: `components/search/VehicleListRow.tsx`
- Modify: `components/search/CategoryListView.tsx`

- [ ] **Step 1: Create `components/search/VehicleListRow.tsx`**

```tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { useFipePrice } from '../../hooks/useFipePrice';
import { VehicleDataService } from '../../services/vehicleData';
import type { Category, CategoryVehicleEntry } from '../../types';
import { fmtBRLFromReais } from '../../utils/format';

export const VehicleListRow: React.FC<{
  vehicle: CategoryVehicleEntry;
  category: Category;
  isFirst: boolean;
  onPress: () => void;
}> = ({ vehicle, category, isFirst, onPress }) => {
  const vehicleObj = VehicleDataService.getVehicleById(vehicle.vehicleId);
  const { price, loading } = useFipePrice(vehicleObj);
  const fipe = price?.valor;

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
          {loading ? '...' : fipe != null ? fmtBRLFromReais(fipe) : 'Indisponível'}
        </Text>
      </View>
    </Pressable>
  );
};
```

- [ ] **Step 2: Update `components/search/CategoryListView.tsx`**

At the top of `CategoryListView.tsx`, add the import:

```tsx
import { VehicleListRow } from './VehicleListRow';
```

Then delete the local `VehicleListRow` definition (lines 196–303 in the original file — the entire `const VehicleListRow: React.FC<{...}> = ...` block at the bottom). The component is used by name in the `sorted.map(...)` above and will resolve to the imported one.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/search/VehicleListRow.tsx components/search/CategoryListView.tsx
git commit -m "refactor: extract VehicleListRow to its own file"
```

---

### Task 4: Create HierarchicalSearchBar component

**Files:**
- Create: `components/search/HierarchicalSearchBar.tsx`

- [ ] **Step 1: Create `components/search/HierarchicalSearchBar.tsx`**

```tsx
import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { CatalogService } from '../../services/catalog';
import { Card } from '../ui/Card';

interface HierarchicalSearchBarProps {
  onExactSearch: (vehicleId: string) => void;
  onBroadSearch: (brand: string, model: string) => void;
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
    onBroadSearch(selectedModel.brand, selectedModel.model);
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
            </Pressable>
          ))}
        </Card>
      )}

      {/* Version and Year dropdowns — side by side */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <Pressable
          onPress={() => { if (!isDisabled) setShowVersionModal(true); }}
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
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.sans,
              fontSize: 13,
              color: selectedVersion ? colors.text.primary : colors.text.muted,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {selectedVersion ?? 'Versão'}
          </Text>
          <Feather
            name="chevron-down"
            size={14}
            color={isDisabled ? colors.text.muted : colors.text.secondary}
          />
        </Pressable>

        <Pressable
          onPress={() => { if (!isDisabled) setShowYearModal(true); }}
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
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.sans,
              fontSize: 13,
              color: selectedYear ? colors.text.primary : colors.text.muted,
            }}
          >
            {selectedYear ?? 'Ano'}
          </Text>
          <Feather
            name="chevron-down"
            size={14}
            color={isDisabled ? colors.text.muted : colors.text.secondary}
          />
        </Pressable>
      </View>

      {/* Search button — only visible when model is selected */}
      {selectedModel && (
        <Pressable
          onPress={handleSearch}
          style={({ pressed }) => ({
            marginTop: 12,
            backgroundColor: colors.brand.blue,
            borderRadius: 10,
            paddingVertical: 13,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ fontFamily: fonts.sansSemibold, fontSize: 14, color: '#fff' }}>
            Buscar
          </Text>
          <Feather name="arrow-right" size={14} color="#fff" />
        </Pressable>
      )}

      {/* Version picker sheet */}
      <Modal visible={showVersionModal} transparent animationType="slide">
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
          onPress={() => setShowVersionModal(false)}
        >
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
                  style={({ pressed }) => ({
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderTopWidth: 1,
                    borderTopColor: colors.divider,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text.primary }}>
                    {item}
                  </Text>
                  {selectedVersion === item && (
                    <Feather name="check" size={14} color={colors.brand.blue} />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Year picker sheet */}
      <Modal visible={showYearModal} transparent animationType="slide">
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
          onPress={() => setShowYearModal(false)}
        >
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
                  style={({ pressed }) => ({
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderTopWidth: 1,
                    borderTopColor: colors.divider,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text.primary }}>
                    {item}
                  </Text>
                  {selectedYear === item && (
                    <Feather name="check" size={14} color={colors.brand.blue} />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/search/HierarchicalSearchBar.tsx
git commit -m "feat: create HierarchicalSearchBar with model autocomplete and version/year dropdowns"
```

---

### Task 5: Create model-results screen and register route

**Files:**
- Create: `app/model-results.tsx`
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Create `app/model-results.tsx`**

```tsx
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
  const { brand, model } = useLocalSearchParams<{ brand: string; model: string }>();

  const vehicles = useMemo(
    () => CatalogService.getModelVehicles(brand ?? '', model ?? ''),
    [brand, model]
  );

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
                Voltar
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
```

- [ ] **Step 2: Register route in `app/_layout.tsx`**

Inside the `<Stack>` block, after the `vehicle/[id]` `<Stack.Screen>`, add:

```tsx
<Stack.Screen name="model-results" options={{ animation: 'slide_from_right' }} />
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/model-results.tsx app/_layout.tsx
git commit -m "feat: add model-results screen for broad model search navigation"
```

---

### Task 6: Update busca.tsx

**Files:**
- Modify: `app/(tabs)/busca.tsx`

- [ ] **Step 1: Replace the entire contents of `app/(tabs)/busca.tsx`**

```tsx
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
            onBroadSearch={(brand, model) =>
              router.push({ pathname: '/model-results', params: { brand, model } })
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(tabs)/busca.tsx"
git commit -m "feat: replace flat search with HierarchicalSearchBar in busca screen"
```

---

### Task 7: Update index.tsx

**Files:**
- Modify: `app/(tabs)/index.tsx`

- [ ] **Step 1: Replace the entire contents of `app/(tabs)/index.tsx`**

```tsx
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HierarchicalSearchBar } from '../../components/search/HierarchicalSearchBar';
import { Card } from '../../components/ui/Card';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { Wordmark } from '../../components/ui/Wordmark';
import { colors, fonts } from '../../constants/colors';
import { useFipePrice } from '../../hooks/useFipePrice';
import { VehicleDataService } from '../../services/vehicleData';
import { useUserStore } from '../../store/userStore';
import { fmtBRLFromReais } from '../../utils/format';

export default function HomeScreen() {
  const router = useRouter();
  const favorites = useUserStore((s) => s.favorites);
  const history = useUserStore((s) => s.history);

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
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <HierarchicalSearchBar
            onExactSearch={(vehicleId) => router.push(`/vehicle/${vehicleId}`)}
            onBroadSearch={(brand, model) =>
              router.push({ pathname: '/model-results', params: { brand, model } })
            }
          />
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
            <SectionLabel>Favoritos</SectionLabel>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const FavoriteTile: React.FC<{ vehicleId: string; name: string; onPress: () => void }> = ({
  vehicleId,
  name,
  onPress,
}) => {
  const vehicle = VehicleDataService.getVehicleById(vehicleId);
  const { price, loading } = useFipePrice(vehicle);
  const fipe = price?.valor ?? 0;
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
          {loading ? '...' : fipe ? fmtBRLFromReais(fipe) : 'Indisponível'}
        </Text>
      </View>
    </Card>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Run full test suite**

```bash
npm test -- --no-coverage
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add "app/(tabs)/index.tsx"
git commit -m "feat: replace flat search with HierarchicalSearchBar in home screen"
```
