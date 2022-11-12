import { Dispute, Hash, AccountAddress, TransactionEvent, Account, TransactionSchemaField } from '../types';
import { Client } from '../client';
import { Dispute as DisputeCodec } from '../codec-types';
import { decodeDispute } from './codec';

export const PALLET_NAME = 'disputes';

const schema: TransactionSchemaField[] = [
  {
    name: 'hash',
    isRequired: true,
    chainType: 'Hash',
  },
];
export default class DisputeResolution {
  readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getDisputesBy(pallet: string, getter: string, key: string): Promise<Dispute[]> {
    return this.client.queryByKeysFrom<DisputeCodec, Dispute>({
      pallet: PALLET_NAME,
      getter: 'disputes',
      params: {
        keysFrom: { pallet, getter, key },
      },
      decoder: decodeDispute,
    });
  }

  getPaymentsByResolver(resolver: AccountAddress): Promise<Dispute[]> {
    return this.getDisputesBy(PALLET_NAME, 'disputesByResolvers', resolver);
  }

  getPaymentsByPayee(payee: AccountAddress): Promise<Dispute[]> {
    return this.getDisputesBy(PALLET_NAME, 'disputesByPayee', payee);
  }

  getPaymentsByPayer(payer: AccountAddress): Promise<Dispute[]> {
    return this.getDisputesBy(PALLET_NAME, 'disputesByPayer', payer);
  }

  getDispute(paymentHash: Hash): Promise<Dispute | null> {
    return this.client.getByKey({
      pallet: PALLET_NAME,
      getter: 'disputes',
      key: paymentHash,
      decoder: decodeDispute,
    });
  }

  dispute(hash: string, account: Account) {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'createDispute',
        params: {
          schema,
          data: { hash },
        },
      },
      account
    );
  }

  fight(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'fightDispute',
        params: {
          schema,
          data: { hash },
        },
      },
      account
    );
  }

  escalate(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'escalateDispute',
        params: {
          schema,
          data: { hash },
        },
      },
      account
    );
  }

  proposeOutcome(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'proposeOutcome',
        params: {
          schema,
          data: { hash },
        },
      },
      account
    );
  }
}
