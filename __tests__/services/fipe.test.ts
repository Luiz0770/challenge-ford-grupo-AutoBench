import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { FipeService } from '../../services/fipe';

describe('FipeService.getBrands', () => {
  it('returns parsed brand list', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { codigo: '22', nome: 'Ford' },
        { codigo: '59', nome: 'Toyota' },
      ],
    });

    const brands = await FipeService.getBrands();

    expect(brands).toHaveLength(2);
    expect(brands[0]).toEqual({ codigo: '22', nome: 'Ford' });
  });

  it('throws error when API fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    await expect(FipeService.getBrands()).rejects.toThrow('Network Error');
  });
});

describe('FipeService.getModelsByBrand', () => {
  it('returns parsed models list', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        modelos: [
          { codigo: 4596, nome: 'Ranger' },
          { codigo: 5903, nome: 'Mustang' },
        ],
        anos: [],
      },
    });

    const result = await FipeService.getModelsByBrand('22');

    expect(result.modelos).toHaveLength(2);
    expect(result.modelos[0].nome).toBe('Ranger');
  });
});
