import { DecodeFnMeta, Currency } from '../types';
import { CurrencyMetadata } from '../codec-types';

export function decodeCurrency(raw: CurrencyMetadata, meta: DecodeFnMeta): Currency {
  return {
    hash: meta.key || '',
    name: raw.name.toString(),
    symbol: raw.symbol.toString(),
    decimals: Number.parseInt(raw.decimals.toString()),
    issuer: raw.issuer.toString(),
  };
}
