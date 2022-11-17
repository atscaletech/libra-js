import { AccountAddress, Balance, Timestamp } from './common';

export enum ResolverStatus {
  Candidacy = 'Candidacy',
  Active = 'Active',
  Terminated = 'Terminated',
}

export interface Delegation {
  delegator: AccountAddress;
  amount: Balance;
}

export interface ResolverApplication {
  digest: string;
}

export interface Resolver {
  address: AccountAddress;
  application: ResolverApplication;
  status: ResolverStatus;
  selfStake: Balance;
  delegations: Delegation[];
  totalStake: Balance;
  updatedAt: Timestamp;
}

export interface ResolverParams {
  selfStake: Balance;
  application: string;
}

export interface DelegationParams {
  account: AccountAddress;
  amount: Balance;
}
