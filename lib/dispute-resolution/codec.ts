import { DecodeFnMeta, Dispute, DisputeStatus, DisputeJudgment } from "../types";
import { Dispute as DisputeCodec } from "../codec-types";

export function decodeDispute(raw: DisputeCodec, meta: DecodeFnMeta): Dispute {
  return {
    paymentHash: raw.payment_hash.toString(),
    status: DisputeStatus.Evaluating,
    expiredAt: raw.expired_at.toNumber(),
    arguments: [],
    resolvers: [],
    fee: raw.fee.toString(),
    judgments: [],
    outcome: DisputeJudgment.ReleaseFundToPayee,
  }
}
