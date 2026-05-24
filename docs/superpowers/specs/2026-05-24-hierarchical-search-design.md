# Hierarchical Search — Design Spec

**Date:** 2026-05-24  
**Status:** Approved

---

## Problem

The current search bar returns one result per vehicle ID. If "Ford Ranger" has 3 versions and years, the autocomplete lists "Ford Ranger" three times. This creates noise and forces users to know the exact version upfront.

---

## Solution Overview

Replace the flat autocomplete with a two-step hierarchical search:

1. **Step 1 — Model input:** Deduplicated autocomplete grouped by brand + model.
2. **Step 2 — Optional filters:** Version and Year dropdowns, enabled only after a model is selected.
3. **Search button triggers one of two navigation paths depending on filter completeness.**

---

## Data Layer

New functions added to `services/catalog.ts` and `services/vehicleData.ts`:

| Function | Return | Purpose |
|---|---|---|
| `getGroupedModels(query)` | `{ brand, model, key }[]` | Deduplicated autocomplete list |
| `getModelVersions(brand, model)` | `string[]` | Version dropdown options |
| `getModelYears(brand, model)` | `number[]` | Year dropdown options |
| `findExactVehicle(brand, model, version, year)` | `string` (vehicleId) | Scenario A navigation |
| `getModelVehicles(brand, model)` | `CategoryVehicleEntry[]` | Scenario B results page |

**Deduplication key:** `"${brand}|${model}"` — ensures brands with same model name appear separately (e.g., "Honda City" and "Fiat City" would both appear if they existed).

---

## Component: `HierarchicalSearchBar`

**File:** `components/search/HierarchicalSearchBar.tsx`

### Internal State

| State | Type | Description |
|---|---|---|
| `modelQuery` | `string` | Text typed in the model input |
| `selectedModel` | `{ brand, model } \| null` | Set when user taps autocomplete suggestion |
| `selectedVersion` | `string \| null` | Optional version filter |
| `selectedYear` | `number \| null` | Optional year filter |
| `showVersionModal` | `boolean` | Controls version picker visibility |
| `showYearModal` | `boolean` | Controls year picker visibility |

### Props

```typescript
interface HierarchicalSearchBarProps {
  onExactSearch: (vehicleId: string) => void;
  onBroadSearch: (brand: string, model: string) => void;
}
```

### Layout

```
┌─────────────────────────────────────┐
│ 🔍  Ford Ranger                [✕] │  ← TextInput
└─────────────────────────────────────┘
┌──────────── autocomplete ───────────┐
│  🔍  Ford Ranger           ↗       │  ← visible while typing, hidden after selection
└─────────────────────────────────────┘
┌─────────────────┐ ┌─────────────────┐
│  Versão      ∨  │ │  Ano         ∨  │  ← disabled until model selected; side by side
└─────────────────┘ └─────────────────┘
         ┌────────────────────┐
         │      Buscar →      │           ← visible only when model selected
         └────────────────────┘
```

### Interaction Rules

- Typing in the model input shows deduplicated autocomplete (up to 6 results).
- Tapping a suggestion: sets `selectedModel`, clears `modelQuery` display to `"${brand} ${model}"`, hides autocomplete, enables dropdowns.
- Clearing the input (✕): resets all state including `selectedModel`, `selectedVersion`, `selectedYear`.
- Dropdowns use a native `Modal` + `FlatList` sheet. No external libraries.
- Version and Year dropdowns are independent — selecting one does not require the other.

### Search Button Logic

```
if (selectedModel && selectedVersion && selectedYear):
  vehicleId = findExactVehicle(brand, model, version, year)
  onExactSearch(vehicleId)
else if (selectedModel):
  onBroadSearch(brand, model)
```

Partial filters (version without year, or year without version): treated as broad search.

---

## New Screen: `app/model-results.tsx`

### Route

Navigated to via:
```typescript
router.push({ pathname: '/model-results', params: { brand: 'Ford', model: 'Ranger' } })
```

Receives params with `useLocalSearchParams<{ brand: string; model: string }>()`.

### Header

- Background: `colors.brand.navy`
- Back button (← Voltar) top left
- Label: `"MODELO"` in mono uppercase, muted white
- Title: `"Ford Ranger"` large bold white
- Subtitle: `"N versões disponíveis"` in semi-transparent white
- Large faded code text (decorative background element, same as CategoryListView)

### List

`VehicleListRow` is currently a local component inside `CategoryListView.tsx`. As part of this work it will be extracted to `components/search/VehicleListRow.tsx` and imported by both `CategoryListView` and `model-results`.

Each row receives its own `category` object looked up via `CatalogService.getCategories()` filtered by the vehicle's `categoryId`. This correctly handles the (currently hypothetical) case where a model spans multiple categories.

### Footer

Same as `CategoryListView`: vehicle count + "ficha técnica determinística".

### Item Press

`router.push('/vehicle/' + vehicleId)` — identical to current navigation.

---

## Modified Screens

### `app/(tabs)/busca.tsx`

- **Remove:** Current `TextInput` block, `matches` state, `getSuggestions` call, autocomplete card.
- **Add:** `<HierarchicalSearchBar onExactSearch={...} onBroadSearch={...} />`
- **Unchanged:** Category grid, `CategoryListView` state and rendering.

### `app/(tabs)/index.tsx`

- **Remove:** Current `TextInput` block, `matches` state, `getSuggestions` call, autocomplete card, and the four decorative `<Chip>` filters (Marca, Modelo, Versão, Ano).
- **Add:** `<HierarchicalSearchBar onExactSearch={...} onBroadSearch={...} />`
- **Unchanged:** Favorites section, recent history section, wordmark header.

---

## Files Changed

| Action | File |
|---|---|
| Create | `components/search/HierarchicalSearchBar.tsx` |
| Create | `components/search/VehicleListRow.tsx` (extracted from CategoryListView) |
| Create | `app/model-results.tsx` |
| Modify | `services/catalog.ts` |
| Modify | `services/vehicleData.ts` |
| Modify | `components/search/CategoryListView.tsx` (import VehicleListRow) |
| Modify | `app/(tabs)/busca.tsx` |
| Modify | `app/(tabs)/index.tsx` |

---

## Out of Scope

- Voice search (mic button in index.tsx remains but is not wired)
- Filtering by brand alone without model
- Pagination on the model results page
- Sorting options in dropdowns
