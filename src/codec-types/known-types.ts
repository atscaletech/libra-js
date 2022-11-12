export const KNOWN_TYPES = {
  // Currencies types
  CurrencyId: {
    _enum: {
      Native: null,
      Registered: 'Hash',
    },
  },
  CurrencyMetadata: {
    name: 'Text',
    symbol: 'Text',
    decimals: 'u8',
    issuer: 'AccountId',
  },
  // Identities types
  IdentityType: {
    _enum: ['Individual', 'Organization'],
  },
  IdentityField: {
    name: 'Text',
    value: 'Text',
    is_verified: 'bool',
    verify_by: 'Option<AccountId>',
  },
  IdentityReview: {
    reviewer: 'AccountId',
    digest: 'Hash',
  },
  Identity: {
    name: 'Text',
    identity_type: 'IdentityType',
    credibility: 'u32',
    data: 'Vec<IdentityField>',
    reviews: 'Vec<IdentityReview>',
  },
  VerifyMethod: {
    _enum: ['Domain', 'Email', 'Evaluator', 'None'],
  },
  IdentityFieldInput: {
    name: 'Text',
    value: 'Text',
    verify_method: 'VerifyMethod',
  },
  // Resolver types
  ResolverStatus: {
    _enum: ['Candidacy', 'Active', 'Terminated'],
  },
  Delegation: {
    delegator: 'AccountId',
    amount: 'Balance',
  },
  Resolver: {
    status: 'ResolverStatus',
    application_digest: 'Hash',
    self_stake: 'Balance',
    delegations: 'Vec<Delegation>',
    total_stake: 'Balance',
    updated_at: 'Moment',
  },
  // Dispute resolution types
  DisputeStatus: {
    _enum: ['Finalizing', 'Evaluating', 'Resolved'],
  },
  Judgment: {
    _enum: ['ReleaseFundToPayer', 'ReleaseFundToPayee'],
  },
  Argument: {
    provider: 'AccountId',
    content_hash: 'Hash',
  },
  Dispute: {
    status: 'DisputeStatus',
    payment_hash: 'Hash',
    expired_at: 'Moment',
    arguments: 'Vec<Argument>',
    resolvers: 'Vec<AccountId>',
    fee: 'Balance',
    judgments: 'Vec<(AccountId, Judgment)>',
    outcome: 'Judgment',
  },
  // LRP types
  PaymentStatus: {
    _enum: ['Pending', 'Accepted', 'Rejected', 'Expired', 'Fulfilled', 'Disputed', 'Cancelled', 'Completed'],
  },
  Payment: {
    payer: 'Text',
    payee: 'Text',
    amount: 'Balance',
    currency_id: 'Text',
    description: 'Text',
    status: 'PaymentStatus',
    receipt_hash: 'Hash',
    created_at: 'Moment',
    updated_at: 'Moment',
    updated_by: 'Text',
  },
};