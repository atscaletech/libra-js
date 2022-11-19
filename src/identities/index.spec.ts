import { ApiRx } from '@polkadot/api';
import { Client } from '../client';
import Identities from '.';
import { Account, IdentityType, TransactionStatus } from '../types';
import { TypeRegistry } from '@polkadot/types/create';
import { KNOWN_TYPES } from '../codec-types';
import { of } from 'rxjs';

const SAMPLE_HASH = '0x88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee';
const SAMPLE_ADDRESS_1 = '5DkkipmU17Znn1Vz5eEfzsun9jhjPX6kJCL1s2nFUaPUHeMP';
const SAMPLE_ADDRESS_2 = '5DfmRtnYbzhG79ufwYGRzi6bDMtJRZsa8H6kDWXJi4vt9Y9d';

jest.mock('@polkadot/api', () => {
  const originalModule = jest.requireActual('@polkadot/api');

  return {
    __esModule: true,
    ...originalModule,
    ApiRx: jest.fn(() => {
      const mockedExtrinsic = () => ({
        signAndSend: () =>
          of({
            events: [],
            status: {
              isInBlock: true,
              asInBlock: { toString: () => SAMPLE_HASH },
            },
            txHash: { toString: () => SAMPLE_HASH },
          }),
      });

      const mockedIdentitiesPallet = {
        createIdentity: mockedExtrinsic,
        updateIdentity: mockedExtrinsic,
        deleteIdentity: mockedExtrinsic,
        requestToVerify: mockedExtrinsic,
        verifyData: mockedExtrinsic,
      };

      const registry = new TypeRegistry();
      registry.register(KNOWN_TYPES);

      const identityCodec = registry.createType('Identity', {
        name: 'libra',
        identity_type: 'Organization',
        credibility: 100,
        data: [
          {
            name: 'domain',
            value: 'https://thelibra.xyz',
            is_verified: true,
            verify_by: SAMPLE_ADDRESS_2,
          },
        ],
        reviews: [
          {
            reviewer: SAMPLE_ADDRESS_2,
            digest: SAMPLE_HASH,
          },
        ],
      });

      const identitiesQuery = () => of(identityCodec);

      return {
        registry,
        setSigner: () => ({}),
        tx: {
          identities: mockedIdentitiesPallet,
        },
        query: {
          identities: {
            identities: identitiesQuery,
          },
        },
      };
    }),
  };
});

describe('Encode params for transactions', (): void => {
  const identities = new Identities(new Client(new ApiRx()));
  const account: Account = {
    address: SAMPLE_ADDRESS_1,
    signer: {},
  };

  it('should return correct value when get a identity', async () => {
    const identity = await identities.getIdentity(SAMPLE_ADDRESS_1);

    expect(identity).not.toBeNull();

    if (identity) {
      expect(identity.address).toEqual(SAMPLE_ADDRESS_1);
      expect(identity.name).toEqual('libra');
      expect(identity.credibility).toEqual(100);
      expect(identity.data.length).toEqual(1);
      expect(identity.data[0].name).toEqual('domain');
      expect(identity.data[0].value).toEqual('https://thelibra.xyz');
      expect(identity.data[0].isVerified).toBeTruthy();
      expect(identity.data[0].verifiedBy).toEqual(SAMPLE_ADDRESS_2);
      expect(identity.reviews.length).toEqual(1);
      expect(identity.reviews[0].reviewer).toEqual(SAMPLE_ADDRESS_2);
      expect(identity.reviews[0].digest).toEqual(SAMPLE_HASH);
    }
  });

  it('should return transaction result when create identity', async () => {
    const result = await identities.createIdentity(
      {
        name: 'libra',
        type: IdentityType.Organization,
        data: [],
      },
      account
    );

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when update identity', async () => {
    const result = await identities.updateIdentity(
      {
        name: 'new libra',
      },
      account
    );

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when delete identity', async () => {
    const result = await identities.deleteIdentity(account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when request to verify identity', async () => {
    const result = await identities.requestToVerifyData(
      {
        evaluator: SAMPLE_ADDRESS_2,
        positions: [1],
      },
      account
    );

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when verify identity', async () => {
    const result = await identities.verifyData(
      {
        account: SAMPLE_ADDRESS_1,
        transcript: [[1, true]],
      },
      account
    );

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });
});
