import type { AccountAddress, Balance, Hash } from './common';

export interface CurrencyMetadata {
  name: string;
  symbol: string;
  decimals: string;
  issuer: string;
}

export interface Currency {
  id: string;
  metadata: CurrencyMetadata;
}

export enum PaymentStatus {
  Pending,
  Accepted,
  Rejected,
  Expired,
  Fulfilled,
  Disputed,
  Cancelled,
  Completed,
}

export interface Payment {
  hash: Hash;
  payer: AccountAddress;
  payee: AccountAddress;
  amount: Balance;
  currencyId: string;
  description: string;
  status: PaymentStatus;
  receiptHash: Hash;
  createdAt: number;
  updatedAt: number;
  updatedBy: AccountAddress;
}
