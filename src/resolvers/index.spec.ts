import { ApiRx } from '@polkadot/api';
import { Client } from '../client';
import ResolversNetwork from '.';
import { Account, ResolverStatus, TransactionStatus } from '../types';
import { TypeRegistry } from '@polkadot/types/create';
import { of } from 'rxjs';
import { KNOWN_TYPES } from '../codec-types';

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
          }),
      });

      const mockedResolverNetworkPallet = {
        joinResolversNetwork: mockedExtrinsic,
        delegate: mockedExtrinsic,
        undelegate: mockedExtrinsic,
        resign: mockedExtrinsic,
      };

      const registry = new TypeRegistry();
      registry.register(KNOWN_TYPES);

      const resolverCodec = registry.createType('Resolver', {
        status: 'Candidacy',
        application_digest: SAMPLE_HASH,
        self_stake: '1000',
        delegations: [
          {
            delegator: SAMPLE_ADDRESS_2,
            amount: '10000',
          },
        ],
        total_stake: '11000',
        updated_at: '23423423',
      });

      const resolverQuery = () => of(resolverCodec);
      resolverQuery.multi = () => of([resolverCodec, resolverCodec, resolverCodec]);

      return {
        registry,
        setSigner: () => ({}),
        tx: {
          resolvers: mockedResolverNetworkPallet,
        },
        query: {
          resolvers: {
            resolvers: resolverQuery,
          },
        },
      };
    }),
  };
});

describe('Encode params for transactions', (): void => {
  const resolversNetwork = new ResolversNetwork(new Client(new ApiRx()));
  const account: Account = {
    address: SAMPLE_ADDRESS_1,
    signer: {},
  };

  it('should return correct value when get a resolver data', async () => {
    const resolver = await resolversNetwork.getResolver(SAMPLE_ADDRESS_1);

    expect(resolver).not.toBeNull();

    if (resolver) {
      expect(resolver.address).toEqual(SAMPLE_ADDRESS_1);
      expect(resolver.status).toEqual(ResolverStatus.Candidacy);
      expect(resolver.selfStake).toEqual('1000');
      expect(resolver.delegations.length).toEqual(1);
      expect(resolver.delegations[0].delegator).toEqual(SAMPLE_ADDRESS_2);
      expect(resolver.delegations[0].amount).toEqual('10000');
      expect(resolver.totalStake).toEqual('11000');
      expect(resolver.application.digest).toEqual(SAMPLE_HASH);
    }
  });

  it('should return transaction result when request join network', async () => {
    const result = await resolversNetwork.joinResolverNetwork(
      {
        application: 'This is application',
        selfStake: '1000',
      },
      account
    );

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when delegate to a resolver', async () => {
    const result = await resolversNetwork.delegate(
      {
        account: SAMPLE_ADDRESS_1,
        amount: '10000',
      },
      account
    );

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when undelegate from a resolver', async () => {
    const result = await resolversNetwork.undelegate(
      {
        account: SAMPLE_ADDRESS_1,
        amount: '10000',
      },
      account
    );

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when a resolver resign', async () => {
    const result = await resolversNetwork.resign(account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });
});
