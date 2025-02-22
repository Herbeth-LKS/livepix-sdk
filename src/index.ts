import axios, { AxiosError, AxiosResponse } from 'axios';

interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface AccountData {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

interface PaymentData {
  redirectUrl: string;
  reference: string;
}

interface GetPaymentData {
  id: string;
  currency: string;
  amount: number;
  proof: string;
}

interface CurrencyData {
  symbol: string;
  minimumAmount: number;
  decimals: number;
}

interface WalletBalanceData {
  currency: string;
  balance: number;
  balanceHeld: number;
  balancePending: number;
}

interface TransactionData {
  proof: string;
  amount: number;
  balance: number;
  releaseAt: number;
  timestamp: number;
}

interface WebhookData {
  id: string;
  url: string;
}

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
      console.log('Reutilizando token');
      return this.accessToken;
    }

    try {
      console.log('Novo token');
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

  async account(): Promise<AccountData> {
    return this.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: AccountData }> = await axios.get(
        `${this.baseUrl}/v2/account`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    });
  }

  async createPayment(
    amount: number,
    currency: string,
    redirectUrl: string
  ): Promise<PaymentData> {
    return this.requestWithAuth(async (token) => {
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
    return this.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: GetPaymentData[] }> =
        await axios.get(`${this.baseUrl}/v2/payments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      return response.data.data;
    });
  }

  async currencies(): Promise<CurrencyData[]> {
    return this.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: CurrencyData[] }> = await axios.get(
        `${this.baseUrl}/v2/currencies`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    });
  }

  async getWalletBalance(): Promise<WalletBalanceData[]> {
    return this.requestWithAuth(async (token) => {
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
    return this.requestWithAuth(async (token) => {
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
    return this.requestWithAuth(async (token) => {
      const response: AxiosResponse<{ data: TransactionData[] }> =
        await axios.get(`${this.baseUrl}/v2/wallet/${currency}/receivables`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit }
        });
      return response.data.data;
    });
  }

  async getWebhooks(page?: number, limit?: number): Promise<WebhookData[]> {
    return this.requestWithAuth(async (token) => {
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
    return this.requestWithAuth(async (token) => {
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
    return this.requestWithAuth(async (token) => {
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

export default LivePix;
