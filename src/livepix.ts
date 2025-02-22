import axios, { AxiosError } from 'axios';

class LivePix {
  private clientId: string;
  private clientSecret: string;
  private scope: string;
  private baseUrl: string;
  private tokenUrl: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor(clientId: string, clientSecret: string, scope: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scope = scope;
    this.baseUrl = 'https://api.livepix.gg';
    this.tokenUrl = 'https://oauth.livepix.gg/oauth2/token';
  }
  private async getAccessToken(forceRefresh = false): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    if (
      !forceRefresh &&
      this.accessToken &&
      this.tokenExpiresAt &&
      now < this.tokenExpiresAt
    ) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
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

      if (!this.accessToken) {
        throw new Error('Received empty access token');
      }

      return this.accessToken;
    } catch (error) {
      console.error('Failed to obtain OAuth2 token:', error);
      throw new Error(
        `Failed to obtain OAuth2 token: ${(error as AxiosError).message}`
      );
    }
  }

  private async requestWithAuth<T>(
    requestFn: (token: string) => Promise<T>
  ): Promise<T> {
    let token = await this.getAccessToken();

    console.log(token);

    try {
      return await requestFn(token);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        console.warn('Access token expired, refreshing token...');
        token = await this.getAccessToken(true);
        return await requestFn(token);
      }

      console.error('API request failed:', axiosError);
      throw new Error(`API request failed: ${axiosError.message}`);
    }
  }

  async createPayment(amount: number, currency: string, redirectUrl: string) {
    return this.requestWithAuth(async (token) => {
      const response = await axios.post(
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

  async getPayments() {
    return this.requestWithAuth(async (token) => {
      const response = await axios.get(`${this.baseUrl}/v2/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    });
  }
}

export default LivePix;
