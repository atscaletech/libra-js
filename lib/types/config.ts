export enum Wallet {
  POLKADOT_JS = 'polkadot-js',
}

export interface ClientConfig {
  rpc: string;
}

export interface WalletConnectionConfig {
  wallets: Wallet[];
  appName: string;
}

export type LibraConfig = ClientConfig & WalletConnectionConfig;

export type DecodeFnMeta = Record<string, any>;

export interface DecodeFn<C, T> {
  (raw: C, meta: DecodeFnMeta): T;
}

export interface QueryBaseConfig<C, T> {
  pallet: string;
  getter: string;
  decoder: DecodeFn<C, T>;
}

export interface GetByKeyConfig<C, T> extends QueryBaseConfig<C, T> {
  key: string;
}

export interface QueryConfig<C, T> extends QueryBaseConfig<C, T> {
  params: any[];
}

export interface QueryMultiParams {
  keys: string[];
  limit?: number;
  offset?: number;
}

export interface QueryMultiConfig<C, T> extends QueryBaseConfig<C, T> {
  params: QueryMultiParams;
}

export enum QueryByConditionType {
  KeyFrom,
}

export interface QueryByKeysFromConfig<C, T> extends QueryBaseConfig<C, T> {
  params: {
    keysFrom: {
      pallet: string;
      getter: string;
      key: string;
    };
    limit?: number;
    offset?: number;
  };
}

export interface TransactionSchemaField {
  name: string;
  isRequired: true;
  chainType: string;
}

export type TransactionParams = {
  schema: TransactionSchemaField[];
  data:  Record<string, any>;
}
export interface TransactionConfig {
  pallet: string;
  extrinsic: string;
  params: TransactionParams;
}
