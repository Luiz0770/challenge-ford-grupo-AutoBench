import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { FipeService } from '../../services/fipe';

describe('FipeService.getYearsByModel', () => {
  it('returns parsed years list', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { codigo: '2024-1', nome: '2024 Gasolina' },
        { codigo: '2023-1', nome: '2023 Gasolina' },
      ],
    });

    const years = await FipeService.getYearsByModel('22', '4596');

    expect(years).toHaveLength(2);
    expect(years[0].codigo).toBe('2024-1');
  });

  it('throws error when API fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    await expect(FipeService.getYearsByModel('22', '4596')).rejects.toThrow('Network Error');
  });
});
