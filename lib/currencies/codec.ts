import { DecodeFnMeta, Currency, CurrencyParams } from '../types';
import { CurrencyMetadata } from '../codec-types';

export function decodeCurrency(raw: CurrencyMetadata, meta: DecodeFnMeta): Currency {
  return {
    hash: meta.key || '',
    name: raw.name.toString(),
    symbol: raw.symbol.toString(),
    decimals: raw.decimals.toNumber(),
    issuer: raw.decimals.toString(),
  }
}

export function encodeCurrencyParams(params: CurrencyParams): any[] {
  return [];
}