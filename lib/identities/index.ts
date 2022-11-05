import {
  AccountAddress,
  TransactionEvent,
  Account,
  Identity,
  CreateIdentityInput,
  UpdateIdentityInput,
  VerifyRequest,
  VerificationResult,
} from '../types';
import { Client } from '../client';
import {
  decodeIdentity,
} from './codec';
import { createIdentitySchema, updateIdentitySchema, verifyRequestSchema, verificationResultSchema } from './schema';

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

  async createIdentity(data: CreateIdentityInput, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'createIdentity',
        params: {
          schema: createIdentitySchema,
          data: data,
        },
      },
      account
    );
  }

  async updateIdentity(data: UpdateIdentityInput, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'updateIdentity',
        params: {
          schema: updateIdentitySchema,
          data,
        },
      },
      account
    );
  }

  async deleteIdentity(account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'deleteIdentity',
        params: {
          schema: [],
          data: {},
        },
      },
      account
    );
  }

  async requestToVerifyData(data: VerifyRequest, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'requestToVerify',
        params: {
          schema: verifyRequestSchema,
          data,
        },
      },
      account
    );
  }

  async verifyData(data: VerificationResult, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'verifyData',
        params: {
          schema: verificationResultSchema,
          data, 
        },
      },
      account
    );
  }
}
