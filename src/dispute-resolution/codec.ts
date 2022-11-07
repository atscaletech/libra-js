import { Dispute, DisputeStatus, DisputeJudgment } from '../types';
import { Dispute as DisputeCodec } from '../codec-types';

export function decodeDispute(raw: DisputeCodec): Dispute {
  return {
    paymentHash: raw.payment_hash.toString(),
    status: DisputeStatus.Evaluating,
    expiredAt: raw.expired_at.toBigInt(),
    arguments: [],
    resolvers: [],
    fee: raw.fee.toString(),
    judgments: [],
    outcome: DisputeJudgment.ReleaseFundToPayee,
  };
}