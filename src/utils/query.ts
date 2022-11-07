import { QueryMultiParams } from '../types';

const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;

export function getQueryKeys({ keys, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET }: QueryMultiParams): string[] {
  if (offset < 0 || offset > keys.length) {
    throw new Error(`Offset must be greater than 0 and less than ${keys.length - 1}`);
  }

  if (limit >= keys.length) {
    return keys;
  }

  if (offset + limit > keys.length) {
    return keys.slice(offset);
  }

  return keys.slice(offset, offset + limit);
}
