import { AccountAddress } from './common';

export enum IdentityType {
  Individual,
  Organization,
}

export enum VerifyMethod {
  Evaluator,
  None,
}

export interface IdentityField {
  name: string;
  value: string;
  verifyMethod: VerifyMethod;
  isVerified: boolean;
  verifiedBy?: AccountAddress;
}

export interface IdentityReview {
  reviewer: AccountAddress;
  digest: string;
}

export interface Identity {
  address: AccountAddress;
  name: string;
  type: IdentityType;
  credibility: number;
  data: IdentityField[];
  reviews: IdentityReview[];
}

export interface CreateIdentityInput{
  name: string;
  type: IdentityType;
  data: IdentityField[];
}

export interface UpdateIdentityInput{
  name?: string;
  data?: IdentityField[];
}

export interface VerifyRequest {
  positions: number[];
  evaluator: AccountAddress;
}

export interface VerificationResult {
  account: AccountAddress;
  transcript: [number, boolean][];
}