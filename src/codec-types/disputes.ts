import { Balance, AccountId, Hash, Moment } from '@polkadot/types/interfaces';
import { Struct, Enum, Tuple, Vec } from '@polkadot/types/codec';

export interface DisputeStatus extends Enum {
  readonly isFinalizing: boolean;
  readonly isEvaluating: boolean;
  readonly isResolved: boolean;
}

export interface Judgment extends Enum {
  readonly isReleaseFundToPayer: boolean;
  readonly isReleaseFundToPayee: boolean;
}

export interface Argument extends Struct {
  readonly provider: AccountId;
  readonly content_hash: Hash;
}

export interface Dispute extends Struct {
  readonly status: DisputeStatus;
  readonly payment_hash: Hash;
  readonly expired_at: Moment;
  readonly arguments: Vec<Argument>;
  readonly resolvers: Vec<AccountId>;
  readonly fee: Balance;
  readonly judgments: Vec<Tuple>;
  readonly outcome: Judgment;
}
