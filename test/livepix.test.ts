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
      'payments:read payments:write'
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

  test('Should refresh the token when expired', async () => {
    const newToken = await pix['getAccessToken'](true);

    expect(accessToken).not.toEqual(newToken);
    expect(getAccessTokenSpy).toHaveBeenCalledTimes(1);
  });
});
