import { decodeKeys } from './codec';
import { TypeRegistry } from '@polkadot/types/create';

describe('Encode params for transactions', (): void => {
  it('should decode keys to array string', (): void => {
    const registry = new TypeRegistry();

    const raw = registry.createType('Vec<Text>', ['a', 'b', 'c']);

    expect(decodeKeys(raw)).toStrictEqual(['a', 'b', 'c']);
  });
});
