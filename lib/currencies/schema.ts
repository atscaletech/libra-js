import { TransactionSchemaField } from '../types';

export const createCurrencySchema: TransactionSchemaField[] = [
  {
    name: 'name',
    isRequired: true,
    chainType: 'Vec<u8>',
  },
  {
    name: 'symbol',
    isRequired: true,
    chainType: 'Vec<u8>',
  },
  {
    name: 'decimals',
    isRequired: true,
    chainType: 'u8',
  },
];

export const acceptCurrencySchema: TransactionSchemaField[] = [
  {
    name: 'hash',
    isRequired: true,
    chainType: 'Hash',
  },
]
