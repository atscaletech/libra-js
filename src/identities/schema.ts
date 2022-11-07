import { TransactionSchemaField } from '../types';

export const createIdentitySchema: TransactionSchemaField[] = [
  {
    name: 'name',
    isRequired: true,
    chainType: 'Vec<u8>',
  },
  {
    name: 'type',
    isRequired: true,
    chainType: 'IdentityType',
  },
  {
    name: 'data',
    isRequired: true,
    chainType: 'Vec<IdentityFieldInput>',
  },
];

export const updateIdentitySchema: TransactionSchemaField[] = [
  {
    name: 'hash',
    isRequired: true,
    chainType: 'Hash',
  },
];

export const verifyRequestSchema: TransactionSchemaField[] = [
  {
    name: 'positions',
    isRequired: true,
    chainType: 'Vec<u64>',
  },
  {
    name: 'account',
    isRequired: true,
    chainType: 'AccountId',
  },
];

export const verificationResultSchema: TransactionSchemaField[] = [
  {
    name: 'account',
    isRequired: true,
    chainType: 'AccountId',
  },
  {
    name: 'transcript',
    isRequired: true,
    chainType: 'Vec<(u64, bool)',
  },
];
