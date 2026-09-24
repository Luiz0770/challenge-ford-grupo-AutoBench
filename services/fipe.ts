import axios from 'axios';
import type { FipePrice, FipeYear, Vehicle } from '../types';

const BASE_URL = 'https://parallelum.com.br/fipe/api/v1/carros';

const parseFipeValue = (valor: string): number =>
  parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

// Cache em memória por veículo: a home, a busca e o comparador pedem o mesmo
// preço várias vezes. Guarda a Promise para também deduplicar requisições em
// andamento; falhas saem do cache para permitir nova tentativa.
const priceCache = new Map<string, Promise<FipePrice>>();

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
      const years = await FipeService.getYearsByModel(vehicle.brandFipeCode, vehicle.modelFipeCode);
      const yearEntry = years.find((y) => y.codigo.startsWith(String(vehicle.year)));
      if (!yearEntry) throw new Error('Ano não encontrado na tabela FIPE');
      return FipeService.getVehiclePrice(vehicle.brandFipeCode, vehicle.modelFipeCode, yearEntry.codigo);
    })();

    priceCache.set(key, request);
    request.catch(() => priceCache.delete(key));
    return request;
  },
};
