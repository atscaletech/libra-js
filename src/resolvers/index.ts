import { Resolver, AccountAddress, TransactionEvent, Account, ResolverParams, DelegationParams } from '../types';
import { Client } from '../client';
import { decodeResolver } from './codec';
import { delegateSchema, joinResolverSchema } from './schema';

export const PALLET_NAME = 'resolvers';

export default class Resolvers {
  readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async getResolver(address: AccountAddress): Promise<Resolver | null> {
    return await this.client.getByKey({
      pallet: PALLET_NAME,
      getter: 'resolvers',
      key: address,
      decoder: decodeResolver,
    });
  }

  joinResolverNetwork(data: ResolverParams, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'joinResolversNetwork',
        params: {
          schema: joinResolverSchema,
          data,
        },
      },
      account
    );
  }

  delegate(data: DelegationParams, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'delegate',
        params: {
          schema: delegateSchema,
          data,
        },
      },
      account
    );
  }

  undelegate(data: DelegationParams, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'undelegate',
        params: {
          schema: delegateSchema,
          data: data,
        },
      },
      account
    );
  }

  resign(account: Account) {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'resign',
        params: {
          schema: [],
          data: {},
        },
      },
      account
    );
  }
}
