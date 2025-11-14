<?php

require_once 'approximations.php';

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

/**
 * Represents a stream update.
 */
class StreamUpdate {
  /** @var int i_j: The index of the item being updated (1-indexed). */
  public int $itemIndex;
  /** @var float Delta_j: The change in frequency (can be any number). */
  public float $delta;

  public function __construct(int $itemIndex, float $delta) {
    $this->itemIndex = $itemIndex;
    $this->delta = $delta;
  }
}

/**
 * Calculates the frequency vector v(j) after applying the first j updates
 * to the all-zero vector.
 *
 * @param int $n The size of the frequency vector (Z^n).
 * @param StreamUpdate[] $updates A stream of updates (itemIndex, delta). itemIndex is 1-indexed.
 * @param int $j The number of updates to apply (prefix of the stream).
 * @return float[] The frequency vector v(j).
 */
function calculateFrequencyVector(int $n, array $updates, int $j): array {
  if ($n <= 0) {
    throw new InvalidArgumentException("n must be a positive integer.");
  }

  $v = array_fill(0, $n, 0.0); // Initialize all-zero vector

  for ($updateIndex = 0; $updateIndex < $j && $updateIndex < count($updates); $updateIndex++) {
    $update = $updates[$updateIndex];
    $itemIndex = $update->itemIndex - 1; // Convert to 0-indexed

    if ($itemIndex < 0 || $itemIndex >= $n) {
      echo "Warning: Update {$updateIndex}: Item index {$update->itemIndex} is out of bounds. Skipping.\n";
      continue; // Skip out-of-bounds updates
    }

    $v[$itemIndex] += $update->delta;
  }

  return $v;
}

/**
 * Simulates an oblivious streaming algorithm for an (f, epsilon)-estimation problem.
 * An oblivious algorithm receives updates one by one and produces a solution
 * based on the cumulative frequency vector.  **Note:** In a real implementation,
 * the algorithm would maintain a sketch or summary of the stream rather than
 * storing the entire frequency vector.
 *
 * @param callable $f A function that takes a frequency vector v and returns a value in {0} U [1, alpha].
 * @param float $epsilon The error tolerance for the multiplicative approximation.
 * @param float $alpha The upper bound for the range of f. Must be >= 2.
 * @param int $n The size of the frequency vector (Z^n).
 * @param int $m An upper bound on the length of the stream.
 * @param StreamUpdate[] $updates A stream of updates.
 * @return float|null A (1 + epsilon)-multiplicative approximation to f(v(t)), where v(t) is the
 *          cumulative frequency vector after processing all updates. Returns null if alpha < 2.
 */
function obliviousStreamingAlgorithm(callable $f, float $epsilon, float $alpha, int $n, int $m, array $updates): ?float {
  if ($alpha < 2) {
    echo "Warning: Alpha must be greater than or equal to 2.\n";
    return null;
  }

  if ($epsilon < 0) {
    throw new InvalidArgumentException("Epsilon must be non-negative.");
  }

  if ($n <= 0) {
    throw new InvalidArgumentException("n must be a positive integer.");
  }

  if ($m <= 0) {
    throw new InvalidArgumentException("m must be a positive integer.");
  }

  if (count($updates) > $m) {
    echo "Warning: The number of updates exceeds the upper bound m.\n";
  }

  // 1. Calculate the frequency vector v(t) after applying all updates.
  $v = calculateFrequencyVector($n, $updates, min(count($updates), $m)); // Apply at most m updates

  // 2. Compute f(v(t)).
  $exactValue = $f($v);

  // 3. Compute a (1 + epsilon)-multiplicative approximation. In a real streaming
  //    setting, you would *estimate* f(v) using a sketching technique.
  if (isMultiplicativeApproximation($epsilon, $exactValue, $exactValue)) {
    return $exactValue;
  } else {
    // This case should not happen since x <= y && y < (1 + epsilon) * x; when y = x.
    return null;
  }
}

?>
