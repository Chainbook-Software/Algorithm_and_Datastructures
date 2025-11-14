"""
Functions for checking multiplicative approximations.
"""

def is_multiplicative_approximation(epsilon: float, x: float, y: float) -> bool:
  """Checks if y is a (1 + epsilon)-multiplicative approximation to x.

  Args:
    epsilon: The error tolerance.
    x: The exact solution.
    y: The approximate solution.

  Returns:
    True if y is a valid (1 + epsilon)-multiplicative approximation to x, false otherwise.

  Raises:
    ValueError: If epsilon is negative or x and y are negative.
  """
  if epsilon < 0:
    raise ValueError("Epsilon must be non-negative.")
  if x < 0 or y < 0:
    raise ValueError("x and y must be non-negative.")

  return x <= y and y < (1 + epsilon) * x

def is_multiplicative_approximation_two_sided(epsilon: float, x: float, y: float) -> bool:
  """Checks if y is a (1 + epsilon)-multiplicative approximation to x with two sided error.

  Args:
    epsilon: The error tolerance.
    x: The exact solution.
    y: The approximate solution.

  Returns:
    True if y is a valid (1 + epsilon)-multiplicative approximation to x, false otherwise.

  Raises:
    ValueError: If epsilon is negative or x and y are negative.
  """
  if epsilon < 0:
    raise ValueError("Epsilon must be non-negative.")
  if x < 0 or y < 0:
    raise ValueError("x and y must be non-negative.")

  return x / (1 + epsilon) < y and y < (1 + epsilon) * x

def calculate_flip_number(sequence: list, epsilon: float) -> int:
  """Calculates the epsilon-flip number of a sequence of real numbers.

  Args:
    sequence: The sequence of real numbers.
    epsilon: The error tolerance.

  Returns:
    The epsilon-flip number of the sequence.

  Raises:
    ValueError: If epsilon is negative.
  """
  if epsilon < 0:
    raise ValueError("Epsilon must be non-negative.")

  flip_number = 0
  if len(sequence) < 2:
    return flip_number  # No flips possible with fewer than 2 elements

  last_valid_index = 0  # Start from the beginning of the sequence
  flip_number = 1  # Initialize the flip number with the first valid index;

  for current_index in range(1, len(sequence)):
    prev_value = sequence[last_valid_index]
    current_value = sequence[current_index]

    if (
      current_value < (1 - epsilon) * prev_value or
      current_value > (1 + epsilon) * prev_value
    ):
      # Not in range, update flip number and valid index
      flip_number += 1
      last_valid_index = current_index

  return flip_number
