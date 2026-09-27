import type { ImageSourcePropType } from 'react-native';

// Chave = nome da marca normalizado (minúsculo, sem acento/espaço/símbolo).
// Marcas ausentes aqui caem no fallback de iniciais.
const LOGOS: Record<string, ImageSourcePropType> = {
  byd: require('../assets/images/brands/byd_logo.png'),
  chevrolet: require('../assets/images/brands/chevrolet_logo.png'),
  citroen: require('../assets/images/brands/citroen_logo.png'),
  fiat: require('../assets/images/brands/fiat_logo.png'),
  ford: require('../assets/images/brands/ford_logo.png'),
  honda: require('../assets/images/brands/honda_logo.png'),
  hyundai: require('../assets/images/brands/hyundai_logo.png'),
  jeep: require('../assets/images/brands/jeep_logo.png'),
  kia: require('../assets/images/brands/kia_logo.png'),
  lamborghini: require('../assets/images/brands/lamborghini_logo.png'),
  nissan: require('../assets/images/brands/nissan_logo.png'),
  peugeot: require('../assets/images/brands/peugeot_logo.png'),
  porsche: require('../assets/images/brands/porsche_logo.png'),
  renault: require('../assets/images/brands/renault_logo.png'),
  toyota: require('../assets/images/brands/toyota_logo.png'),
  volkswagen: require('../assets/images/brands/volkswagen_logo.png'),
  audi: require('../assets/images/brands/audi_logo.png'),
};

const normalize = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export const getBrandLogo = (brandName: string): ImageSourcePropType | undefined =>
  LOGOS[normalize(brandName)];
