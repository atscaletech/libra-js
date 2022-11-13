import { DecodeFnMeta, Payment, PaymentStatus } from '../types';
import { Payment as PaymentCodec } from '../codec-types';

export function decodePayment(raw: PaymentCodec, meta: DecodeFnMeta): Payment {
  return {
    hash: meta.key || '',
    payer: raw.payer.toJSON(),
    payee: raw.payee.toJSON(),
    amount: raw.amount.toString(),
    currencyId: raw.currency_id.toString(),
    // TO DO: find the way to parse enum.
    status: PaymentStatus.Pending,
    receiptHash: raw.receipt_hash.toString(),
    createdAt: raw.created_at.toString(),
    updatedAt: raw.updated_at.toString(),
    updatedBy: raw.updated_by.toString(),
  };
}
