/**
 * Utility functions for general use.
 */

/**
 * Represents the set of integers from 1 to k (inclusive).
 * @param k The upper bound of the set.
 * @returns An array containing the integers from 1 to k.
 */
export function range(k: number): number[] {
  if (k <= 0) {
    return [];
  }
  return Array.from({ length: k }, (_, i) => i + 1);
}

/**
 * Calculates the 0-norm (density/sparsity) of a vector.
 * @param x The input vector.
 * @returns The number of non-zero elements in the vector.
 */
export function calculateDensity(x: number[]): number {
  let density = 0;
  for (const element of x) {
    if (element !== 0) {
      density++;
    }
  }
  return density;
}
