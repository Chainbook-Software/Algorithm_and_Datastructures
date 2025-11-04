/**
 * Utility functions for multiplicative approximations and range generation.
 *
 * Use Case: This module is used in algorithm analysis and validation, particularly for approximation algorithms in NP-hard optimization problems (e.g., greedy algorithms, dynamic programming). It helps verify if approximate solutions meet (1 + ε)-multiplicative bounds, ensuring performance guarantees in problems like knapsack, traveling salesman, or facility location. The `range` function aids in generating test data for such evaluations.
 */

import { range, isMultiplicativeApproximation, isMultiplicativeApproximationTwoSided, StreamUpdate, calculateFrequencyVector, obliviousStreamingAlgorithm, calculateDensity, calculateFlipNumber } from './index';

// Example Usage:
const k = 5;
const setK = range(k);
console.log(`[k] for k=${k}:`, setK);

const epsilon = 0.1;
const exactSolution = 10;
const approximateSolution = 10.5;

const isApprox = isMultiplicativeApproximation(epsilon, exactSolution, approximateSolution);
console.log(`${approximateSolution} is a (1 + ${epsilon}) multiplicative approximation of ${exactSolution}:`, isApprox);

const approximateSolutionTwoSided = 9.5;
const isApproxTwoSided = isMultiplicativeApproximationTwoSided(epsilon, exactSolution, approximateSolutionTwoSided);
console.log(`${approximateSolutionTwoSided} is a (1 + ${epsilon}) multiplicative approximation of ${exactSolution} (two sided):`, isApproxTwoSided);

// Example Usage of obliviousStreamingAlgorithm:
// Define a sample function f: Zn -> {0} U [1, alpha]
const sampleF = (v: number[]): number => {
  let sum = 0;
  for (const val of v) {
    sum += val;
  }
  return sum === 0 ? 0 : Math.max(1, sum); // Ensure output is in {0} U [1, alpha]
};

const alpha = 5;
const n = 4; // Size of the frequency vector (Z^n)
const m = 10; // Upper bound on the length of the stream
const streamUpdates: StreamUpdate[] = [
  { itemIndex: 1, delta: 1 }, // Increase frequency of item 1 by 1
  { itemIndex: 2, delta: -1 }, // Decrease frequency of item 2 by 1
  { itemIndex: 1, delta: 1 }, // Increase frequency of item 1 by 1 again
  { itemIndex: 3, delta: 1 }, // Increase frequency of item 3 by 1
  { itemIndex: 4, delta: -1 },// Decrease frequency of item 4 by 1
  { itemIndex: 1, delta: -1 }, // decrease frequency of item 1 by 1
];

const approximationOblivious = obliviousStreamingAlgorithm(sampleF, epsilon, alpha, n, m, streamUpdates);

if (approximationOblivious !== null) {
  console.log("Approximation of f(v) with oblivious streaming:", approximationOblivious);
} else {
  console.log("Could not compute approximation (alpha < 2).");
}

// Example of calculating the frequency vector after a prefix of the stream:
const j = 3;
const frequencyVectorPrefix = calculateFrequencyVector(n, streamUpdates, j);
console.log(`Frequency vector v(${j}) after ${j} updates:`, frequencyVectorPrefix);

// Example of calculating density:
const densityVector = [1, 0, 2, -1, 0, 3];
const density = calculateDensity(densityVector);
console.log("Density of the vector:", density);

// Example of calculating flip number:
const numberSequence = [1, 1.2, 0.5, 1.8, 2.1];
const flipNumber = calculateFlipNumber(numberSequence, 0.2);
console.log("Flip number of the sequence:", flipNumber);
