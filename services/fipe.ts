import axios from 'axios';
import type { FipeBrand, FipeModelsResponse } from '../types';

const BASE_URL = 'https://parallelum.com.br/fipe/api/v1/carros';

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
};
