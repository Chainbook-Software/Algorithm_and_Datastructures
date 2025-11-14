"""
Utility functions for general use.
"""

def range_util(k: int) -> list:
  """Represents the set of integers from 1 to k (inclusive).

  Args:
    k: The upper bound of the set.

  Returns:
    An array containing the integers from 1 to k.
  """
  if k <= 0:
    return []
  return list(range(1, k + 1))

def calculate_density(x: list) -> int:
  """Calculates the 0-norm (density/sparsity) of a vector.

  Args:
    x: The input vector.

  Returns:
    The number of non-zero elements in the vector.
  """
  density = 0
  for element in x:
    if element != 0:
      density += 1
  return density
