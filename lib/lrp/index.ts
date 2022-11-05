import { Payment, Hash, AccountAddress, PaymentParams, TransactionEvent, Account } from '../types';
import { Client } from '../client';
import { Payment as PaymentCodec } from '../codec-types';
import { encodeParams, decodePayment } from './codec';

export const PALLET_NAME = 'lrp';

export default class LrpProtocol {
  readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getPaymentsBy(getter: string, key: string): Promise<Payment[]> {
    return this.client.queryByKeysFrom<PaymentCodec, Payment>({
      pallet: PALLET_NAME,
      getter: 'payments',
      params: {
        keysFrom: {
          pallet: PALLET_NAME,
          getter,
          key,
        },
      },
      decoder: decodePayment,
    });
  }

  getPaymentsByPayer(payer: AccountAddress): Promise<Payment[]> {
    return this.getPaymentsBy('paymentsByPayer', payer);
  }

  getPaymentsByPayee(payee: AccountAddress): Promise<Payment[]> {
    return this.getPaymentsBy('paymentsByPayee', payee);
  }

  getPayment(hash: Hash): Promise<Payment | null> {
    return this.client.getByKey({
      pallet: PALLET_NAME,
      getter: 'payments',
      key: hash,
      decoder: decodePayment,
    });
  }

  async createPayment(params: PaymentParams, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'createPayments',
        params: encodeParams(params),
      },
      account
    );
  }

  acceptPayment(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'acceptPayments',
        params: [hash],
      },
      account
    );
  }

  fulfillPayment(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'fulfillPayment',
        params: [hash],
      },
      account
    );
  }

  completePayment(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'completePayment',
        params: [hash],
      },
      account
    );
  }

  cancelPayment(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'cancelPayment',
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
