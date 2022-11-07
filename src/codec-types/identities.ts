import { AccountId, Hash } from '@polkadot/types/interfaces';
import { bool, u8, u32 } from '@polkadot/types/primitive';
import { Struct, Enum, Vec, Option } from '@polkadot/types/codec';

export interface IdentityType extends Enum {
  readonly Individual: boolean;
  readonly Organization: boolean;
}

export interface VerifyMethod extends Enum {
  readonly Domain: boolean;
  readonly Email: boolean;
  readonly Evaluator: boolean;
  readonly None: boolean;
}

export interface IdentityField extends Struct {
  readonly name: Vec<u8>;
  readonly value: Vec<u8>;
  readonly verify_method: VerifyMethod;
  readonly is_verified: bool;
  readonly verify_by: Option<AccountId>;
}

export interface IdentityReview extends Struct {
  readonly reviewer: AccountId;
  readonly content_digest: Hash;
}

export interface Identity extends Struct {
  readonly name: Vec<u8>;
  readonly identity_type: IdentityType;
  readonly credibility: u32;
  readonly data: Vec<IdentityField>;
  readonly reviews: Vec<IdentityReview>;
}
