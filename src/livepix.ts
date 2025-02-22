import axios from "axios";

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
    this.baseUrl = "https://api.livepix.gg";
    this.tokenUrl = "https://oauth.livepix.gg/oauth2/token";
  }

  private async getAccessToken(): Promise<string | null> {
    const now = Math.floor(Date.now() / 1000);

    if (this.accessToken && this.tokenExpiresAt && now < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(this.tokenUrl, 
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: this.scope,
        }).toString(), 
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = now + response.data.expires_in;

      return this.accessToken;
    } catch (error) {
        console.log(error)
      throw new Error(`Erro ao obter token OAuth2: ${error}`);
    }
  }

  async criarCobranca(amount:number, currency:string,redirectUrl:string) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.post(`${this.baseUrl}/v2/payments`, 
        { amount, currency,redirectUrl }, 
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      console.log(response.data)
      
      return response.data.data;
    } catch (error) {
        console.log(error)
      throw new Error(`Erro ao criar cobrança: ${error}`);
    }
  }

  async consultarPagamentos() {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${this.baseUrl}/v2/payments`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Erro ao consultar pagamento: ${error}`);
    }
  }
}

export default LivePix;
