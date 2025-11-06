/**
 * Functions for checking multiplicative approximations.
 */

/**
 * Checks if y is a (1 + epsilon)-multiplicative approximation to x.
 * @param epsilon The error tolerance.
 * @param x The exact solution.
 * @param y The approximate solution.
 * @returns True if y is a valid (1 + epsilon)-multiplicative approximation to x, false otherwise.
 */
export function isMultiplicativeApproximation(epsilon: number, x: number, y: number): boolean {
  if (epsilon < 0) {
    throw new Error("Epsilon must be non-negative.");
  }
  if (x < 0 || y < 0) {
    throw new Error("x and y must be non-negative.");
  }

  return x <= y && y < (1 + epsilon) * x;
}

/**
 * Checks if y is a (1 + epsilon)-multiplicative approximation to x with two sided error.
 * @param epsilon The error tolerance.
 * @param x The exact solution.
 * @param y The approximate solution.
 * @returns True if y is a valid (1 + epsilon)-multiplicative approximation to x, false otherwise.
 */
export function isMultiplicativeApproximationTwoSided(epsilon: number, x: number, y: number): boolean {
  if (epsilon < 0) {
    throw new Error("Epsilon must be non-negative.");
  }
  if (x < 0 || y < 0) {
    throw new Error("x and y must be non-negative.");
  }

  return x / (1 + epsilon) < y && y < (1 + epsilon) * x;
}

/**
 * Calculates the epsilon-flip number of a sequence of real numbers.
 * @param sequence The sequence of real numbers.
 * @param epsilon The error tolerance.
 * @returns The epsilon-flip number of the sequence.
 */
export function calculateFlipNumber(sequence: number[], epsilon: number): number {
  if (epsilon < 0) {
    throw new Error("Epsilon must be non-negative.");
  }

  let flipNumber = 0;
  if (sequence.length < 2) {
    return flipNumber; // No flips possible with fewer than 2 elements
  }

  let lastValidIndex = 0; // Start from the beginning of the sequence
  flipNumber = 1; // Initialize the flip number with the first valid index;

  for (let currentIndex = 1; currentIndex < sequence.length; currentIndex++) {
    const prevValue = sequence[lastValidIndex];
    const currentValue = sequence[currentIndex];

    if (
      currentValue < (1 - epsilon) * prevValue ||
      currentValue > (1 + epsilon) * prevValue
    ) {
      //Not in range, update flip number and valid index
      flipNumber++;
      lastValidIndex = currentIndex;
    }
  }

  return flipNumber;
}
