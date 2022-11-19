import { AccountAddress, Balance, Timestamp } from './common';

export enum DisputeStatus {
  Finalizing = 'Finalizing',
  Evaluating = 'Evaluating',
  Resolved = 'Resolved',
}

export enum DisputeJudgment {
  ReleaseFundToPayer = 'ReleaseFundToPayer',
  ReleaseFundToPayee = 'ReleaseFundToPayee',
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
