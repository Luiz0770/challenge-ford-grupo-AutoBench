# Vehicle Comparison Selection — Design Spec

**Date:** 2026-05-24  
**Status:** Approved  
**Scope:** `app/(tabs)/comparar.tsx`, `components/compare/VehicleSlot.tsx`, `components/compare/SwapSheet.tsx`, `services/catalog.ts`

---

## Problem

The comparison page currently pre-loads two vehicles on mount (`ford-ranger-raptor-2024` and `ford-ranger-limited-2024`) via `CatalogService.getCompareDefaultPair()`. There is no way to clear a slot, and the vehicle picker allows selecting the same vehicle in both slots.

---

## Acceptance Criteria

1. **Empty initial state** — No vehicle is pre-selected on page load.
2. **Remove vehicle** — A filled slot has an "X" button that clears it back to empty.
3. **Duplicate prevention** — A vehicle already in one slot is visually disabled in the other slot's picker.

---

## Approach: Unified VehicleSlot with `vehicle | null`

### Why this approach

`VehicleSlot` is semantically a *slot*, which can be empty or filled. Expressing both states in one component is coherent and minimizes the number of files changed (4 files). No new abstractions are needed.

---

## Section 1 — State & Data Flow (`comparar.tsx`)

### Changes

- Remove `CatalogService.getCompareDefaultPair()` call.
- Initialize both slots as `null`:
  ```typescript
  const [a, setA] = useState<Vehicle | null>(null);
  const [b, setB] = useState<Vehicle | null>(null);
  ```
- Add remove handlers:
  ```typescript
  const handleRemove = (slot: 'a' | 'b') => {
    if (slot === 'a') setA(null);
    else setB(null);
  };
  ```
- Pass `excludedId` to `SwapSheet`: the ID of the vehicle in the *opposite* slot (or `undefined` when the opposite slot is also empty).
- Pass `onRemove` to each `VehicleSlot`.

### Verdict & CompareMatrix behavior

- `verdict` memo already returns `null` when either slot is null — no change needed. `VerdictCard` is naturally hidden.
- `rows` memo updated: shows partial matrix when one slot is filled, hides matrix when both are empty (see Section 3).

---

## Section 2 — `VehicleSlot` Component

### Updated props interface

```typescript
interface VehicleSlotProps {
  vehicle: Vehicle | null;
  side: 'A' | 'B';
  onSwap: () => void;    // opens picker (used in both states)
  onRemove: () => void;  // clears slot (only active when filled)
  fipeAvg?: number;
}
```

### Empty state (`vehicle === null`)

- Renders a placeholder card matching the existing card dimensions.
- Centered layout: `+` icon (Ionicons `add-circle-outline`) + text "Selecione um veículo para comparar".
- Tapping anywhere on the card calls `onSwap` to open `SwapSheet`.
- Side badge (A / B) is still displayed so the user knows which slot is which.

### Filled state (`vehicle !== null`)

- Existing layout is preserved unchanged.
- Adds an `Ionicons` `close-circle` icon button in the top-right corner of the card.
- Tapping the "X" calls `onRemove`.
- The existing "Trocar" button remains; it also calls `onSwap`.

---

## Section 3 — `SwapSheet` (duplicate prevention) and `CompareMatrix` (partial state)

### SwapSheet

New prop:

```typescript
excludedId?: string;
```

In the vehicle list, any item where `entry.vehicleId === excludedId` is rendered with:
- Reduced opacity (`0.4`)
- `disabled` touch handler (press does nothing)
- Optional label "Já selecionado" or a lock icon for clarity

The vehicle is not removed from the list — it stays visible so the user understands the constraint.

### CompareMatrix / `CatalogService.buildCompareRows`

Current signature: `buildCompareRows(cat, a: Vehicle, b: Vehicle)`  
New signature: `buildCompareRows(cat, a: Vehicle | null, b: Vehicle | null)`

Behavior:
| a | b | result |
|---|---|--------|
| filled | filled | existing behavior — compare both |
| filled | null | rows built from `a` only; `b`-side cells show `"—"`, `nullB: true`, no winner |
| null | filled | rows built from `b` only; `a`-side cells show `"—"`, `nullA: true`, no winner |
| null | null | returns `[]` → `CompareMatrix` renders nothing |

`CompareRow.nullA` and `CompareRow.nullB` fields already exist in the type — they are used by `CompareMatrix` to style empty cells. No type changes needed.

---

## Files Changed

| File | Change |
|------|--------|
| `app/(tabs)/comparar.tsx` | Remove default pair init; add `handleRemove`; pass `onRemove` and `excludedId` |
| `components/compare/VehicleSlot.tsx` | Accept `vehicle \| null`; render empty/filled states; add "X" button |
| `components/compare/SwapSheet.tsx` | Accept `excludedId?`; disable matching list item |
| `services/catalog.ts` | `buildCompareRows` accepts `Vehicle \| null` for both params |

---

## Out of Scope

- Persisting selected vehicles across sessions (no local storage or Zustand changes)
- Adding more than 2 comparison slots
- Changing the vehicle catalog source (`compare.json` alternatives list unchanged)
