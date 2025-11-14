<?php

/**
 * Utility functions for general use.
 */

/**
 * Represents the set of integers from 1 to k (inclusive).
 * @param int $k The upper bound of the set.
 * @return array An array containing the integers from 1 to k.
 */
function range_util(int $k): array {
  if ($k <= 0) {
    return [];
  }
  return range(1, $k);
}

/**
 * Calculates the 0-norm (density/sparsity) of a vector.
 * @param array $x The input vector.
 * @return int The number of non-zero elements in the vector.
 */
function calculateDensity(array $x): int {
  $density = 0;
  foreach ($x as $element) {
    if ($element !== 0) {
      $density++;
    }
  }
  return $density;
}

?>
