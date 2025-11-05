# Algorithms

This directory contains algorithm implementations.

## Files

### Tree Algorithms
- `subtreeMode.ts` - Computes the mode (most frequent color) for each subtree in a tree

### Approximation Algorithms
- `approximations.ts` - Functions for checking multiplicative approximations
  - `isMultiplicativeApproximation` - Checks (1 + ε)-multiplicative approximation
  - `isMultiplicativeApproximationTwoSided` - Checks two-sided approximation
  - `calculateFlipNumber` - Calculates ε-flip number of a sequence

### Streaming Algorithms
- `estimator.ts` - Estimation functions for streaming data
  - `calculateFrequencyVector` - Calculates frequency vector from stream updates
  - `obliviousStreamingAlgorithm` - Streaming algorithm for (f, ε)-estimation problem

### Utilities
- `utils.ts` - General utility functions
  - `range` - Generates integer range [1, k]
  - `calculateDensity` - Calculates vector sparsity (0-norm)

### Clustering Algorithms
- `clustering.ts` - Correlation clustering for signed graphs
  - `CorrelationClustering` - Main class for correlation clustering
  - `Clustering` - Interface for clustering results
  - Greedy algorithms to minimize clustering disagreements

### Examples
- `examples/recommendationExample.ts` - E-commerce recommendation system example

## Usage

```typescript
import { subtreeMode, isMultiplicativeApproximation, calculateDensity } from './algorithms';

// Use algorithms with data structures
const result = subtreeMode(treeRoot);
const isValid = isMultiplicativeApproximation(0.1, 10, 10.5);
const density = calculateDensity([1, 0, 2, 0, 3]);
```
