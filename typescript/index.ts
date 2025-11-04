/**
 * Main module exports for the multiplicative approximations library.
 */

export { range, calculateDensity } from './utils';
export { isMultiplicativeApproximation, isMultiplicativeApproximationTwoSided, calculateFlipNumber } from './approximations';
export { StreamUpdate, calculateFrequencyVector, obliviousStreamingAlgorithm } from './estimator';
