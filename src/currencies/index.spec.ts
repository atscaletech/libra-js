import { ApiRx } from '@polkadot/api';
import { Client } from '../client';
import Currencies from '.';
import { Account, TransactionStatus } from '../types';
import { TypeRegistry } from '@polkadot/types/create';
import { KNOWN_TYPES } from '../codec-types';
import { of } from 'rxjs';

const SAMPLE_HASH = '0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee';
const SAMPLE_ADDRESS_1 = '5DkkipmU17Znn1Vz5eEfzsun9jhjPX6kJCL1s2nFUaPUHeMP';
const SAMPLE_ADDRESS_2 = '5DfmRtnYbzhG79ufwYGRzi6bDMtJRZsa8H6kDWXJi4vt9Y9d';

jest.mock('@polkadot/api', () => {
  const originalModule = jest.requireActual('@polkadot/api');

  return {
    __esModule: true,
    ...originalModule,
    ApiRx: jest.fn(() => {
      const mockedExtrinsic = () => ({
        signAndSend: () =>
          of({
            events: [],
            status: {
              isInBlock: true,
              asInBlock: { toString: () => SAMPLE_HASH },
            },
          }),
      });

      const mockedCurrenciesPallet = {
        createCurrency: mockedExtrinsic,
        acceptCurrency: mockedExtrinsic,
      };

      const registry = new TypeRegistry();
      registry.register(KNOWN_TYPES);

      const currencyMetadataCodec = registry.createType('CurrencyMetadata', {
        name: 'Test Currency',
        symbol: 'Test',
        decimals: 10,
        issuer: SAMPLE_ADDRESS_1,
      });

      const hashesCodec = registry.createType('Vec<Hash>', [SAMPLE_HASH, SAMPLE_HASH, SAMPLE_HASH]);

      const currenciesQuery = () => of(currencyMetadataCodec);
      currenciesQuery.multi = () => of([currencyMetadataCodec, currencyMetadataCodec, currencyMetadataCodec]);
      const acceptedCurrenciesQuery = () => of(hashesCodec);

      return {
        registry,
        setSigner: () => ({}),
        tx: {
          currencies: mockedCurrenciesPallet,
        },
        query: {
          currencies: {
            currencies: currenciesQuery,
            acceptedCurrencies: acceptedCurrenciesQuery,
          },
        },
      };
    }),
  };
});

describe('Encode params for transactions', (): void => {
  const currencies = new Currencies(new Client(new ApiRx()));
  const account: Account = {
    address: SAMPLE_ADDRESS_1,
    signer: {},
  };

  it('should return correct value when get accepted currencies', async () => {
    const result = await currencies.getAcceptedCurrencies(SAMPLE_ADDRESS_2);

    expect(result.length).toEqual(3);

    result.forEach((item) => {
      expect(item.name).toEqual('Test Currency');
      expect(item.symbol).toEqual('Test');
      expect(item.decimals).toEqual(10);
      expect(item.issuer).toEqual(SAMPLE_ADDRESS_1);
    });
  });

  it('should return transaction result when create a currency', async () => {
    const result = await currencies.createCurrency(
      {
        name: 'Test Currency',
        symbol: 'Test',
        decimals: '10',
      },
      account
    );

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when accept a currency', async () => {
    const result = await currencies.acceptCurrency(SAMPLE_HASH, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });
});
