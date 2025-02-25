# LivePix SDK

O **LivePix SDK** permite uma integração fácil e eficiente com a API LivePix, oferecendo suporte para TypeScript e Node.js. Com ele, você pode gerenciar contas, pagamentos, transações, saldos e muito mais.

## 📦 Instalação

### Via npm

Instale o SDK usando **npm**:

```bash
npm install livepix-sdk
```

### Via Yarn

Ou utilizando **Yarn**:

```bash
yarn add livepix-sdk
```

---

## 🚀 Como Usar

### Importando o SDK

Para começar, importe a classe `LivePix` no seu código:

```typescript
import LivePix from 'livepix-sdk';
```

### Criando uma Instância do SDK

Antes de utilizar qualquer funcionalidade, crie uma instância do SDK com suas credenciais:

```typescript
const clientId = 'seu-client-id';
const clientSecret = 'seu-client-secret';
const livePix = new LivePix(clientId, clientSecret);
```

---

## 🔹 Funcionalidades

### 📌 Obtendo Informações da Conta

Para acessar os dados da conta associada ao seu token:

```typescript
const accountData = await livePix.account.getAccount();
console.log(accountData);
```

**Exemplo de resposta:**
```json
{
  "id": "12345",
  "email": "usuario@email.com",
  "username": "usuario",
  "displayName": "Usuário Exemplo",
  "avatar": "https://example.com/avatar.png"
}
```

---

### 💰 Criando um Pagamento

Para gerar um pagamento, informe:

- **amount**: Valor em centavos.
- **currency**: Moeda (ex: `BRL`).
- **redirectUrl**: URL de redirecionamento após o pagamento.

```typescript
const payment = await livePix.payments.createPayment(100, 'BRL', 'http://seusite.com/retorno');
console.log(payment);
```

**Exemplo de resposta:**
```json
{
  "reference": "61021c7bdabe5e001225b65b",
  "redirectUrl": "https://checkout.livepix.gg/61021c7bdabe5e001225b65b"
}
```

---

### 📊 Obtendo Pagamentos

```typescript
const payments = await livePix.payments.getPayments();
console.log(payments);
```

**Exemplo de resposta:**
```json
{
  "id": "61021c7bdabe5e001225b65b",
  "proof": "E0000000020210727170449258921630",
  "reference": "foo",
  "amount": 1000,
  "currency": "BRL",
  "createdAt": "2021-01-01T00:00:00-03:00"
}
```

---

### 💵 Consultando Saldo da Carteira

```typescript
const walletBalance = await livePix.wallet.getWalletBalance();
console.log(walletBalance);
```

**Exemplo de resposta:**
```json
{
  "currency": "BRL",
  "balance": 1000,
  "balanceHeld": 0,
  "balancePending": 200
}
```

---

### 🔄 Obtendo Transações da Carteira

```typescript
const transactions = await livePix.wallet.getWalletTransactions('BRL');
console.log(transactions);
```

**Exemplo de resposta:**
```json
{
  "proof": "E0000000020210727170449258921630",
  "currency": "BRL",
  "amount": 100,
  "balance": 100,
  "timestamp": 1637626062
}
```

---

### 🔔 Criando um Webhook

Para receber notificações sobre eventos na API LivePix:

```typescript
const webhook = await livePix.webhooks.createWebhook('http://seusite.com/webhook');
console.log(webhook);
```

---

### 🗑️ Deletando um Webhook

```typescript
const status = await livePix.webhooks.deleteWebhook('id-do-webhook');
console.log(status);
```

---

### 📜 Listando Webhooks Cadastrados

```typescript
const webhooks = await livePix.webhooks.getWebhooks();
console.log(webhooks);
```

**Exemplo de resposta:**
```json
{
  "id": "61021c7bdabe5e001225b65b",
  "url": "https://example.com/webhook"
}
```

---

## 📖 Métodos Disponíveis

| Método | Descrição |
|--------|-----------|
| `account.getAccount()` | Retorna informações da conta |
| `payments.createPayment(amount, currency, redirectUrl)` | Cria um pagamento |
| `payments.getPayments()` | Retorna todos os pagamentos |
| `wallet.getWalletBalance()` | Retorna o saldo da carteira |
| `wallet.getWalletTransactions(currency)` | Obtém transações da carteira |
| `wallet.getWalletReceivables(currency)` | Obtém contas a receber |
| `webhooks.getWebhooks()` | Retorna os webhooks cadastrados |
| `webhooks.createWebhook(url)` | Cria um novo webhook |
| `webhooks.deleteWebhook(webhookId)` | Deleta um webhook |

---

## ℹ️ Considerações

- Certifique-se de configurar corretamente o `clientId`, `clientSecret` e `scope` para acessar os endpoints da API.
- O SDK utiliza **OAuth2** para autenticação e renova automaticamente os tokens expirados.
- Para mais detalhes, consulte a [documentação oficial da API LivePix](https://docs.livepix.gg/api).

---

## 📜 Licença

Este SDK é distribuído sob a [Licença MIT](LICENSE).
