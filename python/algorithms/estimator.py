"""
Estimation functions for streaming settings.

This module provides algorithms for estimating function values in streaming data environments.
The core function, estimateFunction, addresses the (f, epsilon)-estimation problem: given a function f
that maps vectors to values in {0} ∪ [1, α], and a stream of updates to an initial zero vector,
compute a (1 + epsilon)-multiplicative approximation to f(v) without storing the entire vector.

Key concepts:
- Streaming setting: Data arrives as updates, not all at once, requiring memory-efficient processing.
- Multiplicative approximation: The result y satisfies x ≤ y < (1 + ε)x for the exact value x = f(v).
- Vector updates: Each update modifies a specific index of the vector by adding a value.

Use cases: Applicable in big data scenarios, online algorithms, and approximation schemes for NP-hard problems
where exact computation is infeasible due to large input sizes.
"""

from typing import List, Callable, Optional
from dataclasses import dataclass
from algorithms.approximations import is_multiplicative_approximation

@dataclass
class StreamUpdate:
  """Represents a stream update."""
  item_index: int  # i_j: The index of the item being updated (1-indexed).
  delta: float  # Delta_j: The change in frequency (can be any number).

def calculate_frequency_vector(n: int, updates: List[StreamUpdate], j: int) -> List[float]:
  """Calculates the frequency vector v(j) after applying the first j updates
  to the all-zero vector.

  Args:
    n: The size of the frequency vector (Z^n).
    updates: A stream of updates (itemIndex, delta). itemIndex is 1-indexed.
    j: The number of updates to apply (prefix of the stream).

  Returns:
    The frequency vector v(j).

  Raises:
    ValueError: If n is not a positive integer.
  """
  if n <= 0:
    raise ValueError("n must be a positive integer.")

  v = [0.0] * n  # Initialize all-zero vector

  for update_index in range(min(j, len(updates))):
    update = updates[update_index]
    item_index = update.item_index - 1  # Convert to 0-indexed

    if item_index < 0 or item_index >= n:
      print(f"Warning: Update {update_index + 1}: Item index {update.item_index} is out of bounds. Skipping.")
      continue  # Skip out-of-bounds updates

    v[item_index] += update.delta

  return v

def oblivious_streaming_algorithm(
  f: Callable[[List[float]], float],
  epsilon: float,
  alpha: float,
  n: int,
  m: int,
  updates: List[StreamUpdate]
) -> Optional[float]:
  """Simulates an oblivious streaming algorithm for an (f, epsilon)-estimation problem.
  An oblivious algorithm receives updates one by one and produces a solution
  based on the cumulative frequency vector.  **Note:** In a real implementation,
  the algorithm would maintain a sketch or summary of the stream rather than
  storing the entire frequency vector.

  Args:
    f: A function that takes a frequency vector v and returns a value in {0} U [1, alpha].
    epsilon: The error tolerance for the multiplicative approximation.
    alpha: The upper bound for the range of f. Must be >= 2.
    n: The size of the frequency vector (Z^n).
    m: An upper bound on the length of the stream.
    updates: A stream of updates.

  Returns:
    A (1 + epsilon)-multiplicative approximation to f(v(t)), where v(t) is the
    cumulative frequency vector after processing all updates. Returns None if alpha < 2.

  Raises:
    ValueError: If epsilon is negative or n/m are not positive integers.
  """
  if alpha < 2:
    print("Warning: Alpha must be greater than or equal to 2.")
    return None

  if epsilon < 0:
    raise ValueError("Epsilon must be non-negative.")

  if n <= 0:
    raise ValueError("n must be a positive integer.")

  if m <= 0:
    raise ValueError("m must be a positive integer.")

  if len(updates) > m:
    print("Warning: The number of updates exceeds the upper bound m.")

  # 1. Calculate the frequency vector v(t) after applying all updates.
  v = calculate_frequency_vector(n, updates, min(len(updates), m))  # Apply at most m updates

  # 2. Compute f(v(t)).
  exact_value = f(v)

  # 3. Compute a (1 + epsilon)-multiplicative approximation. In a real streaming
  #    setting, you would *estimate* f(v) using a sketching technique.
  if is_multiplicative_approximation(epsilon, exact_value, exact_value):
    return exact_value
  else:
    # This case should not happen since x <= y && y < (1 + epsilon) * x; when y = x.
    return None
