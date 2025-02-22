import LivePix from "../src/livepix";
import dotenv from "dotenv";

dotenv.config(); // Carrega as credenciais do arquivo .env

describe("LivePix SDK - API Real", () => {
  let pix: LivePix;

  beforeEach(() => {
    pix = new LivePix(
      process.env.LIVEPIX_CLIENT_ID!,
      process.env.LIVEPIX_CLIENT_SECRET!,
      "payments:read payments:write"
    );
  });

  test("Deve obter um token OAuth2 com sucesso", async () => {
    const token = await pix["getAccessToken"]();
    expect(typeof token).toBe("string");
    expect(token?.length).toBeGreaterThan(10);
  });

  test("Deve criar uma cobrança Pix com sucesso", async () => {
    const cobranca = await pix.criarCobranca(100, "BRL", "https://dashboard.livepix.gg/");
  
    expect(cobranca).toHaveProperty("redirectUrl");
    expect(cobranca).toHaveProperty("reference");
    expect(typeof cobranca.redirectUrl).toBe("string");
    expect(typeof cobranca.reference).toBe("string");
  });
  

  test("Deve consultar um pagamento Pix", async () => {
    const pagamento = await pix.consultarPagamentos();
    expect(pagamento).toHaveProperty("currency");
  });
});
