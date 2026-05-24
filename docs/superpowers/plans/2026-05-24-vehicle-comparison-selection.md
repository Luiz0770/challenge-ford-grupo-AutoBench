# Vehicle Comparison Selection — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the comparison page to start with empty slots, add a per-slot remove button, and disable already-selected vehicles in the picker modal.

**Architecture:** Four targeted file edits — `buildCompareRows` in the catalog service is extended to accept null vehicles (enabling partial matrix display); `VehicleSlot` becomes a unified empty/filled card; `SwapSheet` receives an `excludedId` prop; `comparar.tsx` removes the pre-selected defaults, adds a `handleRemove` handler, and wires the new props through.

**Tech Stack:** React Native, Expo 56, TypeScript, `@expo/vector-icons` Feather icons, Jest

**Spec:** `docs/superpowers/specs/2026-05-24-vehicle-comparison-selection-design.md`

---

## File Map

| File | What changes |
|------|-------------|
| `services/catalog.ts` | `buildCompareRows` accepts `Vehicle \| null` for both params |
| `components/compare/VehicleSlot.tsx` | Handles `vehicle \| null`, empty-state card, X remove button |
| `components/compare/SwapSheet.tsx` | `excludedId?: string` prop, disabled/greyed item |
| `app/(tabs)/comparar.tsx` | Null init, `handleRemove`, conditional sections, new prop wiring |
| `__tests__/services/catalog.test.ts` | Unit tests for null-vehicle `buildCompareRows` behavior |

---

## Task 1: Extend `buildCompareRows` to accept null vehicles

**Files:**
- Modify: `services/catalog.ts:98-124`
- Test: `__tests__/services/catalog.test.ts`

- [ ] **Step 1: Write the failing test**

Open `__tests__/services/catalog.test.ts` and add the following block (after any existing `describe` blocks):

```typescript
describe('CatalogService.buildCompareRows — null vehicle support', () => {
  it('returns [] when both vehicles are null', () => {
    const rows = CatalogService.buildCompareRows('motorizacao', null, null);
    expect(rows).toEqual([]);
  });

  it('returns rows with "—" on the b-side when b is null', () => {
    const fakeA = {
      id: 'fake-a',
      sections: [
        {
          id: 'engine',
          specs: [{ label: 'Potência', value: '300', unit: 'cv' }],
        },
      ],
    } as any;

    const rows = CatalogService.buildCompareRows('motorizacao', fakeA, null);

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].b).toBe('—');
    expect(rows[0].nullB).toBe(true);
    expect(rows[0].w).toBeNull();
  });

  it('returns rows with "—" on the a-side when a is null', () => {
    const fakeB = {
      id: 'fake-b',
      sections: [
        {
          id: 'engine',
          specs: [{ label: 'Potência', value: '250', unit: 'cv' }],
        },
      ],
    } as any;

    const rows = CatalogService.buildCompareRows('motorizacao', null, fakeB);

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].a).toBe('—');
    expect(rows[0].nullA).toBe(true);
    expect(rows[0].w).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

```
npx jest __tests__/services/catalog.test.ts --no-coverage
```

Expected: TypeScript compile error or runtime TypeError — `buildCompareRows` currently requires non-null `Vehicle` arguments.

- [ ] **Step 3: Replace `buildCompareRows` in `services/catalog.ts`**

Find the method at line 98 and replace lines 98–124 with:

```typescript
buildCompareRows(category: CompareCategoryId, a: Vehicle | null, b: Vehicle | null): CompareRow[] {
  if (!a && !b) return [];
  const sectionIds = compareCategoryMap[category] ?? [];
  const aSpecs = a ? collectSpecs(a, sectionIds) : new Map<string, string>();
  const bSpecs = b ? collectSpecs(b, sectionIds) : new Map<string, string>();
  const keys = unionLabels(aSpecs, bSpecs);

  return keys.map((label) => {
    const av = a ? (aSpecs.get(label) ?? 'Não Disponível') : '—';
    const bv = b ? (bSpecs.get(label) ?? 'Não Disponível') : '—';
    const nullA = !a || av === 'Não Disponível';
    const nullB = !b || bv === 'Não Disponível';
    const aNum = parseNum(av);
    const bNum = parseNum(bv);
    const isNum = aNum !== null && bNum !== null;
    let winner: CompareRow['w'] = null;
    if (a && b) {
      if (isNum && aNum !== bNum) winner = aNum > bNum ? 'a' : 'b';
      else if (isNum && aNum === bNum) winner = 'tie';
      else if (av === bv) winner = 'tie';
    }
    return { k: label, a: av, b: bv, w: winner, num: isNum, nullA, nullB };
  });
},
```

- [ ] **Step 4: Run the test and confirm it passes**

```
npx jest __tests__/services/catalog.test.ts --no-coverage
```

Expected: PASS — 3 tests passing.

- [ ] **Step 5: Verify TypeScript**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add services/catalog.ts __tests__/services/catalog.test.ts
git commit -m "feat: make buildCompareRows accept null vehicles for partial comparison"
```

