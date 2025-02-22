import dotenv from 'dotenv';

import LivePix from '../src';

dotenv.config();

describe('LivePix SDK - API Real', () => {
  let pix: LivePix;
  let getAccessTokenSpy: jest.SpyInstance;

  beforeEach(() => {
    pix = new LivePix(
      process.env.LIVEPIX_CLIENT_ID!,
      process.env.LIVEPIX_CLIENT_SECRET!,
      'payments:read payments:write'
    );
    getAccessTokenSpy = jest.spyOn(pix as any, 'getAccessToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should obtain an OAuth2 token successfully', async () => {
    const token = await pix['getAccessToken']();
    expect(typeof token).toBe('string');
    expect(token?.length).toBeGreaterThan(10);

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

    expect(pagamentos).toHaveProperty('data');
    expect(Array.isArray(pagamentos.data)).toBe(true);
    expect(pagamentos.data.length).toBeGreaterThan(0);

    const primeiroPagamento = pagamentos.data[0];

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

  test('Should refresh the token when expired', async () => {
    const token1 = await pix['getAccessToken']();
    const token2 = await pix['getAccessToken'](true);

    expect(token1).not.toEqual(token2);
    expect(getAccessTokenSpy).toHaveBeenCalledTimes(2);
  });
});
