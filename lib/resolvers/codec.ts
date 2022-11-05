import { DecodeFnMeta, DelegationParams, Resolver, Delegation, ResolverParams, ResolverStatus } from '../types';
import { Resolver as ResolverCodec, Delegation as DelegationCodec } from '../codec-types';

function decodeDelegation(raw: DelegationCodec): Delegation {
  return {
    delegator: raw.delegator.toString(),
    amount: raw.amount.toString(),
  };
}

export function decodeResolver(raw: ResolverCodec, meta: DecodeFnMeta): Resolver {
  return {
    address: meta.key || '',
    application: {
      digest: raw.application_digest.toString(),
    },
    status: ResolverStatus.Candidacy,
    selfStake: raw.self_stake.toString(),
    delegations: raw.delegations.toArray().map((item) => decodeDelegation(item)),
    totalStake: raw.total_stake.toString(),
    updatedAt: raw.updated_at.toNumber(),
  };
}

export function encodeResolverParams(params: ResolverParams): any[] {
  return [];
}

export function encodeDelegationParams(params: DelegationParams): any[] {
  return [];
}
