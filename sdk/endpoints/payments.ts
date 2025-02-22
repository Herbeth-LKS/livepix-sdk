import axios, { AxiosResponse } from 'axios';

import APIClient from '../apiClient';
import { PaymentData, GetPaymentData } from '../interfaces';

class PaymentsAPI {
  private apiClient: APIClient;
  private baseUrl: string = 'https://api.livepix.gg';

  constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
  }

  async createPayment(
    amount: number,
    currency: string,
    redirectUrl: string
  ): Promise<PaymentData> {
    return this.apiClient.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: PaymentData }> = await axios.post(
        `${this.baseUrl}/v2/payments`,
        { amount, currency, redirectUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    });
  }

  async getPayments(): Promise<GetPaymentData[]> {
    return this.apiClient.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: GetPaymentData[] }> =
        await axios.get(`${this.baseUrl}/v2/payments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      return response.data.data;
    });
  }
}

export default PaymentsAPI;