---

## Task 2: Update `VehicleSlot` — empty state and remove button

**Files:**
- Modify: `components/compare/VehicleSlot.tsx`

- [ ] **Step 1: Replace the entire file content**

```typescript
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import type { Vehicle } from '../../types';
import { fmtBRLFromReais } from '../../utils/format';

interface VehicleSlotProps {
  vehicle: Vehicle | null;
  side: 'A' | 'B';
  onSwap: () => void;
  onRemove: () => void;
  fipeAvg?: number;
}

export const VehicleSlot: React.FC<VehicleSlotProps> = ({
  vehicle,
  side,
  onSwap,
  onRemove,
  fipeAvg,
}) => {
  const accent = side === 'A' ? colors.brand.blue : colors.status.warning;
  const accentBg =
    side === 'A' ? 'rgba(0,102,204,0.08)' : 'rgba(180,83,9,0.08)';

  const SideBadge = (
    <View
      style={{
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        backgroundColor: accentBg,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.monoBold,
          fontSize: 9,
          color: accent,
          letterSpacing: 1.2,
        }}
      >
        {side}
      </Text>
    </View>
  );

  if (!vehicle) {
    return (
      <Pressable
        onPress={onSwap}
        style={({ pressed }) => ({
          flex: 1,
          backgroundColor: colors.bg.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.bg.border,
          borderStyle: 'dashed',
          padding: 12,
          opacity: pressed ? 0.85 : 1,
          minHeight: 140,
        })}
      >
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          {SideBadge}
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 12,
          }}
        >
          <Feather name="plus-circle" size={22} color={colors.text.muted} />
          <Text
            style={{
              fontFamily: fonts.sans,
              fontSize: 11,
              color: colors.text.muted,
              textAlign: 'center',
              lineHeight: 15,
            }}
          >
            Selecione um veículo{'\n'}para comparar
          </Text>
        </View>
      </Pressable>
    );
  }

  const fipe = fipeAvg ?? vehicle.priceInCents / 100;

  return (
    <Pressable
      onPress={onSwap}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.bg.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.bg.border,
        padding: 12,
        opacity: pressed ? 0.95 : 1,
        shadowColor: '#101828',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
      })}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        {SideBadge}
        <Text
          style={{
            fontFamily: fonts.monoMedium,
            fontSize: 9,
            color: colors.text.muted,
            letterSpacing: 1,
            textTransform: 'uppercase',
            flex: 1,
            textAlign: 'center',
          }}
        >
          {vehicle.brand}
        </Text>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Feather name="x-circle" size={14} color={colors.text.muted} />
        </Pressable>
      </View>

      <Text
        style={{
          fontFamily: fonts.sansBold,
          fontSize: 14,
          color: colors.brand.navy,
          letterSpacing: -0.3,
          lineHeight: 17,
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
          minHeight: 30,
        }}
        numberOfLines={2}
      >
        {vehicle.version}
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
          marginBottom: 10,
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
          {vehicle.year}
        </Text>
        <Text
          style={{
            fontFamily: fonts.monoSemibold,
            fontSize: 11.5,
            color: colors.text.primary,
          }}
        >
          {fmtBRLFromReais(fipe)}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.bg.canvas,
          borderWidth: 1,
          borderColor: colors.bg.borderStrong,
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 7,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Feather name="repeat" size={12} color={colors.brand.blue} />
        <Text
          style={{
            fontFamily: fonts.sansMedium,
            fontSize: 11.5,
            color: colors.brand.navy,
          }}
        >
          Trocar
        </Text>
      </View>
    </Pressable>
  );
};
```

