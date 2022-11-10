import { ApiRx } from '@polkadot/api';
import { Client } from '../client';
import LrpProtocol from '.';
import { Account, TransactionStatus } from '../types';

jest.mock('@polkadot/api');
jest.mock('../client', () => {
  const originalModule = jest.requireActual('../client');
  return {
    __esModule: true,
    ...originalModule,
    Client: jest.fn(() => ({
      submitTransaction: async () => ({ status: TransactionStatus.Processing, hash: 'hash' }),
      getByKey: async () => ({}),
    })),
  };
});

describe('Encode params for transactions', (): void => {
  const lrp = new LrpProtocol(new Client(new ApiRx()));
  const account: Account = {
    address: 'alice',
    signer: {},
  };

  it('should return transaction result when create payment', async () => {
    const result = await lrp.createPayment(
      {
        payee: 'bob',
        amount: '10000',
        currencyId: 'libra',
        description: 'description',
        receipt: 'receipt',
      },
      account
    );

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual('hash');
  });

  it('should return transaction result when accept payment', async () => {
    const result = await lrp.acceptPayment('hash', account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual('hash');
  });

  it('should return transaction result when cancel payment', async () => {
    const result = await lrp.cancelPayment('hash', account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual('hash');
  });

  it('should return transaction result when fulfill payment', async () => {
    const result = await lrp.cancelPayment('hash', account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual('hash');
  });

  it('should return transaction result when complete payment', async () => {
    const result = await lrp.cancelPayment('hash', account);

    expect(result.status).toEqual(TransactionStatus.Processing);
    expect(result.hash).toEqual('hash');
  });
});
