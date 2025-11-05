/// <reference types="jest" />

import { range, calculateDensity } from '../index';

describe('range', () => {
  test('returns array from 1 to k for positive k', () => {
    expect(range(5)).toEqual([1, 2, 3, 4, 5]);
    expect(range(1)).toEqual([1]);
    expect(range(3)).toEqual([1, 2, 3]);
  });

  test('returns empty array for k <= 0', () => {
    expect(range(0)).toEqual([]);
    expect(range(-1)).toEqual([]);
  });
});

describe('calculateDensity', () => {
  test('calculates the number of non-zero elements', () => {
    expect(calculateDensity([1, 0, 2, 0, 3])).toBe(3);
    expect(calculateDensity([0, 0, 0])).toBe(0);
    expect(calculateDensity([1, 2, 3, 4, 5])).toBe(5);
    expect(calculateDensity([])).toBe(0);
  });
});
