import { Signer } from '@polkadot/api/types';

export type AccountAddress = string;
export type Balance = string;
export type CurrencyId = string;
export type Timestamp = string;
export type Hash = string;

export interface Account {
  address: AccountAddress;
  signer: Signer;
}

export type TransactionHash = string;

export enum TransactionStatus {
  Completed = 'Completed',
  Processing = 'Processing',
  Failed = 'Failed',
}

export interface TransactionEvent {
  hash: string;
  status: TransactionStatus;
  payload?: any;
  subscribe?: any;
}
