import { getQueryKeys } from './query';

function generateKeysByNumber(num: number): string[] {
  return Array.from(Array(num).keys()).map((item) => `${item}`);
}

describe('Get query keys', (): void => {
  it('should return correct keys by pagination params', (): void => {
    const keys = generateKeysByNumber(100);
    const expected = generateKeysByNumber(10);
    const actual = getQueryKeys({ keys, limit: 10, offset: 0 });

    expect(actual).toStrictEqual(expected);
  });

  it('should return correct result by default pagination', (): void => {
    const keys = generateKeysByNumber(100);
    const expected = generateKeysByNumber(50);
    const actual = getQueryKeys({ keys });

    expect(actual).toStrictEqual(expected);
  });

  it('should throw error if invalid pagination params', (): void => {
    const keys = generateKeysByNumber(100);
    expect(() => {
      getQueryKeys({ keys, limit: 10, offset: 101 });
    }).toThrowError();
  });

  it('should return all keys if limit greater than length of keys', (): void => {
    const keys = generateKeysByNumber(100);
    expect(getQueryKeys({ keys, limit: 100 })).toStrictEqual(keys);
  });
});
