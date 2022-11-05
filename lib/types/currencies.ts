import { AccountAddress } from "./common";

export interface Currency {
  hash: string;
  name: string;
  decimals: number;
  symbol: string;
  issuer: AccountAddress;
}

export interface CurrencyParams {
  name: string;
  symbol: string;
  decimals: string;
}