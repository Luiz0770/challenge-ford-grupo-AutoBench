import type { ImageSourcePropType } from 'react-native';

// Chave = id da categoria (types/index.ts -> Category.id / data/categories.json).
// Categoria sem imagem mapeada simplesmente não mostra foto no card.
const IMAGES: Record<string, ImageSourcePropType> = {
  suv: require('../assets/vehicles/suv_car.png'),
  picape: require('../assets/vehicles/picape_car.png'),
  sedan: require('../assets/vehicles/sedan_car.png'),
  hatch: require('../assets/vehicles/hatch_car.png'),
  crossover: require('../assets/vehicles/crossover_car.png'),
  cupe: require('../assets/vehicles/cupe_car.png'),
  esportivo: require('../assets/vehicles/esportivo_car.png'),
  // arquivo do asset está com esse nome mesmo (typo de origem)
  compacto: require('../assets/vehicles/campacto_car.png'),
  eletrico: require('../assets/vehicles/eletrico_car.png'),
  hibrido: require('../assets/vehicles/hibrido_car.png'),
  conversivel: require('../assets/vehicles/conversivel_car.png'),
  minivan: require('../assets/vehicles/minivan_car.png'),
};

export const getCategoryVehicleImage = (categoryId: string): ImageSourcePropType | undefined =>
  IMAGES[categoryId];

// Ajuste fino de tamanho por categoria: mesmo com o recorte rente à silhueta,
// carros com proporção mais "quadrada" (menos larga) acabam menores que os
// outros na mesma altura de referência. 1 = tamanho padrão.
const IMAGE_SCALE: Record<string, number> = {
  compacto: 1.22,
  hibrido: 1.22,
  crossover: 1.22,
};

export const getCategoryVehicleImageScale = (categoryId: string): number => IMAGE_SCALE[categoryId] ?? 1;
