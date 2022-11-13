import { ApiRx } from '@polkadot/api';
import { Client } from '../client';
import DDR from '.';
import { Account, DisputeJudgment, DisputeStatus, TransactionStatus } from '../types';
import { TypeRegistry } from '@polkadot/types/create';
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
          }),
      });

      const mockedDDRPallet = {
        createDispute: mockedExtrinsic,
        fightDispute: mockedExtrinsic,
        escalateDispute: mockedExtrinsic,
        proposeOutcome: mockedExtrinsic,
      };

      const registry = new TypeRegistry();

      const registeredTypes = {
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
      };

      registry.register(registeredTypes);

      const disputeCodec = registry.createType('Dispute', {
        status: 'Evaluating',
        payment_hash: SAMPLE_HASH,
        expired_at: '230432',
        arguments: [],
        resolvers: [],
        fee: '1000',
        judgments: [],
        outcome: 'ReleaseFundToPayer',
      });

      const hashesCodec = registry.createType('Vec<Hash>', [SAMPLE_HASH, SAMPLE_HASH, SAMPLE_HASH]);

      const disputesQuery = () => of(disputeCodec);
      disputesQuery.multi = () => of([disputeCodec, disputeCodec, disputeCodec]);

      return {
        registry,
        setSigner: () => ({}),
        tx: {
          disputes: mockedDDRPallet,
        },
        query: {
          disputes: {
            disputes: disputesQuery,
            disputesByPayer: () => of(hashesCodec),
            disputesByPayee: () => of(hashesCodec),
            disputesByResolver: () => of(hashesCodec),
          },
        },
      };
    }),
  };
});

describe('Encode params for transactions', (): void => {
  const ddr = new DDR(new Client(new ApiRx()));
  const account: Account = {
    address: SAMPLE_ADDRESS_1,
    signer: {},
  };

  it('should return correct value when get a dispute', async () => {
    const dispute = await ddr.getDispute(SAMPLE_HASH);

    expect(dispute).not.toBeNull();

    if (dispute) {
      expect(dispute.paymentHash).toEqual(SAMPLE_HASH);
      expect(dispute.status).toEqual(DisputeStatus.Evaluating);
      expect(dispute.arguments).toEqual([]);
      expect(dispute.resolvers).toEqual([]);
      expect(dispute.judgments).toEqual([]);
      expect(dispute.outcome).toEqual(DisputeJudgment.ReleaseFundToPayer);
    }
  });

  it('should return correct value when get disputes by payer', async () => {
    const disputes = await ddr.getPaymentsByPayer(SAMPLE_ADDRESS_1);

    expect(disputes.length).toEqual(3);

    disputes.forEach((dispute) => {
      expect(dispute.paymentHash).toEqual(SAMPLE_HASH);
      expect(dispute.status).toEqual(DisputeStatus.Evaluating);
      expect(dispute.arguments).toEqual([]);
      expect(dispute.resolvers).toEqual([]);
      expect(dispute.judgments).toEqual([]);
      expect(dispute.outcome).toEqual(DisputeJudgment.ReleaseFundToPayer);
    });
  });

  it('should return correct value when get disputes by payee', async () => {
    const disputes = await ddr.getPaymentsByPayee(SAMPLE_ADDRESS_1);

    expect(disputes.length).toEqual(3);

    disputes.forEach((dispute) => {
      expect(dispute.paymentHash).toEqual(SAMPLE_HASH);
      expect(dispute.status).toEqual(DisputeStatus.Evaluating);
      expect(dispute.arguments).toEqual([]);
      expect(dispute.resolvers).toEqual([]);
      expect(dispute.judgments).toEqual([]);
      expect(dispute.outcome).toEqual(DisputeJudgment.ReleaseFundToPayer);
    });
  });

  it('should return correct value when get disputes by resolver', async () => {
    const disputes = await ddr.getPaymentsByResolver(SAMPLE_ADDRESS_2);

    expect(disputes.length).toEqual(3);

    disputes.forEach((dispute) => {
      expect(dispute.paymentHash).toEqual(SAMPLE_HASH);
      expect(dispute.status).toEqual(DisputeStatus.Evaluating);
      expect(dispute.arguments).toEqual([]);
      expect(dispute.resolvers).toEqual([]);
      expect(dispute.judgments).toEqual([]);
      expect(dispute.outcome).toEqual(DisputeJudgment.ReleaseFundToPayer);
    });
  });

  it('should return transaction result when create a dispute', async () => {
    const result = await ddr.dispute(SAMPLE_HASH, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when fight a dispute', async () => {
    const result = await ddr.fight(SAMPLE_HASH, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when escalate a dispute', async () => {
    const result = await ddr.escalate(SAMPLE_HASH, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });
});
