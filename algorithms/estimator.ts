/**
 * Estimation functions for streaming settings.
 *
 * This module provides algorithms for estimating function values in streaming data environments.
 * The core function, estimateFunction, addresses the (f, epsilon)-estimation problem: given a function f
 * that maps vectors to values in {0} ∪ [1, α], and a stream of updates to an initial zero vector,
 * compute a (1 + epsilon)-multiplicative approximation to f(v) without storing the entire vector.
 *
 * Key concepts:
 * - Streaming setting: Data arrives as updates, not all at once, requiring memory-efficient processing.
 * - Multiplicative approximation: The result y satisfies x ≤ y < (1 + ε)x for the exact value x = f(v).
 * - Vector updates: Each update modifies a specific index of the vector by adding a value.
 *
 * Use cases: Applicable in big data scenarios, online algorithms, and approximation schemes for NP-hard problems
 * where exact computation is infeasible due to large input sizes.
 */

import { isMultiplicativeApproximation } from './approximations';

/**
 * Represents a stream update.
 */
export interface StreamUpdate {
  itemIndex: number; // i_j: The index of the item being updated (1-indexed).
  delta: number; // Delta_j: The change in frequency (can be any number).
}

/**
 * Calculates the frequency vector v(j) after applying the first j updates
 * to the all-zero vector.
 *
 * @param n The size of the frequency vector (Z^n).
 * @param updates A stream of updates (itemIndex, delta).  itemIndex is 1-indexed.
 * @param j The number of updates to apply (prefix of the stream).
 * @returns The frequency vector v(j).
 */
export function calculateFrequencyVector(n: number, updates: StreamUpdate[], j: number): number[] {
  if (n <= 0) {
    throw new Error("n must be a positive integer.");
  }

  const v: number[] = new Array(n).fill(0); // Initialize all-zero vector

  for (let updateIndex = 0; updateIndex < j && updateIndex < updates.length; updateIndex++) {
    const update = updates[updateIndex];
    const itemIndex = update.itemIndex - 1; // Convert to 0-indexed

    if (itemIndex < 0 || itemIndex >= n) {
      console.warn(`Update ${updateIndex + 1}: Item index ${update.itemIndex} is out of bounds. Skipping.`);
      continue; // Skip out-of-bounds updates
    }

    v[itemIndex] += update.delta;
  }

  return v;
}

/**
 * Simulates an oblivious streaming algorithm for an (f, epsilon)-estimation problem.
 * An oblivious algorithm receives updates one by one and produces a solution
 * based on the cumulative frequency vector.  **Note:** In a real implementation,
 * the algorithm would maintain a sketch or summary of the stream rather than
 * storing the entire frequency vector.
 *
 * @param f A function that takes a frequency vector v and returns a value in {0} U [1, alpha].
 * @param epsilon The error tolerance for the multiplicative approximation.
 * @param alpha The upper bound for the range of f. Must be >= 2.
 * @param n The size of the frequency vector (Z^n).
 * @param m An upper bound on the length of the stream.
 * @param updates A stream of updates.
 * @returns A (1 + epsilon)-multiplicative approximation to f(v(t)), where v(t) is the
 *          cumulative frequency vector after processing all updates.  Returns null if alpha < 2.
 */
export function obliviousStreamingAlgorithm<T>(
  f: (v: number[]) => number,
  epsilon: number,
  alpha: number,
  n: number,
  m: number,
  updates: StreamUpdate[]
): number | null {
  if (alpha < 2) {
    console.warn("Alpha must be greater than or equal to 2.");
    return null;
  }

  if (epsilon < 0) {
    throw new Error("Epsilon must be non-negative.");
  }

  if (n <= 0) {
    throw new Error("n must be a positive integer.");
  }

  if (m <= 0) {
    throw new Error("m must be a positive integer.");
  }

  if (updates.length > m) {
    console.warn("The number of updates exceeds the upper bound m.");
  }

  // 1. Calculate the frequency vector v(t) after applying all updates.
  const v = calculateFrequencyVector(n, updates, Math.min(updates.length, m)); // Apply at most m updates

  // 2. Compute f(v(t)).
  const exactValue = f(v);

  // 3. Compute a (1 + epsilon)-multiplicative approximation.  In a real streaming
  //    setting, you would *estimate* f(v) using a sketching technique.
  if (isMultiplicativeApproximation(epsilon, exactValue, exactValue)) {
    return exactValue;
  } else {
    //This case should not happen since x <= y && y < (1 + epsilon) * x; when y = x.
    return null;
  }
}
