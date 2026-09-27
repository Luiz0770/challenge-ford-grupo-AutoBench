import type { PartStatus, Platform, SystemId } from '../types';

export interface SpecRef {
  section: string;
  label: string;
  /** Prefixo exibido antes do valor no detalhe da peça (ex.: "Traseira: ") */
  prefix?: string;
}

export interface SystemDef {
  id: SystemId;
  label: string;
  hint: string;
  /** Spec que dá nome à peça; se ausente/indisponível, o veículo não gera peça */
  name: SpecRef;
  /** Specs do detalhe, unidas por " · "; as ausentes são omitidas */
  detail: SpecRef[];
}

export const SYSTEMS: SystemDef[] = [
  {
    id: 'motor',
    label: 'Motor',
    hint: 'Bloco, cilindrada e alimentação',
    name: { section: 'engine', label: 'Motor' },
    detail: [{ section: 'engine', label: 'Potência' }],
  },
  {
    id: 'cambio',
    label: 'Transmissão',
    hint: 'Câmbio e número de marchas',
    name: { section: 'transmission', label: 'Transmissão' },
    detail: [],
  },
  {
    id: 'tracao',
    label: 'Tração',
    hint: 'Sistema de tração e reduzida',
    name: { section: 'transmission', label: 'Tração' },
    detail: [{ section: 'transmission', label: 'Caixa de Transferência' }],
  },
  {
    id: 'susp',
    label: 'Suspensão',
    hint: 'Dianteira e traseira',
    name: { section: 'suspension', label: 'Suspensão Dianteira' },
    detail: [{ section: 'suspension', label: 'Suspensão Traseira', prefix: 'Traseira: ' }],
  },
  {
    id: 'freios',
    label: 'Freios',
    hint: 'Discos, tambores e assistências',
    name: { section: 'suspension', label: 'Freios Dianteiros' },
    detail: [{ section: 'suspension', label: 'Freios Traseiros', prefix: 'Traseiros: ' }],
  },
  {
    id: 'rodas',
    label: 'Rodas e pneus',
    hint: 'Aro e pneus',
    name: { section: 'wheels', label: 'Aro' },
    detail: [{ section: 'wheels', label: 'Pneus' }],
  },
  {
    id: 'interior',
    label: 'Interior',
    hint: 'Multimídia e infotainment',
    name: { section: 'tech', label: 'Central Multimídia' },
    detail: [{ section: 'tech', label: 'Sistema de Infotainment' }],
  },
];

export const PLATFORMS: { id: Platform; label: string; desc: string }[] = [
  {
    id: 'mono',
    label: 'Monobloco',
    desc: 'Carroceria integrada ao chassi. Mais leve, foco em conforto.',
  },
  {
    id: 'chassi',
    label: 'Chassi sobre longarinas',
    desc: 'Estrutura separada. Mais robusta, foco em carga e off-road.',
  },
];

export const platformLabel = (id: Platform): string =>
  PLATFORMS.find((p) => p.id === id)?.label ?? id;

// Rótulo do status; sem veículo base, "Trocada" vira "Compatível"
export const statusLabel = (status: PartStatus, hasBase: boolean): string => {
  if (status === 'orig') return 'Original';
  if (status === 'adapt') return 'Requer adaptação';
  return hasBase ? 'Trocada' : 'Compatível';
};
