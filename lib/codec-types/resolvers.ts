import { Balance, AccountId, Hash, Moment } from '@polkadot/types/interfaces';
import { Struct, Enum, Vec } from '@polkadot/types/codec';

export interface ResolverStatus extends Enum {
  readonly isCandidacy: boolean;
  readonly isActive: boolean;
  readonly isTerminated: boolean;
}

export interface Delegation extends Struct {
  readonly delegator: AccountId;
  readonly amount: Balance;
}

export interface Resolver extends Struct {
  readonly application_digest: Hash;
  readonly status: ResolverStatus;
  readonly self_stake: Balance;
  readonly delegations: Vec<Delegation>,
  readonly total_stake: Balance,
  readonly updated_at: Moment,
}