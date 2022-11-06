import { DecodeFnMeta, Currency } from '../types';
import { CurrencyMetadata } from '../codec-types';

export function decodeCurrency(raw: CurrencyMetadata, meta: DecodeFnMeta): Currency {
  return {
    hash: meta.key || '',
    name: raw.name.toString(),
    symbol: raw.symbol.toString(),
    decimals: raw.decimals.toBigInt(),
    issuer: raw.decimals.toString(),
  }
}
