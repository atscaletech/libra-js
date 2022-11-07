import { AccountAddress, Balance, Timestamp } from './common';

export enum DisputeStatus {
  Finalizing,
  Evaluating,
  Resolved,
}

export enum DisputeJudgment {
  ReleaseFundToPayer,
  ReleaseFundToPayee,
}

export interface Opinion {
  owner: string;
  judgement: DisputeJudgment;
}

export interface Dispute {
  paymentHash: string;
  status: DisputeStatus;
  expiredAt: Timestamp;
  arguments: [];
  resolvers: AccountAddress[];
  fee: Balance;
  judgments: Opinion[];
  outcome: DisputeJudgment;
}
