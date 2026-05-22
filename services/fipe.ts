import axios from 'axios';
import type { FipeBrand, FipeModelsResponse, FipePrice, FipeYear } from '../types';

const BASE_URL = 'https://parallelum.com.br/fipe/api/v1/carros';

const parseFipeValue = (valor: string): number =>
  parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

export const FipeService = {
  async getBrands(): Promise<FipeBrand[]> {
    const { data } = await axios.get<FipeBrand[]>(`${BASE_URL}/marcas`);
    return data;
  },

  async getModelsByBrand(brandCode: string): Promise<FipeModelsResponse> {
    const { data } = await axios.get<FipeModelsResponse>(
      `${BASE_URL}/marcas/${brandCode}/modelos`
    );
    return data;
  },

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
};
