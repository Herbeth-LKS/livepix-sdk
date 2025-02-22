import axios, { AxiosResponse } from 'axios';

import APIClient from '../apiClient';
import { TransactionData, WalletBalanceData } from '../interfaces';

class WalletAPI {
  private apiClient: APIClient;
  private baseUrl: string = 'https://api.livepix.gg';

  constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
  }

  async getWalletBalance(): Promise<WalletBalanceData[]> {
    return this.apiClient.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: WalletBalanceData[] }> =
        await axios.get(`${this.baseUrl}/v2/wallet`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      return response.data.data;
    });
  }

  async getWalletTransactions(
    currency: string,
    page?: number,
    limit?: number
  ): Promise<TransactionData[]> {
    return this.apiClient.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: TransactionData[] }> =
        await axios.get(`${this.baseUrl}/v2/wallet/${currency}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit }
        });
      return response.data.data;
    });
  }

  async getWalletReceivables(
    currency: string,
    page?: number,
    limit?: number
  ): Promise<TransactionData[]> {
    return this.apiClient.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: TransactionData[] }> =
        await axios.get(`${this.baseUrl}/v2/wallet/${currency}/receivables`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit }
        });
      return response.data.data;
    });
  }
}

export default WalletAPI;