- [ ] **Step 2: Verify TypeScript**

```
npx tsc --noEmit
```

Expected: No errors for `VehicleSlot`. (There will be errors in `comparar.tsx` because `onRemove` is not yet passed — those are fixed in Task 4.)

- [ ] **Step 3: Commit**

```bash
git add components/compare/VehicleSlot.tsx
git commit -m "feat: add empty state and remove button to VehicleSlot"
```

---

## Task 3: Add `excludedId` to `SwapSheet`

**Files:**
- Modify: `components/compare/SwapSheet.tsx`

- [ ] **Step 1: Update the props interface and destructuring**

Replace lines 9–16:

```typescript
interface SwapSheetProps {
  open: boolean;
  side: 'a' | 'b' | null;
  onClose: () => void;
  onPick: (entry: CategoryVehicleEntry) => void;
  excludedId?: string;
}

export const SwapSheet: React.FC<SwapSheetProps> = ({
  open,
  side,
  onClose,
  onPick,
  excludedId,
}) => {
```

- [ ] **Step 2: Update the alternatives list to disable the excluded item**

Replace the `alternatives.map` block (lines 102–161) with:

```tsx
{alternatives.map((v) => {
  const isExcluded = v.vehicleId === excludedId;
  return (
    <Pressable
      key={v.vehicleId}
      onPress={isExcluded ? undefined : () => onPick(v)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 10,
        opacity: isExcluded ? 0.4 : pressed ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          backgroundColor: colors.bg.elevated,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name="truck" size={18} color={colors.brand.navy} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontFamily: fonts.sansSemibold,
            fontSize: 13.5,
            color: colors.text.primary,
            letterSpacing: -0.2,
          }}
        >
          {v.brand} {v.model}
        </Text>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 11.5,
            color: colors.text.secondary,
            marginTop: 1,
          }}
          numberOfLines={1}
        >
          {isExcluded
            ? `${v.version} · ${v.year} · Já selecionado`
            : `${v.version} · ${v.year}`}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.text.secondary,
        }}
      >
        {fmtBRLFromReais(v.fipe)}
      </Text>
    </Pressable>
  );
})}
```

- [ ] **Step 3: Verify TypeScript**

```
npx tsc --noEmit
```

Expected: No errors for `SwapSheet`.

- [ ] **Step 4: Commit**

```bash
git add components/compare/SwapSheet.tsx
git commit -m "feat: disable already-selected vehicle in SwapSheet picker"
```

---

## Task 4: Update `comparar.tsx` — wire everything together

**Files:**
- Modify: `app/(tabs)/comparar.tsx`

- [ ] **Step 1: Replace state initialization — remove default pair**

Find and replace lines 32–34:

```typescript
// Before
const defaultPair = CatalogService.getCompareDefaultPair();
const [a, setA] = useState<Vehicle | null>(defaultPair.a);
const [b, setB] = useState<Vehicle | null>(defaultPair.b);

// After
const [a, setA] = useState<Vehicle | null>(null);
const [b, setB] = useState<Vehicle | null>(null);
```

- [ ] **Step 2: Update the `rows` memo to support partial state**

Replace line 42–45:

```typescript
const rows = useMemo(
  () => (a || b ? CatalogService.buildCompareRows(cat, a, b) : []),
  [cat, a?.id, b?.id],
);
```

- [ ] **Step 3: Add `handleRemove` after `handlePick`**

After the closing `};` of `handlePick` (around line 61), add:

```typescript
const handleRemove = (slot: 'a' | 'b') => {
  if (slot === 'a') setA(null);
  else setB(null);
};
```

- [ ] **Step 4: Remove the early return guard (lines 63–105)**

Delete the entire block:

```typescript
if (!a || !b || !verdict) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
      <View ...>
        <Feather name="git-pull-request" ... />
        <Text ...>Comparar em breve</Text>
        <Text ...>Adicione veículos ao catálogo...</Text>
      </View>
    </SafeAreaView>
  );
}
```

- [ ] **Step 5: Pass `onRemove` to both `VehicleSlot` usages**

Find both `<VehicleSlot` blocks and update them:

