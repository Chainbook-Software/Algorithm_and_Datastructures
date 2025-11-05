/// <reference types="jest" />

import { isMultiplicativeApproximation, isMultiplicativeApproximationTwoSided, calculateFlipNumber } from '../index';

describe('isMultiplicativeApproximation', () => {
  test('returns true for valid approximation', () => {
    expect(isMultiplicativeApproximation(0.1, 10, 10.5)).toBe(true);
    expect(isMultiplicativeApproximation(0.1, 10, 10)).toBe(true);
  });

  test('returns false for invalid approximation', () => {
    expect(isMultiplicativeApproximation(0.1, 10, 11.1)).toBe(false);
    expect(isMultiplicativeApproximation(0.1, 10, 9.9)).toBe(false);
  });

  test('throws error for negative epsilon', () => {
    expect(() => isMultiplicativeApproximation(-0.1, 10, 10.5)).toThrow("Epsilon must be non-negative.");
  });

  test('throws error for negative x or y', () => {
    expect(() => isMultiplicativeApproximation(0.1, -10, 10.5)).toThrow("x and y must be non-negative.");
    expect(() => isMultiplicativeApproximation(0.1, 10, -10.5)).toThrow("x and y must be non-negative.");
  });
});

describe('isMultiplicativeApproximationTwoSided', () => {
  test('returns true for valid two-sided approximation', () => {
    expect(isMultiplicativeApproximationTwoSided(0.1, 10, 9.5)).toBe(true);
    expect(isMultiplicativeApproximationTwoSided(0.1, 10, 10.5)).toBe(true);
    expect(isMultiplicativeApproximationTwoSided(0.1, 10, 10)).toBe(true);
  });

  test('returns false for invalid two-sided approximation', () => {
    expect(isMultiplicativeApproximationTwoSided(0.1, 10, 9.0)).toBe(false);
    expect(isMultiplicativeApproximationTwoSided(0.1, 10, 11.1)).toBe(false);
  });

  test('throws error for negative epsilon', () => {
    expect(() => isMultiplicativeApproximationTwoSided(-0.1, 10, 10.5)).toThrow("Epsilon must be non-negative.");
  });

  test('throws error for negative x or y', () => {
    expect(() => isMultiplicativeApproximationTwoSided(0.1, -10, 10.5)).toThrow("x and y must be non-negative.");
    expect(() => isMultiplicativeApproximationTwoSided(0.1, 10, -10.5)).toThrow("x and y must be non-negative.");
  });
});

describe('calculateFlipNumber', () => {
  test('calculates the epsilon-flip number', () => {
    expect(calculateFlipNumber([1, 2, 3, 4, 5], 0.1)).toBe(5);
    expect(calculateFlipNumber([1, 1, 1, 2, 2, 2], 0.5)).toBe(2);
  });

  test('throws error for negative epsilon', () => {
    expect(() => calculateFlipNumber([1, 2, 3], -0.1)).toThrow("Epsilon must be non-negative.");
  });
});
