import axios, { AxiosResponse } from 'axios';

import APIClient from '../apiClient';
import { CurrencyData } from '../interfaces';

class CurrenciesAPI {
  private apiClient: APIClient;
  private baseUrl: string = 'https://api.livepix.gg';

  constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
  }

  async getCurrencies(): Promise<CurrencyData[]> {
    return this.apiClient.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: CurrencyData[] }> = await axios.get(
        `${this.baseUrl}/v2/currencies`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    });
  }
}

export default CurrenciesAPI;
