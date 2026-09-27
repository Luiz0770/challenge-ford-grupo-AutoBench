import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import type { FipePrice, FipeYear, Vehicle } from '../types';

const BASE_URL = 'https://parallelum.com.br/fipe/api/v1/carros';

const parseFipeValue = (valor: string): number =>
  parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

// Cache em memória por veículo: a home, a busca e o comparador pedem o mesmo
// preço várias vezes. Guarda a Promise para também deduplicar requisições em
// andamento; falhas saem do cache para permitir nova tentativa.
const priceCache = new Map<string, Promise<FipePrice>>();

// Cache persistente (AsyncStorage no mobile, localStorage no web): a tabela FIPE
// muda uma vez por mês, então guardar por alguns dias poupa a cota da API e
// mantém os preços visíveis mesmo com o limite estourado.
const STORAGE_PREFIX = 'fipe:price:v1:';
const STORAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface StoredPrice {
  savedAt: number;
  price: FipePrice;
}

const readStored = async (key: string): Promise<FipePrice | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredPrice;
    if (Date.now() - stored.savedAt > STORAGE_TTL_MS) return null;
    return stored.price;
  } catch {
    return null;
  }
};

const writeStored = async (key: string, price: FipePrice): Promise<void> => {
  try {
    const value: StoredPrice = { savedAt: Date.now(), price };
    await AsyncStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // storage indisponível (modo privado, quota): segue só com o cache em memória
  }
};

export const FipeService = {
  async getYearsByModel(brandCode: string, modelCode: string): Promise<FipeYear[]> {
    const { data } = await axios.get<FipeYear[]>(
      `${BASE_URL}/marcas/${brandCode}/modelos/${modelCode}/anos`
    );
    return data;
  },

  async getVehiclePrice(brandCode: string, modelCode: string, yearCode: string): Promise<FipePrice> {
    const { data } = await axios.get<{
      Valor: string;
      CodigoFipe: string;
      MesReferencia: string;
      Modelo: string;
      AnoModelo: number;
    }>(`${BASE_URL}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`);

    return {
      valor: parseFipeValue(data.Valor),
      codigoFipe: data.CodigoFipe,
      mesReferencia: data.MesReferencia,
      modelo: data.Modelo,
      anoModelo: data.AnoModelo,
    };
  },

  getPriceForVehicle(vehicle: Vehicle): Promise<FipePrice> {
    const key = `${vehicle.brandFipeCode}|${vehicle.modelFipeCode}|${vehicle.year}`;
    const cached = priceCache.get(key);
    if (cached) return cached;

    const request = (async () => {
      const stored = await readStored(key);
      if (stored) return stored;

      const years = await FipeService.getYearsByModel(vehicle.brandFipeCode, vehicle.modelFipeCode);
      const yearEntry = years.find((y) => y.codigo.startsWith(String(vehicle.year)));
      if (!yearEntry) throw new Error('Ano não encontrado na tabela FIPE');
      const price = await FipeService.getVehiclePrice(
        vehicle.brandFipeCode,
        vehicle.modelFipeCode,
        yearEntry.codigo
      );
      await writeStored(key, price);
      return price;
    })();

    priceCache.set(key, request);
    request.catch(() => priceCache.delete(key));
    return request;
  },
};
