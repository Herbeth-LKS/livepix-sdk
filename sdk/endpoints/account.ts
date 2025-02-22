import axios, { AxiosResponse } from 'axios';

import APIClient from '../apiClient';
import { AccountData } from '../interfaces';

class AccountAPI {
  private apiClient: APIClient;
  private baseUrl: string = 'https://api.livepix.gg';

  constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
  }

  async getAccount(): Promise<AccountData> {
    return this.apiClient.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: AccountData }> = await axios.get(
        `${this.baseUrl}/v2/account`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    });
  }
}

export default AccountAPI;
