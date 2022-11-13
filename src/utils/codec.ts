import { Vec } from '@polkadot/types/codec';
import { Text } from '@polkadot/types/primitive';

export function decodeKeys(raw: Vec<Text>): string[] {
  return raw.isEmpty ? [] : raw.toArray().map((text) => text.toString());
}
