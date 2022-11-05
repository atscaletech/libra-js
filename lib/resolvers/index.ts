import { Resolver, AccountAddress, TransactionEvent, Account, ResolverParams, DelegationParams } from '../types';
import { Client } from '../client';
import { decodeResolver, encodeDelegationParams, encodeResolverParams } from './codec';

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

  joinResolverNetwork(params: ResolverParams, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'joinResolversNetwork',
        params: encodeResolverParams(params),
      },
      account
    );
  }

  delegate(params: DelegationParams, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'delegate',
        params: encodeDelegationParams(params),
      },
      account
    );
  }

  undelegate(params: DelegationParams, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'undelegate',
        params: encodeDelegationParams(params),
      },
      account
    );
  }

  resign(account: Account) {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'resign',
        params: [],
      },
      account
    );
  }
}
