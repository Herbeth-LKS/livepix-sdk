import axios, { AxiosError, AxiosResponse } from 'axios';

import { OAuthTokenResponse } from './interfaces';

class APIClient {
  private clientId: string;
  private clientSecret: string;
  private scope: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;
  private tokenUrl: string = 'https://oauth.livepix.gg/oauth2/token';

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scope =
      'payments:read payments:write offline account:read currencies:read rewards:read rewards:write messages:read messages:write payments:read payments:write subscriptions:read subscriptions:write subscription-plans:read subscription-plans:write wallet:read webhooks controls';
  }

  private async getAccessToken(forceRefresh = false): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    if (
      !forceRefresh &&
      this.accessToken &&
      this.tokenExpiresAt &&
      now < this.tokenExpiresAt
    ) {
      console.log('reutiliza token');
      return this.accessToken;
    }

    try {
      console.log('novo token');
      const response: AxiosResponse<OAuthTokenResponse> = await axios.post(
        this.tokenUrl,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: this.scope
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = now + response.data.expires_in;
      return this.accessToken;
    } catch (error) {
      console.error('Erro ao obter token OAuth2:', error);
      throw new Error(`Erro: ${(error as AxiosError).message}`);
    }
  }

  async requestWithAuth<T>(
    requestFn: (token: string) => Promise<T>
  ): Promise<T> {
    let token = await this.getAccessToken();

    try {
      return await requestFn(token);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        token = await this.getAccessToken(true);
        return await requestFn(token);
      }
      throw error;
    }
  }
}

export default APIClient;
