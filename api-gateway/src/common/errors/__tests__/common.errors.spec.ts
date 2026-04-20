import { isNotFound } from '@/common/errors/common.errors';

describe('isNotFound', () => {
  it.each([
    [{ code: 'P2025' }, true],
    [{ code: 'P2002' }, false],
    [{ code: 'P2025', meta: {} }, true],
    [{}, false],
    [null, false],
    [undefined, false],
    ['P2025', false],
    [42, false],
  ])('returns expected for %p', (input, expected) => {
    expect(isNotFound(input)).toBe(expected);
  });
});
