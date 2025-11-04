/**
 * Example: Recommendation System for E-Commerce (e.g., Netflix/Amazon)
 *
 * This simulates a streaming recommendation engine where user ratings arrive as updates.
 * We estimate user preferences, verify approximation accuracy, and measure data sparsity.
 */

import * as Alg from './index';

// Define a preference function: f(v) = sum of ratings (0 if no ratings, else max(1, sum))
const userPreferenceFunction = (ratings: number[]): number => {
  const sum = ratings.reduce((acc, val) => acc + val, 0);
  return sum === 0 ? 0 : Math.max(1, sum);
};

// Simulate streaming updates: Each update is a user rating for an item (1-5 scale, mapped to -2 to +2 for variety)
const simulateUpdates = (): Alg.StreamUpdate[] => [
  { itemIndex: 1, delta: 2 }, // User liked item 1 (+2)
  { itemIndex: 2, delta: -1 }, // User disliked item 2 (-1)
  { itemIndex: 1, delta: 1 }, // Additional like for item 1 (+1)
  { itemIndex: 3, delta: 2 }, // Liked item 3 (+2)
  { itemIndex: 4, delta: -2 }, // Strongly disliked item 4 (-2)
];

// Main example
const runRecommendationExample = () => {
  const epsilon = 0.1; // 10% error tolerance
  const alpha = 10; // Upper bound for preference scores
  const n = 5; // Number of items (vector size)
  const m = 10; // Max stream length
  const updates = simulateUpdates();

  console.log('Streaming Updates:', updates);

  // 1. Estimate user preference using oblivious streaming algorithm
  const estimatedPreference = Alg.obliviousStreamingAlgorithm(
    userPreferenceFunction,
    epsilon,
    alpha,
    n,
    m,
    updates
  );

  if (estimatedPreference !== null) {
    console.log(`Estimated User Preference: ${estimatedPreference}`);

    // Compute exact preference for comparison (in real scenarios, this wouldn't be available)
    const exactVector = Alg.calculateFrequencyVector(n, updates, updates.length);
    const exactPreference = userPreferenceFunction(exactVector);
    console.log(`Exact User Preference: ${exactPreference}`);

    // 2. Verify if estimate meets approximation threshold
    const isAccurate = Alg.isMultiplicativeApproximation(epsilon, exactPreference, estimatedPreference);
    console.log(`Meets 10% Approximation Threshold: ${isAccurate}`);

    // 3. Calculate data sparsity (density of non-zero ratings)
    const sparsity = Alg.calculateDensity(exactVector);
    console.log(`Data Sparsity (Non-Zero Ratings): ${sparsity}/${n} (${((sparsity / n) * 100).toFixed(1)}% dense)`);
    console.log('Benefit: Low density indicates efficient storage/computation in large matrices.');
  } else {
    console.log('Estimation failed (e.g., invalid alpha).');
  }
};

// Run the example
runRecommendationExample();
