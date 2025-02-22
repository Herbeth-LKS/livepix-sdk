import axios, { AxiosResponse } from 'axios';

import APIClient from '../apiClient';
import { WebhookData } from '../interfaces';

class WebhooksAPI {
  private apiClient: APIClient;
  private baseUrl: string = 'https://api.livepix.gg';

  constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
  }

  async getWebhooks(page?: number, limit?: number): Promise<WebhookData[]> {
    return this.apiClient.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: WebhookData[] }> = await axios.get(
        `${this.baseUrl}/v2/webhooks`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit }
        }
      );
      return response.data.data;
    });
  }

  async createWebhook(url: string): Promise<WebhookData> {
    return this.apiClient.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: WebhookData }> = await axios.post(
        `${this.baseUrl}/v2/webhooks`,
        { url },
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

  async deleteWebhook(webhookId: string): Promise<number> {
    return this.apiClient.requestWithAuth(async (token) => {
      try {
        const response = await axios.delete(
          `${this.baseUrl}/v2/webhooks/${webhookId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        return response.status;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.status;
        }
        throw error;
      }
    });
  }
}

export default WebhooksAPI;
