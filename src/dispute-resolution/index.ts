import { Dispute, Hash, AccountAddress, TransactionEvent, Account, TransactionSchemaField } from '../types';
import { Client } from '../client';
import { Dispute as DisputeCodec } from '../codec-types';
import { decodeDispute } from './codec';

export const PALLET_NAME = 'dispute-resolution';

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
    return this.getDisputesBy(PALLET_NAME, 'assignedDisputes', resolver);
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

  disputePayment(hash: string, account: Account) {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'disputePayment',
        params: {
          schema,
          data: { hash },
        },
      },
      account
    );
  }

  fightDispute(hash: string, account: Account): Promise<TransactionEvent> {
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

  escalateDispute(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'escalate',
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
