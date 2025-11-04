/// <reference types="jest" />

import { range, isMultiplicativeApproximation, isMultiplicativeApproximationTwoSided, calculateDensity, calculateFlipNumber, calculateFrequencyVector, StreamUpdate, TreeNode, subtreeMode } from './index';

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

describe('calculateDensity', () => {
  test('calculates the number of non-zero elements', () => {
    expect(calculateDensity([1, 0, 2, -1, 0, 3])).toBe(4);
    expect(calculateDensity([0, 0, 0])).toBe(0);
    expect(calculateDensity([1, 2, 3])).toBe(3);
  });
});

describe('calculateFlipNumber', () => {
  test('calculates the epsilon-flip number', () => {
    expect(calculateFlipNumber([1, 1.2, 0.5, 1.8, 2.1], 0.2)).toBe(3);
    expect(calculateFlipNumber([1, 1.05], 0.1)).toBe(1);
    expect(calculateFlipNumber([1], 0.1)).toBe(0);
  });

  test('throws error for negative epsilon', () => {
    expect(() => calculateFlipNumber([1, 2], -0.1)).toThrow("Epsilon must be non-negative.");
  });
});

describe('calculateFrequencyVector', () => {
  test('calculates frequency vector after updates', () => {
    const updates: StreamUpdate[] = [
      { itemIndex: 1, delta: 1 },
      { itemIndex: 2, delta: -1 },
      { itemIndex: 1, delta: 1 },
    ];
    expect(calculateFrequencyVector(4, updates, 3)).toEqual([2, -1, 0, 0]);
  });

  test('throws error for invalid n', () => {
    expect(() => calculateFrequencyVector(0, [], 0)).toThrow("n must be a positive integer.");
  });
});

describe('subtreeMode', () => {
  test('computes mode for a single leaf node', () => {
    const leaf: TreeNode = { children: [], color: 5 };
    const result = subtreeMode(leaf);
    expect(result.get(leaf)).toBe(5);
  });

  test('computes mode for a tree with multiple leaves', () => {
    const leaf1: TreeNode = { children: [], color: 1 };
    const leaf2: TreeNode = { children: [], color: 2 };
    const leaf3: TreeNode = { children: [], color: 1 };
    const root: TreeNode = { children: [leaf1, leaf2, leaf3] };
    const result = subtreeMode(root);
    expect(result.get(leaf1)).toBe(1);
    expect(result.get(leaf2)).toBe(2);
    expect(result.get(leaf3)).toBe(1);
    expect(result.get(root)).toBe(1); // 1 appears twice, 2 once
  });

  test('computes mode for a more complex tree', () => {
    const leaf1: TreeNode = { children: [], color: 1 };
    const leaf2: TreeNode = { children: [], color: 2 };
    const leaf3: TreeNode = { children: [], color: 2 };
    const leaf4: TreeNode = { children: [], color: 3 };
    const internal1: TreeNode = { children: [leaf1, leaf2] };
    const internal2: TreeNode = { children: [leaf3, leaf4] };
    const root: TreeNode = { children: [internal1, internal2] };
    const result = subtreeMode(root);
    expect(result.get(leaf1)).toBe(1);
    expect(result.get(leaf2)).toBe(2);
    expect(result.get(leaf3)).toBe(2);
    expect(result.get(leaf4)).toBe(3);
    expect(result.get(internal1)).toBe(1); // modes: 1 and 2, 1 appears once, but since equal, takes the first max
    expect(result.get(internal2)).toBe(2); // 2 and 3, 2 appears once
    expect(result.get(root)).toBe(1); // 1 and 2, 1 appears once
  });
});
