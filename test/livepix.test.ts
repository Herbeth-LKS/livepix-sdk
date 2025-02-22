import dotenv from 'dotenv';

import LivePix from '../src';

dotenv.config();

describe('LivePix SDK - API Real', () => {
  let pix: LivePix;
  let getAccessTokenSpy: jest.SpyInstance;
  let accessToken: string | null = null;

  beforeAll(async () => {
    pix = new LivePix(
      process.env.LIVEPIX_CLIENT_ID!,
      process.env.LIVEPIX_CLIENT_SECRET!,
      'payments:read payments:write offline account:read currencies:read rewards:read rewards:write messages:read messages:write payments:read payments:write subscriptions:read subscriptions:write subscription-plans:read subscription-plans:write wallet:read webhooks controls'
    );
    getAccessTokenSpy = jest.spyOn(pix as any, 'getAccessToken');

    accessToken = await pix['getAccessToken']();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should obtain an OAuth2 token successfully', async () => {
    expect(typeof accessToken).toBe('string');
    expect(accessToken?.length).toBeGreaterThan(10);

    expect(getAccessTokenSpy).toHaveBeenCalledTimes(0);
  });

  test('Should return account info of courrent user', async () => {
    const account = await pix.account();

    expect(account).toHaveProperty('id');
    expect(account).toHaveProperty('email');
    expect(account).toHaveProperty('username');
    expect(account).toHaveProperty('displayName');
    expect(account).toHaveProperty('avatar');

    expect(typeof account.id).toBe('string');
    expect(typeof account.email).toBe('string');
    expect(typeof account.username).toBe('string');
    expect(typeof account.displayName).toBe('string');
    expect(account.avatar === null || typeof account.avatar === 'string').toBe(
      true
    );

    expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
  });

  test('Should create a Pix payment successfully', async () => {
    const cobranca = await pix.createPayment(
      100,
      'BRL',
      'https://dashboard.livepix.gg/'
    );

    expect(cobranca).toHaveProperty('redirectUrl');
    expect(cobranca).toHaveProperty('reference');
    expect(typeof cobranca.redirectUrl).toBe('string');
    expect(typeof cobranca.reference).toBe('string');

    expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
  });

  test('Should consult Pix payments', async () => {
    const pagamentos = await pix.getPayments();

    expect(Array.isArray(pagamentos)).toBe(true);
    expect(pagamentos.length).toBeGreaterThan(0);

    const primeiroPagamento = pagamentos[0];

    expect(primeiroPagamento).toHaveProperty('currency');
    expect(primeiroPagamento).toHaveProperty('amount');
    expect(primeiroPagamento).toHaveProperty('id');
    expect(primeiroPagamento).toHaveProperty('proof');

    expect(typeof primeiroPagamento.currency).toBe('string');
    expect(typeof primeiroPagamento.amount).toBe('number');
    expect(typeof primeiroPagamento.id).toBe('string');
    expect(typeof primeiroPagamento.proof).toBe('string');

    expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
  });

  /*test('Should refresh the token when expired', async () => {
    const newToken = await pix['getAccessToken'](true);

    expect(accessToken).not.toEqual(newToken);
    expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
  });*/

  test('Should register a webhook successfully', async () => {
    const webhookData = await pix.createWebhook('https://example.com/webhook');

    expect(webhookData).toHaveProperty('id');
    expect(typeof webhookData.id).toBe('string');
  });

  test('Should list all registered webhooks', async () => {
    const webhooks = await pix.getWebhooks();

    expect(Array.isArray(webhooks)).toBe(true);
    expect(webhooks.length).toBeGreaterThan(0);
    expect(webhooks[0]).toHaveProperty('id');
    expect(webhooks[0]).toHaveProperty('url');
  });

  test('Should delete a webhook successfully', async () => {
    const webhooks = await pix.getWebhooks();
    const webhookId = webhooks[0]?.id;

    if (webhookId) {
      const status = await pix.deleteWebhook(webhookId);
      expect(status).toBe(204);
    } else {
      console.warn('No webhook found to delete, skipping test.');
    }
  });
});
