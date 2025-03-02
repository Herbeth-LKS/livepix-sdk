import dotenv from 'dotenv';

import LivePix from '../sdk';

dotenv.config();

describe('LivePix SDK - API Real', () => {
  let pix: LivePix;

  beforeAll(async () => {
    pix = new LivePix(
      process.env.LIVEPIX_CLIENT_ID!,
      process.env.LIVEPIX_CLIENT_SECRET!
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should return account info of courrent user', async () => {
    const account = await pix.account.getAccount();

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
  });

  test('Query user currencies', async () => {
    const currencies = await pix.currencies.getCurrencies();
    console.log(currencies);

    expect(Array.isArray(currencies)).toBe(true);
    expect(currencies.length).toBeGreaterThan(0);

    expect(currencies[0]).toHaveProperty('symbol');
    expect(currencies[0]).toHaveProperty('minimumAmount');
    expect(currencies[0]).toHaveProperty('decimals');

    expect(typeof currencies[0].symbol).toBe('string');
    expect(typeof currencies[0].minimumAmount).toBe('number');
    expect(typeof currencies[0].decimals).toBe('number');
  });

  test('Should get wallet balance successfully', async () => {
    const balance = await pix.wallet.getWalletBalance();

    expect(Array.isArray(balance)).toBe(true);
    expect(balance.length).toBeGreaterThan(0);

    expect(balance[0]).toHaveProperty('currency');
    expect(balance[0]).toHaveProperty('balance');
    expect(balance[0]).toHaveProperty('balanceHeld');
    expect(balance[0]).toHaveProperty('balancePending');

    expect(typeof balance[0].currency).toBe('string');
    expect(typeof balance[0].balance).toBe('number');
    expect(typeof balance[0].balanceHeld).toBe('number');
    expect(typeof balance[0].balancePending).toBe('number');
  });

  test('Should get wallet transactions successfully', async () => {
    const walletTransactions = await pix.wallet.getWalletTransactions('BRL');

    expect(Array.isArray(walletTransactions)).toBe(true);
    expect(walletTransactions.length).toBeGreaterThan(0);

    expect(walletTransactions[0]).toHaveProperty('proof');
    expect(walletTransactions[0]).toHaveProperty('amount');
    expect(walletTransactions[0]).toHaveProperty('balance');
    expect(walletTransactions[0]).toHaveProperty('timestamp');

    expect(typeof walletTransactions[0].proof).toBe('string');
    expect(typeof walletTransactions[0].amount).toBe('number');
    expect(typeof walletTransactions[0].balance).toBe('number');
    expect(typeof walletTransactions[0].timestamp).toBe('number');
  });

  //test('Should get wallet receivables successfully', async () => {
  // const receivables = await pix.getWalletReceivables('BRL');

  // expect(Array.isArray(receivables)).toBe(true);
  // expect(receivables.length).toBeGreaterThan(0);

  // expect(receivables[0]).toHaveProperty('proof');
  // expect(receivables[0]).toHaveProperty('amount');
  // expect(receivables[0]).toHaveProperty('balance');
  //expect(receivables[0]).toHaveProperty('releaseAt');
  //expect(receivables[0]).toHaveProperty('timestamp');

  //expect(typeof receivables[0].proof).toBe('string');
  //expect(typeof receivables[0].amount).toBe('number');
  //expect(typeof receivables[0].balance).toBe('number');
  //expect(typeof receivables[0].releaseAt).toBe('number');
  //expect(typeof receivables[0].timestamp).toBe('number');

  //expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
  //});

  test('Should create a Pix payment successfully', async () => {
    const cobranca = await pix.payments.createPayment(
      100,
      'BRL',
      'https://dashboard.livepix.gg/'
    );

    expect(cobranca).toHaveProperty('redirectUrl');
    expect(cobranca).toHaveProperty('reference');
    expect(typeof cobranca.redirectUrl).toBe('string');
    expect(typeof cobranca.reference).toBe('string');
  });

  test('Should consult Pix payments', async () => {
    const pagamentos = await pix.payments.getPayments();

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
  });

  // test('Should refresh the token when expired', async () => {
  //  const newToken = await pix['getAccessToken'](true);

  // expect(accessToken).not.toEqual(newToken);
  // expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
  //});

  test('Should register a webhook successfully', async () => {
    const webhookData = await pix.webhooks.createWebhook(
      'https://example.com/webhook'
    );

    expect(webhookData).toHaveProperty('id');
    expect(typeof webhookData.id).toBe('string');
  });

  test('Should list all registered webhooks', async () => {
    const webhooks = await pix.webhooks.getWebhooks();

    expect(Array.isArray(webhooks)).toBe(true);
    expect(webhooks.length).toBeGreaterThan(0);
    expect(webhooks[0]).toHaveProperty('id');
    expect(webhooks[0]).toHaveProperty('url');
  });

  test('Should delete a webhook successfully', async () => {
    const webhooks = await pix.webhooks.getWebhooks();
    const webhookId = webhooks[0]?.id;

    if (webhookId) {
      const status = await pix.webhooks.deleteWebhook(webhookId);
      expect(status).toBe(204);
    } else {
      console.warn('No webhook found to delete, skipping test.');
    }
  });
});
