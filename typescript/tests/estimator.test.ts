/// <reference types="jest" />

import { calculateFrequencyVector, obliviousStreamingAlgorithm, StreamUpdate } from '../index';

describe('calculateFrequencyVector', () => {
  test('calculates frequency vector correctly', () => {
    const updates: StreamUpdate[] = [
      { itemIndex: 1, delta: 1 },
      { itemIndex: 2, delta: 2 },
      { itemIndex: 1, delta: 3 },
      { itemIndex: 3, delta: 1 }
    ];

    expect(calculateFrequencyVector(3, updates, 2)).toEqual([1, 2, 0]);
    expect(calculateFrequencyVector(3, updates, 4)).toEqual([4, 2, 1]);
  });

  test('handles empty updates', () => {
    expect(calculateFrequencyVector(3, [], 0)).toEqual([0, 0, 0]);
  });

  test('handles out-of-bounds indices', () => {
    const updates: StreamUpdate[] = [
      { itemIndex: 1, delta: 1 },
      { itemIndex: 5, delta: 2 }, // Out of bounds for n=3
      { itemIndex: 2, delta: 1 }
    ];

    expect(calculateFrequencyVector(3, updates, 3)).toEqual([1, 1, 0]);
  });

  test('throws error for invalid n', () => {
    expect(() => calculateFrequencyVector(0, [], 0)).toThrow("n must be a positive integer.");
    expect(() => calculateFrequencyVector(-1, [], 0)).toThrow("n must be a positive integer.");
  });
});

describe('obliviousStreamingAlgorithm', () => {
  const mockFunction = (v: number[]) => Math.max(...v);

  test('computes approximation correctly', () => {
    const updates: StreamUpdate[] = [
      { itemIndex: 1, delta: 5 },
      { itemIndex: 2, delta: 3 },
      { itemIndex: 1, delta: 2 }
    ];

    const result = obliviousStreamingAlgorithm(mockFunction, 0.1, 10, 3, 10, updates);
    expect(result).toBe(7); // max of [7, 3, 0]
  });

  test('returns null for alpha < 2', () => {
    const updates: StreamUpdate[] = [{ itemIndex: 1, delta: 1 }];
    const result = obliviousStreamingAlgorithm(mockFunction, 0.1, 1, 3, 10, updates);
    expect(result).toBeNull();
  });

  test('throws error for negative epsilon', () => {
    const updates: StreamUpdate[] = [{ itemIndex: 1, delta: 1 }];
    expect(() => obliviousStreamingAlgorithm(mockFunction, -0.1, 10, 3, 10, updates)).toThrow("Epsilon must be non-negative.");
  });

  test('throws error for invalid n', () => {
    const updates: StreamUpdate[] = [{ itemIndex: 1, delta: 1 }];
    expect(() => obliviousStreamingAlgorithm(mockFunction, 0.1, 10, 0, 10, updates)).toThrow("n must be a positive integer.");
  });

  test('throws error for invalid m', () => {
    const updates: StreamUpdate[] = [{ itemIndex: 1, delta: 1 }];
    expect(() => obliviousStreamingAlgorithm(mockFunction, 0.1, 10, 3, 0, updates)).toThrow("m must be a positive integer.");
  });
});
