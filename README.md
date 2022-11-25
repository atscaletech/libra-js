<h1 align="center">
   <b>
     <a href="https://thelibra.org"><img height="80" src="https://user-images.githubusercontent.com/92568442/183552059-89827da4-16f7-4803-aa29-b600597cf3d0.svg"/></a>
     <br>
    </b>
</h1>

<h3 align="center">Javascript SDK that can help developer easy to integrate web application with Libra payment in minutes.</h3>

<p align="center">
    <a href="https://golibra.xyz"><b>Website</b></a> •
    <a href="https://docs.golibra.xyz"><b>Documentation</b></a>
</p>

<div align="center">

[![Lint](https://github.com/atscaletech/libra-js/actions/workflows/lint.yml/badge.svg)](https://github.com/atscaletech/libra-js/actions/workflows/lint.yml)
[![Test](https://github.com/atscaletech/libra-js/actions/workflows/test.yml/badge.svg)](https://github.com/atscaletech/libra-js/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/atscaletech/libra-js/branch/main/graph/badge.svg?token=RITYVKTWVV)](https://codecov.io/gh/atscaletech/libra-js)

</div>

## Installation
### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@atscaletech/libra-sdk@1.0.0/dist/libra-sdk.cjs.production.min.js"></script>
```

### Package manager
```js
nmp install @atscaletech/libra-sdk
```
**or**
```js
yarn add @atscaletech/libra-sdk
```
## Quick start

```js
import { Libra } from 'libra-js';

const libra = new Libra({
  appName: 'Libra Example',
  rpc: 'wss://rpc.libra.atscale.xyz',
});

async function main() {
  const ALICE_ADDRESS = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  const BOB_ADDRESS = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

  const account = await libra.walletConnection.getAccount(ALICE_ADDRESS);

  const { hash, status } = await libra.lrp.createPayment({
    payee: BOB_ADDRESS,
    amount: 1000,
    currencyId: 'Native',
    description: 'payment description',
    receipt: 'payment receipt'
  }, account);
}
```
## Modules

- [Wallet Connection](https://docs.thelibra.org/sdk/connect-wallet)
- [Payments](https://docs.thelibra.org//sdk/payments)
- [Currencies](https://docs.thelibra.org/sdk/currencies)
- [Disputes](https://docs.thelibra.org/sdk/disputes)
- [Resolvers Network](https://docs.thelibra.org/sdk/resolvers)
- [Identities](https://docs.thelibra.org/sdk/identities)

## License

[Apache-2.0](LICENSE)
