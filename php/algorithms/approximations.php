<?php

/**
 * Functions for checking multiplicative approximations.
 */

/**
 * Checks if y is a (1 + epsilon)-multiplicative approximation to x.
 * @param float $epsilon The error tolerance.
 * @param float $x The exact solution.
 * @param float $y The approximate solution.
 * @return bool True if y is a valid (1 + epsilon)-multiplicative approximation to x, false otherwise.
 */
function isMultiplicativeApproximation(float $epsilon, float $x, float $y): bool {
  if ($epsilon < 0) {
    throw new InvalidArgumentException("Epsilon must be non-negative.");
  }
  if ($x < 0 || $y < 0) {
    throw new InvalidArgumentException("x and y must be non-negative.");
  }

  return $x <= $y && $y < (1 + $epsilon) * $x;
}

/**
 * Checks if y is a (1 + epsilon)-multiplicative approximation to x with two sided error.
 * @param float $epsilon The error tolerance.
 * @param float $x The exact solution.
 * @param float $y The approximate solution.
 * @return bool True if y is a valid (1 + epsilon)-multiplicative approximation to x, false otherwise.
 */
function isMultiplicativeApproximationTwoSided(float $epsilon, float $x, float $y): bool {
  if ($epsilon < 0) {
    throw new InvalidArgumentException("Epsilon must be non-negative.");
  }
  if ($x < 0 || $y < 0) {
    throw new InvalidArgumentException("x and y must be non-negative.");
  }

  return $x / (1 + $epsilon) < $y && $y < (1 + $epsilon) * $x;
}

/**
 * Calculates the epsilon-flip number of a sequence of real numbers.
 * @param array $sequence The sequence of real numbers.
 * @param float $epsilon The error tolerance.
 * @return int The epsilon-flip number of the sequence.
 */
function calculateFlipNumber(array $sequence, float $epsilon): int {
  if ($epsilon < 0) {
    throw new InvalidArgumentException("Epsilon must be non-negative.");
  }

  $flipNumber = 0;
  if (count($sequence) < 2) {
    return $flipNumber; // No flips possible with fewer than 2 elements
  }

  $lastValidIndex = 0; // Start from the beginning of the sequence
  $flipNumber = 1; // Initialize the flip number with the first valid index;

  for ($currentIndex = 1; $currentIndex < count($sequence); $currentIndex++) {
    $prevValue = $sequence[$lastValidIndex];
    $currentValue = $sequence[$currentIndex];

    if (
      $currentValue < (1 - $epsilon) * $prevValue ||
      $currentValue > (1 + $epsilon) * $prevValue
    ) {
      //Not in range, update flip number and valid index
      $flipNumber++;
      $lastValidIndex = $currentIndex;
    }
  }

  return $flipNumber;
}

?>
