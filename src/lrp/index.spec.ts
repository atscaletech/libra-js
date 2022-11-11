import { ApiRx } from '@polkadot/api';
import { Client } from '../client';
import LrpProtocol from '.';
import { Account, PaymentStatus, TransactionStatus } from '../types';
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

      const mockedTxLRP = {
        createPayment: mockedExtrinsic,
        acceptPayment: mockedExtrinsic,
        rejectPayment: mockedExtrinsic,
        cancelPayment: mockedExtrinsic,
        fulfillPayment: mockedExtrinsic,
        completePayment: mockedExtrinsic,
        disputePayment: mockedExtrinsic,
      };

      const registry = new TypeRegistry();

      const registeredTypes = {
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
        CurrencyId: 'Text',
      };

      registry.register(registeredTypes);

      const paymentCodec = registry.createType('Payment', {
        payer: SAMPLE_ADDRESS_1,
        payee: SAMPLE_ADDRESS_2,
        amount: '10000',
        currency_id: 'Libra',
        description: 'This is description',
        status: 'Pending',
        receipt_hash: SAMPLE_HASH,
        created_at: '10000',
        updated_at: '10000',
        updated_by: SAMPLE_ADDRESS_1,
      });

      const paymentHashesCodec = registry.createType('Vec<Hash>', [SAMPLE_HASH, SAMPLE_HASH, SAMPLE_HASH]);

      const paymentsQuery = () => of(paymentCodec);
      paymentsQuery.multi = () => of([paymentCodec, paymentCodec, paymentCodec]);

      return {
        registry,
        setSigner: () => ({}),
        tx: {
          lrp: mockedTxLRP,
        },
        query: {
          lrp: {
            payments: paymentsQuery,
            paymentsByPayer: () => of(paymentHashesCodec),
            paymentsByPayee: () => of(paymentHashesCodec),
          },
        },
      };
    }),
  };
});

describe('Encode params for transactions', (): void => {
  const lrp = new LrpProtocol(new Client(new ApiRx()));
  const account: Account = {
    address: SAMPLE_ADDRESS_1,
    signer: {},
  };

  it('should return correct value when get a payment', async () => {
    const payment = await lrp.getPayment(SAMPLE_HASH);

    expect(payment).not.toBeNull();

    if (payment) {
      expect(payment.hash).toEqual(SAMPLE_HASH);
      expect(payment.payer).toEqual(SAMPLE_ADDRESS_1);
      expect(payment.payee).toEqual(SAMPLE_ADDRESS_2);
      expect(payment.amount).toEqual('10000');
      expect(payment.currencyId).toEqual('Libra');
      expect(payment.status).toEqual(PaymentStatus.Pending);
      expect(payment.createdAt).toEqual('10000');
      expect(payment.updatedAt).toEqual('10000');
      expect(payment.updatedBy).toEqual(SAMPLE_ADDRESS_1);
    }
  });

  it('should return correct value when get payment by payer', async () => {
    const payments = await lrp.getPaymentsByPayer(SAMPLE_ADDRESS_1);

    expect(payments.length).toEqual(3);

    payments.forEach((payment) => {
      expect(payment.hash).toEqual(SAMPLE_HASH);
      expect(payment.payer).toEqual(SAMPLE_ADDRESS_1);
      expect(payment.payee).toEqual(SAMPLE_ADDRESS_2);
    });
  });

  it('should return correct value when get payment by payee', async () => {
    const payments = await lrp.getPaymentsByPayee(SAMPLE_ADDRESS_1);

    expect(payments.length).toEqual(3);

    payments.forEach((payment) => {
      expect(payment.hash).toEqual(SAMPLE_HASH);
      expect(payment.payer).toEqual(SAMPLE_ADDRESS_1);
      expect(payment.payee).toEqual(SAMPLE_ADDRESS_2);
    });
  });

  it('should return transaction result when create payment', async () => {
    const result = await lrp.createPayment(
      {
        payee: SAMPLE_ADDRESS_2,
        amount: '10000',
        currencyId: 'libra',
        description: 'description',
        receipt: 'receipt',
      },
      account
    );

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when accept payment', async () => {
    const result = await lrp.acceptPayment(SAMPLE_HASH, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when reject a payment', async () => {
    const result = await lrp.rejectPayment(SAMPLE_HASH, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when cancel payment', async () => {
    const result = await lrp.cancelPayment(SAMPLE_HASH, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when fulfill payment', async () => {
    const result = await lrp.cancelPayment(SAMPLE_HASH, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when complete payment', async () => {
    const result = await lrp.cancelPayment(SAMPLE_HASH, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });

  it('should return transaction result when dispute a payment', async () => {
    const result = await lrp.disputePayment(SAMPLE_HASH, account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual(SAMPLE_HASH);
  });
});
