import { Dispute, DisputeStatus, DisputeJudgment } from '../types';
import { Dispute as DisputeCodec } from '../codec-types';

export function decodeDispute(raw: DisputeCodec): Dispute {
  return {
    paymentHash: raw.payment_hash.toString(),
    status: DisputeStatus.Evaluating,
    expiredAt: raw.expired_at.toString(),
    arguments: [],
    resolvers: [],
    fee: raw.fee.toString(),
    judgments: [],
    outcome: raw.outcome.isReleaseFundToPayer ? DisputeJudgment.ReleaseFundToPayer : DisputeJudgment.ReleaseFundToPayee,
  };
}
