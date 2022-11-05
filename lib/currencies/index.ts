import { Currency, AccountAddress, TransactionEvent, Account, CurrencyParams, Hash } from '../types';
import { Client } from '../client';
import { encodeCurrencyParams, decodeCurrency } from './codec';
import { CurrencyMetadata } from '../codec-types';

export const PALLET_NAME = 'currencies';

export default class Resolvers {
  readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getAcceptedCurrencies(address: AccountAddress): Promise<Currency[]> {
    return this.client.queryByKeysFrom<CurrencyMetadata, Currency>({
      pallet: PALLET_NAME,
      getter: 'currencies',
      params: {
        keysFrom: {
          pallet: PALLET_NAME,
          getter: 'acceptedCurrencies',
          key: address,
        },
      },
      decoder: decodeCurrency,
    });
  }

  createCurrency(params: CurrencyParams, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'createCurrency',
        params: encodeCurrencyParams(params),
      },
      account
    );
  }

  acceptCurrency(hash: Hash, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'acceptCurrency',
        params: [hash],
      },
      account
    );
  }
}
