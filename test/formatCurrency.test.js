import { formatCurrency } from '../src/helper/currency';

const digitsOnly = (s) => s.replace(/\D/g, '');

describe('formatCurrency', () => {
  test('truncates numeric inputs (no rounding)', () => {
    expect(digitsOnly(formatCurrency(39200.9))).toBe('39200');
    expect(digitsOnly(formatCurrency(43393.32))).toBe('43393');
  });

  test('handles Indonesian-local formatted strings', () => {
    expect(digitsOnly(formatCurrency('39.200,9'))).toBe('39200');
    expect(digitsOnly(formatCurrency('Rp 39.200,9'))).toBe('39200');
    expect(digitsOnly(formatCurrency('39.200'))).toBe('39200');
  });

  test('handles edge and falsy inputs', () => {
    expect(digitsOnly(formatCurrency(null))).toBe('0');
    expect(digitsOnly(formatCurrency(undefined))).toBe('0');
    expect(digitsOnly(formatCurrency(''))).toBe('0');
  });
});
