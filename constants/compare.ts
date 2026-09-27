import { colors } from './colors';

export type CompareSide = 'a' | 'b';

// Identidade visual dos lados A e B na comparação
export const SIDE: Record<
  CompareSide,
  { label: 'A' | 'B'; color: string; bg: string; border: string }
> = {
  a: {
    label: 'A',
    color: colors.brand.blue,
    bg: 'rgba(0,102,204,0.08)',
    border: 'rgba(0,102,204,0.35)',
  },
  b: {
    label: 'B',
    color: colors.status.warning,
    bg: 'rgba(180,83,9,0.08)',
    border: 'rgba(180,83,9,0.35)',
  },
};