```tsx
<VehicleSlot
  vehicle={a}
  side="A"
  onSwap={() => setSwap("a")}
  onRemove={() => handleRemove("a")}
  fipeAvg={aPrice?.valor ?? aMarket?.market.fipeAvg}
/>
<VehicleSlot
  vehicle={b}
  side="B"
  onSwap={() => setSwap("b")}
  onRemove={() => handleRemove("b")}
  fipeAvg={bPrice?.valor ?? bMarket?.market.fipeAvg}
/>
```

- [ ] **Step 6: Wrap the matrix section with a conditional and fix the labels**

Find the `{/* Matriz comparativa */}` View and wrap its entire contents with `{(a || b) && (...)}`. Also update the `CompareMatrix` labels to handle null:

```tsx
{(a || b) && (
  <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 4,
      }}
    >
      <SectionLabel>Matriz comparativa</SectionLabel>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 6, paddingBottom: 12 }}
    >
      {CATEGORY_TABS.map((c) => {
        const isActive = c.id === cat;
        return (
          <Pressable
            key={c.id}
            onPress={() => setCat(c.id)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: isActive
                ? colors.brand.navy
                : colors.bg.surface,
              borderWidth: 1,
              borderColor: isActive
                ? colors.brand.navy
                : colors.bg.borderStrong,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Feather
              name={c.icon}
              size={13}
              color={isActive ? colors.bg.surface : colors.text.secondary}
            />
            <Text
              style={{
                fontFamily: fonts.sansMedium,
                fontSize: 12.5,
                color: isActive ? colors.bg.surface : colors.text.primary,
              }}
            >
              {c.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>

    <CompareMatrix
      rows={rows}
      aLabel={a ? `${a.brand} ${a.model}` : 'Slot A'}
      bLabel={b ? `${b.brand} ${b.model}` : 'Slot B'}
    />
  </View>
)}
```

- [ ] **Step 7: Wrap the verdict section with a conditional**

Find the `{/* Veredito do Oráculo */}` View and wrap it:

```tsx
{verdict && (
  <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 4,
      }}
    >
      <SectionLabel>Veredito do Oráculo</SectionLabel>
      <Text
        style={{
          fontFamily: fonts.monoSemibold,
          fontSize: 9.5,
          color: colors.brand.blue,
        }}
      >
        BETA
      </Text>
    </View>
    <VerdictCard verdict={verdict} />
  </View>
)}
```

- [ ] **Step 8: Wrap the footer with a conditional**

Find the `{/* Rodapé técnico */}` View and wrap it:

```tsx
{(a || b) && (
  <View
    style={{
      paddingHorizontal: 20,
      paddingTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    }}
  >
    <Feather name="activity" size={11} color={colors.text.muted} />
    <Text
      style={{
        fontFamily: fonts.mono,
        fontSize: 9.5,
        color: colors.text.muted,
        letterSpacing: 0.4,
      }}
    >
      Análise cruzada · 4 categorias · {rows.length} atributos
    </Text>
  </View>
)}
```

- [ ] **Step 9: Pass `excludedId` to `SwapSheet`**

Find the `<SwapSheet` at the bottom and update it:

```tsx
<SwapSheet
  open={!!swap}
  side={swap}
  onClose={() => setSwap(null)}
  onPick={handlePick}
  excludedId={swap === 'a' ? b?.id : a?.id}
/>
```

- [ ] **Step 10: Verify TypeScript**

```
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 11: Commit**

```bash
git add "app/(tabs)/comparar.tsx"
git commit -m "feat: empty initial slots, remove vehicle handler, and duplicate prevention in comparar"
```

---

## Verification checklist

After all tasks, manually verify:

- [ ] Page opens with two empty dashed slot cards (no pre-selected vehicles)
- [ ] Tapping an empty slot card opens `SwapSheet`
- [ ] Selecting a vehicle fills that slot
- [ ] The filled slot shows brand, model, version, year, price, and "Trocar" button
- [ ] The filled slot has a visible "X" icon in the top-right corner
- [ ] Tapping "X" clears the slot back to empty
- [ ] With one slot filled, the matrix section appears with the filled column's real data and "—" on the empty side
- [ ] With one slot filled, the verdict section is hidden
- [ ] Opening the picker for the second slot shows the first slot's vehicle greyed out with "Já selecionado" label
- [ ] Attempting to tap the greyed-out item does nothing
- [ ] With both slots filled, the matrix and verdict sections render normally
