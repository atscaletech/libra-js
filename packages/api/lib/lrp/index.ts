import { Payment } from '../types';
import BaseApi from '../base-api';
import { RequestConfig, Account } from '../base-api';
import Observable from 'rxjs';

export interface PaymentParams {
  payee: string;
  amount: string;
  currency_id: string;
  description: string;
  receipt: string;
}

function decodePayment(raw: Codec): Payment {
  return raw.toJSON();
}

export default class LrpProtocol extends BaseApi {
  async getPaymentsByPayer(payer: string) {
    const hashes = await this.query({ pallet: 'lrp', getter: 'paymentsByPayer', params: [payer] });
    const payments = await this.client.query.lrp.payments.multi(hashes);
  }

  async getPaymentsByPayee(payee: string) {
    const hashes = (await this.client.query.lrp.paymentsByPayee(payee)).toJSON();
  }

  async getPayment(hash: string): Promise<Payment>  {
    const response = this.client.query.lpr.payments(hash);
    return decodePayment(response);
  }

  createPayment(): Promise<Payment> {
    
  }

  acceptPayment(account: string, hash: string) {
    const tx = this.client.tx.lrp.acceptPayment(hash);

    return new Promise((resolve, reject) => {
      tx.signAndSend(account, ({ status, events }) => {
        const result = events.find(({ event }) => this.client.events.lrp.PaymentAccepted.is(event));

        if (result) {
          const payment_hash = result.event.data[0].toString();
          resolve(payment_hash);
        } else {
          reject('Failed to create payment.');
        }
      });
    });
  }

  fulfillPayment() {
  }

  completePayment() {}

  cancelPayment() {}

  disputePayment() {}
}
