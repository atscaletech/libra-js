import { AccountId, Hash } from '@polkadot/types/interfaces';
import { u8, u32 } from '@polkadot/types/primitive';
import { Struct, Enum, Vec } from '@polkadot/types/codec';

export interface CurrencyId extends Enum {
  readonly Native: boolean;
  readonly Registered: Hash;
}

export interface CurrencyMetadata extends Struct {
  readonly name: Vec<u8>;
  readonly symbol: Vec<u8>;
  readonly decimals: u32;
  readonly issuer: AccountId;
}
