import { colors } from './colors';

interface BrandHeaderColor {
  color: string;
  accent: string;
}

// Cor de fundo do cabeçalho da listagem por marca + tom claro para o glow/
// watermark. Marcas com logo colorido: cor predominante do PNG, escurecida
// para o mesmo peso visual das cores de categoria em data/categories.json.
// Marcas com logo monocromático (preto/branco): não dá pra extrair uma cor
// do próprio PNG sem esconder o logo no fundo, então usamos a cor de
// identidade oficial da marca (não extraída da imagem), também escurecida.
const BRAND_HEADER_COLORS: Record<string, BrandHeaderColor> = {
  audi: { color: '#A60017', accent: '#FF99A7' },
  byd: { color: '#95000C', accent: '#F599A0' },
  chevrolet: { color: '#A1832E', accent: '#FCEAB5' },
  citroen: { color: '#8E011E', accent: '#F199AB' },
  fiat: { color: '#8F1420', accent: '#F5A3AC' },
  ford: { color: '#0D2247', accent: '#A1AEC5' },
  honda: { color: '#99121F', accent: '#F7A4AC' },
  hyundai: { color: '#002244', accent: '#99AEC3' },
  jeep: { color: '#33391F', accent: '#C7CBA8' },
  kia: { color: '#7F0C1F', accent: '#E7A0AC' },
  lamborghini: { color: '#7A5B0A', accent: '#F0D89B' },
  nissan: { color: '#8C1B12', accent: '#F4A89D' },
  peugeot: { color: '#123334', accent: '#9FD1CE' },
  porsche: { color: '#6E4518', accent: '#E8C99A' },
  renault: { color: '#6E4B00', accent: '#E8C976' },
  toyota: { color: '#990714', accent: '#F79DA5' },
  volkswagen: { color: '#001434', accent: '#99A5B9' },
};

const normalize = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

// Sem cor mapeada (marca sem logo no catálogo): cinza neutro do app.
const FALLBACK: BrandHeaderColor = { color: colors.neutral.gray, accent: colors.neutral.grayLight };

export const getBrandHeaderColor = (brandName: string): BrandHeaderColor =>
  BRAND_HEADER_COLORS[normalize(brandName)] ?? FALLBACK;
