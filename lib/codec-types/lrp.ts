import { Balance, AccountId, Hash, Moment } from '@polkadot/types/interfaces';
import { Text, u128 } from '@polkadot/types/primitive';
import { Struct, Enum } from '@polkadot/types/codec';
import { CurrencyId } from './currencies';

export interface Payment extends Struct {
  readonly id: u128;
  readonly payer: AccountId;
  readonly payee: AccountId;
  readonly amount: Balance;
  readonly currency_id: CurrencyId;
  readonly description: Text;
  readonly status: PaymentStatus;
  readonly receipt_hash: Hash;
  readonly created_at: Moment;
  readonly updated_at: Moment;
  readonly updated_by: AccountId;
}

export interface PaymentStatus extends Enum {
  readonly Pending: boolean;
  readonly Accepted: boolean;
  readonly Rejected: boolean;
  readonly Expired: boolean;
  readonly Fulfilled: boolean;
  readonly Disputed: boolean;
  readonly Cancelled: boolean;
  readonly Completed: boolean;
}
