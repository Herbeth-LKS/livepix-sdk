import dotenv from 'dotenv';

import LivePix from '../src/livepix';

dotenv.config();

describe('LivePix SDK - API Real', () => {
  let pix: LivePix;

  beforeEach(() => {
    pix = new LivePix(
      process.env.LIVEPIX_CLIENT_ID!,
      process.env.LIVEPIX_CLIENT_SECRET!,
      'payments:read payments:write'
    );
  });

  test('Deve obter um token OAuth2 com sucesso', async () => {
    const token = await pix['getAccessToken']();
    expect(typeof token).toBe('string');
    expect(token?.length).toBeGreaterThan(10);
  });

  test('Deve criar uma cobrança Pix com sucesso', async () => {
    const cobranca = await pix.createPayment(
      100,
      'BRL',
      'https://dashboard.livepix.gg/'
    );

    expect(cobranca).toHaveProperty('redirectUrl');
    expect(cobranca).toHaveProperty('reference');
    expect(typeof cobranca.redirectUrl).toBe('string');
    expect(typeof cobranca.reference).toBe('string');
  });

  test('Deve consultar os pagamentos Pix', async () => {
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
  });
});
