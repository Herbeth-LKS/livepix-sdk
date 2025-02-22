import APIClient from './apiClient';
import AccountAPI from './endpoints/account';
import CurrenciesAPI from './endpoints/currencies';
import PaymentAPI from './endpoints/payments';
import WalletAPI from './endpoints/wallet';
import WebhookAPI from './endpoints/webhooks';

class LivePix {
  public account: AccountAPI;
  public payments: PaymentAPI;
  public wallet: WalletAPI;
  public webhooks: WebhookAPI;
  public currencies: CurrenciesAPI;

  constructor(clientId: string, clientSecret: string, scope: string) {
    const apiClient = new APIClient(clientId, clientSecret, scope);
    this.account = new AccountAPI(apiClient);
    this.payments = new PaymentAPI(apiClient);
    this.wallet = new WalletAPI(apiClient);
    this.webhooks = new WebhookAPI(apiClient);
    this.webhooks = new WebhookAPI(apiClient);
    this.currencies = new CurrenciesAPI(apiClient);
  }
}

export default LivePix;
