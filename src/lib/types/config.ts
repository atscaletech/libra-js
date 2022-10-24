export enum Wallet {
  POLKADOT_JS = 'polkadot-js',
}

export default interface LibraConfig {
  url: string;
  wallets: Wallet[];
}

export default interface ClientConfig {
  rpc?: string;
}