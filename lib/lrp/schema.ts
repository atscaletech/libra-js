import { TransactionSchemaField } from '../types';

export const createPaymentSchema: TransactionSchemaField[] = [
  {
    name: 'payee',
    isRequired: true,
    chainType: 'AccountId',
  },
  {
    name: 'amount',
    isRequired: true,
    chainType: 'Balance',
  },
  {
    name: 'currencyId',
    isRequired: true,
    chainType: 'CurrencyId',
  },
  {
    name: 'description',
    isRequired: true,
    chainType: 'Vec<u8',
  },
  {
    name: 'receipt',
    isRequired: true,
    chainType: 'Vec<u8>',
  },
];

export const paymentHashSchema: TransactionSchemaField[] = [
  {
    name: 'hash',
    isRequired: true,
    chainType: 'Hash',
  }
]
