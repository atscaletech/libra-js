import { createClient } from './client';
import { ApiRx } from '@polkadot/api';
import { ISubmittableResult, Signer, Codec } from '@polkadot/types/types';
import { Observable, filter } from 'rxjs';

export interface Account {
  address: string;
  signer: Signer;
}

export interface RequestConfig {
  pallet: string;
  extrinsic: string;
  params: any[];
  parser?: any;
}

export interface QueryConfig {
  pallet: string;
  getter: string;
  params: any[];
  parser?: any;
}

export default class BaseApi {
  client: ApiRx;

  constructor(client: ApiRx) {
    this.client = client;
  }

  async createInstance(rpc: string) {
    const client = await createClient(rpc);

    return new BaseApi(client);
  }

  buildTx({ pallet, extrinsic, params }: RequestConfig) {
    return this.client.tx[pallet][extrinsic](...params);
  }

  estimateFee(config: RequestConfig, account: Account): Observable<any> {
    const tx = this.buildTx(config);

    return tx.paymentInfo(account.address);
  }

  submitTransaction(config: RequestConfig, account: Account): Observable<any> {
    const tx = this.buildTx(config);

    if (account.signer) {
      this.client.setSigner(account.signer);
    }

    return tx.signAndSend(account.address);
  }

  query({ pallet, getter, params }: QueryConfig): Promise<Codec> {
    const subscription = this.client.query[pallet][getter](...params);

    return new Promise((resolve, reject) => {
      subscription.subscribe({
        next: (raw) => resolve(raw),
        error: (err) => reject(err),
      });
    });
  }
}
