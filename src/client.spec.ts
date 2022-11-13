import { ApiRx } from '@polkadot/api';
import { TypeRegistry } from '@polkadot/types/create';
import { Client } from './client';
import {
  Account,
  GetByKeyConfig,
  QueryByKeysFromConfig,
  QueryConfig,
  QueryMultiConfig,
  TransactionConfig,
  TransactionStatus,
} from './types';
import { hexToU8a } from '@polkadot/util';
import { of } from 'rxjs';
import { Balance } from '@polkadot/types/interfaces';

jest.mock('@polkadot/api', () => {
  const originalModule = jest.requireActual('@polkadot/api');

  return {
    __esModule: true,
    ...originalModule,
    ApiRx: jest.fn(() => {
      const balancesExtrinsic = {
        transfer: () => ({
          signAndSend: () => of({ events: [], status: { isInBlock: true, asInBlock: { toString: () => 'hash' } } }),
        }),
      };

      const registry = new TypeRegistry();
      const balanceCodec = registry.createType('Balance', 1000000);

      const addressesCodec = registry.createType('Vec<Hash>', [
        '0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee',
        '0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee',
        '0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee',
      ]);

      const balancesAccountQuery = () => of(balanceCodec);
      balancesAccountQuery.multi = () => of([balanceCodec, balanceCodec, balanceCodec]);

      return {
        registry,
        setSigner: () => ({}),
        tx: {
          balances: balancesExtrinsic,
        },
        query: {
          balances: {
            addresses: () => of(addressesCodec),
            account: balancesAccountQuery,
          },
        },
      };
    }),
  };
});

describe('Client', (): void => {
  const connection = new ApiRx();
  const client = new Client(connection);

  const account: Account = {
    address: 'BzWHaQU',
    signer: {},
  };

  it('should have enough necessary functions', (): void => {
    expect(client.estimateFee).toBeDefined();
    expect(client.submitTransaction).toBeDefined();
    expect(client.query).toBeDefined();
    expect(client.queryMulti).toBeDefined();
    expect(client.queryByKeysFrom).toBeDefined();
  });

  it('should return a promise with transaction result', async () => {
    const config: TransactionConfig = {
      pallet: 'balances',
      extrinsic: 'transfer',
      params: {
        schema: [
          {
            name: 'address',
            isRequired: true,
            chainType: 'AccountId',
          },
          {
            name: 'amount',
            isRequired: true,
            chainType: 'Balance',
          },
        ],
        data: {
          address: hexToU8a('0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee'),
          amount: '321564789876512345',
        },
      },
    };

    const result = await client.submitTransaction(config, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual('hash');
  });

  it('should return correct result for get by key', async () => {
    const config: GetByKeyConfig<Balance, string> = {
      pallet: 'balances',
      getter: 'account',
      key: 'accountId',
      decoder: (raw: Balance) => {
        return raw.toString();
      },
    };

    const accountBalance = await client.getByKey(config);

    expect(accountBalance).toEqual('1000000');
  });

  it('should return correct result for query', async () => {
    const config: QueryConfig<Balance, string> = {
      pallet: 'balances',
      getter: 'account',
      params: [],
      decoder: (raw: Balance) => {
        return raw.toString();
      },
    };

    const balanceAccounts = await client.query(config);

    expect(balanceAccounts).toEqual('1000000');
  });

  it('should return correct result for multi query', async () => {
    const config: QueryMultiConfig<Balance, string> = {
      pallet: 'balances',
      getter: 'account',
      params: {
        keys: ['a', 'b', 'c'],
        limit: 3,
        offset: 0,
      },
      decoder: (raw: Balance) => {
        return raw.toString();
      },
    };

    const balanceAccounts = await client.queryMulti(config);

    expect(balanceAccounts).toEqual(['1000000', '1000000', '1000000']);
  });

  it('should return correct result for multi query', async () => {
    const config: QueryByKeysFromConfig<Balance, string> = {
      pallet: 'balances',
      getter: 'account',
      params: {
        keysFrom: {
          pallet: 'balances',
          getter: 'addresses',
          key: 'some_key',
        },
      },
      decoder: (raw: Balance) => {
        return raw.toString();
      },
    };

    const balanceAccounts = await client.queryByKeysFrom(config);

    expect(balanceAccounts).toEqual(['1000000', '1000000', '1000000']);
  });
});
