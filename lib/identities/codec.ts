import {
  CreateIdentityParams,
  DecodeFnMeta,
  Identity,
  IdentityField,
  IdentityType,
  UpdateIdentityParams,
  VerificationResult,
  VerifyRequest,
  VerifyMethod,
  IdentityReview,
} from '../types';
import {
  Identity as IdentityCodec,
  IdentityField as IdentityFieldCodec,
  IdentityReview as IdentityReviewCodec,
} from '../codec-types';

export function decodeIdentityField(raw: IdentityFieldCodec): IdentityField {
  const result: IdentityField = {
    name: raw.name.toString(),
    value: raw.value.toString(),
    isVerified: raw.is_verified.isTrue,
    verifyMethod: VerifyMethod.Evaluator,
  };

  if (!raw.is_verified.isEmpty) {
    result.verifiedBy = raw.verify_by.unwrap().toString();
  }

  return result;
}

export function decodeIdentityReview(raw: IdentityReviewCodec): IdentityReview {
  return {
    reviewer: raw.reviewer.toString(),
    digest: raw.content_digest.toString(),
  };
}

export function decodeIdentity(raw: IdentityCodec, meta: DecodeFnMeta): Identity {
  return {
    address: meta.key || '',
    name: raw.name.toString(),
    type: IdentityType.Individual,
    credibility: raw.credibility.toNumber(),
    data: raw.data.isEmpty ? [] : raw.data.toArray().map((field) => decodeIdentityField(field)),
    reviews: raw.reviews.isEmpty ? [] : raw.reviews.toArray().map((review) => decodeIdentityReview(review)),
  };
}

export function encodeCreateIdentityParams(params: CreateIdentityParams): any[] {
  return [];
}

export function encodeUpdateIdentityParams(params: UpdateIdentityParams): any[] {
  return [];
}

export function encodeVerifyRequest(params: VerifyRequest): any[] {
  return [];
}

export function encodeVerificationResult(params: VerificationResult): any[] {
  return [];
}
