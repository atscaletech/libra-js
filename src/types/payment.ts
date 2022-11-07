import type { AccountAddress, Balance, Hash, Timestamp } from './common';

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
  status: PaymentStatus;
  receiptHash: Hash;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: AccountAddress;
}

export interface CreatePaymentInput {
  payee: AccountAddress;
  amount: Balance;
  currencyId: string;
  description: string;
  receipt: string;
}
