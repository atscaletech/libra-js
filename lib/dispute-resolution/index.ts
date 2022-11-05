import { Dispute, Hash, AccountAddress, TransactionEvent, Account } from '../types';
import { Client } from '../client';
import { Dispute as DisputeCodec } from "../codec-types";
import { decodeDispute } from './codec';

export const PALLET_NAME = 'dispute-resolution';

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

  fightDispute(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'fightDispute',
        params: [hash],
      },
      account
    );
  }

  escalateDispute(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'escalate',
        params: [hash],
      },
      account
    );
  }

  proposeOutcome(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'proposeOutcome',
        params: [hash],
      },
      account
    );
  }

  disputePayment(hash: string, account: Account) {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'disputePayment',
        params: [hash],
      },
      account
    );
  }
}
