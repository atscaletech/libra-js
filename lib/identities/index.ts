import {
  AccountAddress,
  TransactionEvent,
  Account,
  Identity,
  CreateIdentityParams,
  UpdateIdentityParams,
  VerifyRequest,
  VerificationResult,
} from '../types';
import { Client } from '../client';
import {
  decodeIdentity,
  encodeCreateIdentityParams,
  encodeUpdateIdentityParams,
  encodeVerifyRequest,
  encodeVerificationResult,
} from './codec';

export const PALLET_NAME = 'identities';

export default class Identities {
  readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getIdentity(address: AccountAddress): Promise<Identity | null> {
    return this.client.getByKey({
      pallet: PALLET_NAME,
      getter: 'identities',
      key: address,
      decoder: decodeIdentity,
    });
  }

  async createIdentity(params: CreateIdentityParams, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'createIdentity',
        params: encodeCreateIdentityParams(params),
      },
      account
    );
  }

  async updateIdentity(params: UpdateIdentityParams, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'updateIdentity',
        params: encodeUpdateIdentityParams(params),
      },
      account
    );
  }

  async deleteIdentity(account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'deleteIdentity',
        params: [],
      },
      account
    );
  }

  async requestToVerifyData(params: VerifyRequest, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'requestToVerify',
        params: encodeVerifyRequest(params),
      },
      account
    );
  }

  async verifyData(params: VerificationResult, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'verifyData',
        params: encodeVerificationResult(params),
      },
      account
    );
  }
}
