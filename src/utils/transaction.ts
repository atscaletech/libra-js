import type { Registry } from '@polkadot/types/types';
import { TransactionParams } from '../types';

export function encodeParams(registry: Registry, { schema, data }: TransactionParams): any[] {
  const encoded: any[] = [];

  schema.forEach((field) => {
    if (field.isRequired && !data[field.name]) {
      throw new Error(`Field ${field.name} is required.`);
    }
    encoded.push(registry.createType(field.chainType, data[field.name]));
  });

  return encoded;
}
