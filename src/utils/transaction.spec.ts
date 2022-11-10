import { encodeParams } from './transaction';
import { TypeRegistry } from '@polkadot/types/create';
import { TransactionSchemaField } from '../types';

describe('Encode params for transactions', (): void => {
  it('should throw error if missing required fields.', (): void => {
    const registry = new TypeRegistry();

    const schema: TransactionSchemaField[] = [
      {
        name: 'foo',
        isRequired: true,
        chainType: 'Vec<u8>',
      },
    ];

    expect(() => {
      encodeParams(registry, { schema, data: {} });
    }).toThrowError('Field foo is required.');
  });

  it('should be return correct params.', (): void => {
    const registry = new TypeRegistry();

    const schema: TransactionSchemaField[] = [
      {
        name: 'number',
        isRequired: true,
        chainType: 'u32',
      },
      {
        name: 'text',
        isRequired: true,
        chainType: 'Text',
      },
      {
        name: 'balance',
        isRequired: true,
        chainType: 'Balance',
      },
    ];

    const params = encodeParams(registry, { schema, data: { number: 10, text: 'text', balance: 100 } });

    expect(params[0].toString()).toStrictEqual('10');
    expect(params[1].toString()).toStrictEqual('text');
    expect(params[2].toString()).toStrictEqual('100');
  });
});
