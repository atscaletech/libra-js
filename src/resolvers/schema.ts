import { TransactionSchemaField } from '../types';

export const joinResolverSchema: TransactionSchemaField[] = [
  {
    name: 'application',
    isRequired: true,
    chainType: 'Vec<u8>',
  },
  {
    name: 'selfStake',
    isRequired: true,
    chainType: 'Balance',
  },
];

export const delegateSchema: TransactionSchemaField[] = [
  {
    name: 'account',
    isRequired: true,
    chainType: 'AccountId',
  },
  {
    name: 'amount',
    isRequired: true,
    chainType: 'Balance',
  },
];
