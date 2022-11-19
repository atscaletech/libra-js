import { ApiRx, WsProvider } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { ISubmittableResult, Codec } from '@polkadot/types/types';
import { Vec } from '@polkadot/types/codec';
import { Text } from '@polkadot/types/primitive';
import { KNOWN_TYPES } from './codec-types';
import {
  ClientConfig,
  TransactionConfig,
  TransactionStatus,
  TransactionEvent,
  GetByKeyConfig,
  QueryConfig,
  QueryMultiConfig,
  QueryByKeysFromConfig,
  Account,
} from './types';
import { lastValueFrom, map } from 'rxjs';
import { isFunction } from '@polkadot/util';
import { getQueryKeys, decodeKeys, encodeParams } from './utils';
import { SubmittableExtrinsic } from '@polkadot/api/types';

const clients: Record<string, ApiRx> = {};

export function createConnection(rpc: string): ApiRx {
  if (!clients[rpc]) {
    const provider = new WsProvider(rpc);
    clients[rpc] = new ApiRx({
      provider,
      rpc: jsonrpc,
      types: KNOWN_TYPES,
    });
  }

  return clients[rpc];
}

export class Client {
  connection: ApiRx;

  constructor(connection: ApiRx) {
    this.connection = connection;
  }

  static connect(config: ClientConfig): Client {
    const connection = createConnection(config.rpc);
    return new Client(connection);
  }

  buildTransaction({ pallet, extrinsic, params }: TransactionConfig): SubmittableExtrinsic<'rxjs', ISubmittableResult> {
    if (!this.connection.tx[pallet][extrinsic]) {
      throw new Error(`There is no extrinsic ${extrinsic} in pallet ${pallet}.`);
    }
    const encoded = encodeParams(this.connection.registry, params);
    return this.connection.tx[pallet][extrinsic](...encoded);
  }

  estimateFee(config: TransactionConfig, account: Account): Promise<any> {
    const transaction = this.buildTransaction(config);

    return lastValueFrom(transaction.paymentInfo(account.address));
  }

  async submitTransaction(config: TransactionConfig, account: Account): Promise<TransactionEvent> {
    await this.connection.isReady;
    const transaction = this.buildTransaction(config);
    const observable = transaction.signAndSend(account.address, { signer: account.signer });

    return new Promise((resolve, reject) => {
      observable.subscribe({
        next: ({ status, txHash, events }) => {
          if (status.isInBlock) {
            resolve({
              hash: txHash.toString(),
              status: TransactionStatus.Processing,
              payload: events.map((item) => item.toHuman()),
            });
            return;
          }
        },
        error: (err) => reject(err),
      });
    });
  }

  async query<C, T>(config: QueryConfig<C, T>): Promise<T | null> {
    await this.connection.isReady;
    const { pallet, getter, params, decoder } = config;

    if (isFunction(this.connection.query[pallet][getter])) {
      return lastValueFrom(
        this.connection.query[pallet][getter]<C>(...params).pipe(map((value) => decoder(value, { params: params })))
      );
    }

    return null;
  }

  async getByKey<C, T>(config: GetByKeyConfig<C, T>): Promise<T | null> {
    await this.connection.isReady;
    const { pallet, getter, key, decoder } = config;

    if (isFunction(this.connection.query[pallet][getter])) {
      return lastValueFrom(
        this.connection.query[pallet][getter]<C>(key).pipe(map((value) => decoder(value, { key: key })))
      );
    }

    return null;
  }

  async queryMulti<C extends Codec, T>(config: QueryMultiConfig<C, T>): Promise<T[]> {
    await this.connection.isReady;
    const { pallet, getter, params, decoder } = config;

    if (!isFunction(this.connection.query[pallet][getter])) {
      return [];
    }

    const keys = getQueryKeys(params);

    const items = await lastValueFrom(this.connection.query[pallet][getter].multi<C>(keys));
    const result = items.map((value, index) => decoder(value, { key: keys[index] }));

    return result.filter((item) => item !== null) as T[];
  }

  async queryByKeysFrom<C extends Codec, T>(config: QueryByKeysFromConfig<C, T>): Promise<T[]> {
    await this.connection.isReady;
    const { pallet, getter, params, decoder } = config;

    const keys = await this.getByKey<Vec<Text>, string[]>({
      pallet: config.params.keysFrom.pallet,
      getter: config.params.keysFrom.getter,
      key: config.params.keysFrom.key,
      decoder: decodeKeys,
    });

    if (keys === null) return [];

    return await this.queryMulti({
      pallet,
      getter,
      params: {
        limit: params.limit,
        offset: params.offset,
        keys,
      },
      decoder,
    });
  }
}
