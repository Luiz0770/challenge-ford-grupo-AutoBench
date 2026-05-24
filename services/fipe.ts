import axios from 'axios';
import type { FipePrice, FipeYear } from '../types';

const BASE_URL = 'https://parallelum.com.br/fipe/api/v1/carros';

const parseFipeValue = (valor: string): number =>
  parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

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
};
