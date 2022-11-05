import { Payment, Hash, AccountAddress, TransactionEvent, Account, CreatePaymentInput } from '../types';
import { Client } from '../client';
import { Payment as PaymentCodec } from '../codec-types';
import { decodePayment } from './codec';
import { createPaymentSchema, paymentHashSchema } from './schema';

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

  async createPayment(data: CreatePaymentInput, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'createPayments',
        params: {
          schema: createPaymentSchema,
          data,
        },
      },
      account
    );
  }

  acceptPayment(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'acceptPayments',
        params: {
          schema: paymentHashSchema,
          data: { hash },
        },
      },
      account
    );
  }

  fulfillPayment(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'fulfillPayment',
        params: {
          schema: paymentHashSchema,
          data: { hash },
        },
      },
      account
    );
  }

  completePayment(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'completePayment',
        params: {
          schema: paymentHashSchema,
          data: { hash },
        },
      },
      account
    );
  }

  cancelPayment(hash: string, account: Account): Promise<TransactionEvent> {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'cancelPayment',
        params: {
          schema: paymentHashSchema,
          data: { hash },
        },
      },
      account
    );
  }

  disputePayment(hash: string, account: Account) {
    return this.client.submitTransaction(
      {
        pallet: PALLET_NAME,
        extrinsic: 'disputePayment',
        params: {
          schema: paymentHashSchema,
          data: { hash },
        },
      },
      account
    );
  }
}
