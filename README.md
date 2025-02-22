
```markdown

# LivePix SDK

  

Este SDK permite que você interaja com a API LivePix de forma fácil e eficiente, usando TypeScript. Com ele, você pode acessar informações sobre contas, pagamentos, transações, saldos, e muito mais.

  

## Instalação

  

### Via NPM

  

Para usar este SDK em seu projeto, você pode instalá-lo via NPM:

  

```bash

npm  install  livepix-sdk

```

  

### Via Yarn

  

Ou via Yarn:

  

```bash

yarn  add  livepix-sdk

```

  

## Uso

  

### Importação do SDK

  

Para começar a usar o SDK, você precisa importar a classe `LivePix` no seu código:

  

```typescript

import  LivePix  from  'livepix-sdk';

```

  

### Criação de uma Instância do SDK

  

Antes de usar qualquer método, crie uma instância do SDK passando seu `clientId`, `clientSecret` e `scope`:

  

```typescript

const  clientId  =  'seu-client-id';

const  clientSecret  =  'seu-client-secret';

const  livePix  =  new  LivePix(clientId, clientSecret);

```

  

### Obtendo Informações da Conta

  

Você pode acessar as informações da conta associada ao seu token com o seguinte método:

  

```typescript

const  accountData  =  await livePix.account.getAccount();

console.log(accountData);

```

  

Isso retornará os dados da conta, incluindo o `id`, `email`, `username`, `displayName` e `avatar`.

  

### Criando um Pagamento

  

Para criar um pagamento, forneça:

-  `amount: Valor do pagamento em centavos`

-  `currency: Moeda do pagamento (BRL, BNB, etc)`

-  `redirectUrl: URL para redirecionar o usuário de volta após o pagamento`:

  

```typescript

const  payment  =  await livePix.payments.createPayment(100, 'BRL', 'http://seusite.com/retorno');

console.log(payment);

```

  

Isso retornará os dados do pagamento, incluindo o `redirectUrl` e o `reference`.

```

{

"reference": "61021c7bdabe5e001225b65b",

"redirectUrl": "https://checkout.livepix.gg/61021c7bdabe5e001225b65b"

}

```

### Obtendo Pagamentos

  

Para obter os pagamentos existentes:

  

```typescript

const  payments  =  await livePix.payments.getPayments();

console.log(payments);
```

Isso retornará um array com todos os pagamentos recebidos:

```
{
  "id": "61021c7bdabe5e001225b65b",
  "proof": "E0000000020210727170449258921630",
  "reference": "foo",
  "amount": 1000,
  "currency": "BRL",
  "createdAt": "2021-01-01T00:00:00-03:00"
}
```

  

### Obtendo Saldo da Carteira

  

Você pode obter o saldo atual da sua carteira:

  

```typescript

const  walletBalance  =  await livePix.wallet.getWalletBalance;

console.log(walletBalance);
```
Isso retornará: 
```
{
  "currency": "BRL",
  "balance": 0,
  "balanceHeld": 0,
  "balancePending": 0
}
```



  

### Obtendo Transações de Carteira

  

Para obter as transações de uma moeda específica:

  

```typescript

const  transactions  = await livePix.wallet.getWalletTransactions('BRL');

console.log(transactions);
```
Isso retornará: 
```
{
  "proof": "E0000000020210727170449258921630",
  "currency": "BRL",
  "amount": 100,
  "balance": 100,
  "timestamp": 1637626062
}
```


  

### Criando um Webhook

  

Você pode criar um webhook para receber notificações:

  

```typescript

const  webhook  =  await livePix.webhooks.createWebhook('http://seusite.com/webhook');

console.log(webhook);

```

  

### Deletando um Webhook

  

Para deletar um webhook existente, forneça o `webhookId`:

  

```typescript

const  status  =  await livePix.webhooks.deleteWebhook('id-do-webhook');

console.log(status);

```


### Vizualizando os Webhook cadastrados

  

Para vizualizar os webhook existente:

  

```typescript

const  webhooks =  await livePix.webhooks.getWebhooks();

console.log(webhooks);

```

Isso retornará: 
```
{
  "id": "61021c7bdabe5e001225b65b",
  "url": "https://example.com/webhook"
}
```




  

## Métodos Disponíveis

  

### `account()`

  

Retorna as informações da conta.

  

### `createPayment(amount: number, currency: string, redirectUrl: string)`

  

Cria um pagamento e retorna os dados do pagamento.

  

### `getPayments()`

  

Retorna todos os pagamentos.

  

### `currencies()`

  

Retorna as moedas disponíveis.

  

### `getWalletBalance()`

  

Retorna o saldo da carteira.

  

### `getWalletTransactions(currency: string, page?: number, limit?: number)`

  

Retorna as transações da carteira para uma moeda específica.

  

### `getWalletReceivables(currency: string, page?: number, limit?: number)`

  

Retorna as contas a receber de uma moeda específica.

  

### `getWebhooks(page?: number, limit?: number)`

  

Retorna os webhooks configurados.

  

### `createWebhook(url: string)`

  

Cria um webhook com a URL fornecida.

  

### `deleteWebhook(webhookId: string)`

  

Deleta o webhook com o ID fornecido.

  

## Considerações

  

- Certifique-se de que o `clientId`, `clientSecret` e `scope` sejam configurados corretamente para acessar os endpoints da API.

- O SDK usa tokens de acesso OAuth2, que são renovados automaticamente quando expiram.

- Se você precisar de mais detalhes sobre os endpoints da API LivePix, consulte a [documentação oficial da API LivePix](https://livepix.gg/docs).

  

## Licença

  

Este SDK está disponível sob a [Licença MIT](LICENSE).