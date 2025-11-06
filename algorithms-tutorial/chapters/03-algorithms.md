# Chapter 3: Understanding Algorithms

## 🎯 Learning Objectives

By the end of this chapter, you will:
- Understand what algorithms are and their key characteristics
- Implement linear search and analyze its efficiency
- Learn from our approximation algorithms in the codebase
- Implement binary search (much more efficient!)
- Create bubble sort and understand sorting algorithms
- Analyze algorithm complexity using Big O notation

## 📖 What Are Algorithms?

Algorithms are step-by-step procedures or formulas for solving problems. They take input, process it using data structures, and produce output. The same problem can often be solved with different algorithms, each with different efficiency trade-offs.

### Key Characteristics

1. **Correctness**: Does the algorithm solve the problem correctly?
2. **Efficiency**: How fast and how much memory does it use?
3. **Input/Output**: What data does it expect and produce?
4. **Termination**: Does it always finish?

### Why Algorithms Matter

- **Performance**: Fast algorithms can handle large datasets
- **Scalability**: Good algorithms grow efficiently with data size
- **Resource Usage**: Efficient algorithms use less CPU and memory
- **Problem Solving**: Algorithms teach systematic thinking

## 💻 Example 1: Linear Search Algorithm

Let's implement a simple search algorithm. This searches through an array to find a target value:

```typescript
function linearSearch<T>(array: T[], target: T): number {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}
```

### Testing Linear Search

```typescript
function testLinearSearch() {
  const numbers = [1, 3, 5, 7, 9];

  // Test successful searches
  console.assert(linearSearch(numbers, 5) === 2, "Should find 5 at index 2");
  console.assert(linearSearch(numbers, 1) === 0, "Should find 1 at index 0");
  console.assert(linearSearch(numbers, 9) === 4, "Should find 9 at index 4");

  // Test unsuccessful search
  console.assert(linearSearch(numbers, 4) === -1, "Should not find 4");

  // Test edge cases
  console.assert(linearSearch([], 5) === -1, "Empty array should return -1");
  console.assert(linearSearch([5], 5) === 0, "Single element array");

  console.log("✅ All linear search tests passed!");
}

testLinearSearch();
```

**Analysis:**
- **Time Complexity**: O(n) - in the worst case, checks every element
- **Space Complexity**: O(1) - uses constant extra space
- **Correctness**: Always finds the element if it exists
- **Best Case**: O(1) - element found at first position
- **Worst Case**: O(n) - element not found or at last position

## 📚 Learning from Our Approximation Algorithms

Our codebase has sophisticated approximation algorithms. Let's create a simpler approximation algorithm:

```typescript
// Check if y is within epsilon of x (simple additive approximation)
function isAdditiveApproximation(epsilon: number, x: number, y: number): boolean {
  if (epsilon < 0) {
    throw new Error("Epsilon must be non-negative");
  }
  return Math.abs(x - y) <= epsilon;
}

// Usage - check if 10.5 is within 1.0 of 10
console.log(isAdditiveApproximation(1.0, 10, 10.5)); // true
console.log(isAdditiveApproximation(0.5, 10, 10.5)); // false
```

**Learning from Our Codebase:**
- Our [`isMultiplicativeApproximation`](../../../typescript/algorithms/approximations.ts) uses relative error (multiplicative)
- We added input validation (non-negative epsilon)
- This shows how to create robust, validated algorithms

### Testing Approximation Algorithm

```typescript
function testApproximation() {
  // Test basic approximation
  console.assert(isAdditiveApproximation(1.0, 10, 10.5) === true);
  console.assert(isAdditiveApproximation(0.5, 10, 10.5) === false);

  // Test exact match
  console.assert(isAdditiveApproximation(0, 5, 5) === true);

  // Test negative epsilon (should throw)
  try {
    isAdditiveApproximation(-1, 10, 11);
    console.assert(false, "Should have thrown error for negative epsilon");
  } catch (error) {
    console.assert(error.message === "Epsilon must be non-negative");
  }

  console.log("✅ All approximation tests passed!");
}

testApproximation();
```

## 💻 Example 3: Binary Search (More Efficient Search)

Binary search works on **sorted** arrays and is much faster than linear search:

```typescript
function binarySearch<T>(array: T[], target: T): number {
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (array[middle] === target) {
      return middle; // Found!
    } else if (array[middle] < target) {
      left = middle + 1; // Search right half
    } else {
      right = middle - 1; // Search left half
    }
  }

  return -1; // Not found
}
```

### Testing Binary Search

```typescript
function testBinarySearch() {
  const sortedNumbers = [1, 3, 5, 7, 9, 11];

  // Test successful searches
  console.assert(binarySearch(sortedNumbers, 5) === 2, "Should find 5 at index 2");
  console.assert(binarySearch(sortedNumbers, 1) === 0, "Should find 1 at index 0");
  console.assert(binarySearch(sortedNumbers, 11) === 5, "Should find 11 at index 5");

  // Test unsuccessful search
  console.assert(binarySearch(sortedNumbers, 4) === -1, "Should not find 4");

  // Test edge cases
  console.assert(binarySearch([], 5) === -1, "Empty array should return -1");
  console.assert(binarySearch([5], 5) === 0, "Single element array");

  console.log("✅ All binary search tests passed!");
}

testBinarySearch();
```

**Analysis:**
- **Time Complexity**: O(log n) - much faster than O(n)!
- **Space Complexity**: O(1)
- **Requirement**: Array must be sorted
- **Best Case**: O(1) - element found at middle
- **Worst Case**: O(log n) - need to search entire tree

### Comparison: Linear vs Binary Search

For an array of 1,000,000 elements:
- **Linear Search**: Up to 1,000,000 comparisons (worst case)
- **Binary Search**: Up to 20 comparisons (worst case)

That's a **50,000x improvement**!

## ✅ Exercise 2: Implement Bubble Sort

Bubble sort is a simple sorting algorithm. Implement a function that sorts an array of numbers in ascending order using the bubble sort algorithm.

### How Bubble Sort Works:
1. Compare adjacent elements
2. Swap if they're in wrong order
3. Repeat until no swaps needed
4. Each pass moves largest element to end

### Requirements:
- Sort array of numbers in ascending order
- Use bubble sort algorithm
- Return the sorted array
- Don't modify original array

### Solution Template:

```typescript
function bubbleSort(array: number[]): number[] {
  // Create a copy to avoid modifying original
  const result = [...array];

  // Your bubble sort implementation here

  return result;
}
```

### Test Cases:

```typescript
function testBubbleSort() {
  // Test basic sorting
  console.assert(
    bubbleSort([3, 1, 4, 1, 5]).join(',') === [1, 1, 3, 4, 5].join(','),
    "Should sort basic array"
  );

  // Test already sorted
  console.assert(
    bubbleSort([1, 2, 3, 4, 5]).join(',') === [1, 2, 3, 4, 5].join(','),
    "Should handle already sorted array"
  );

  // Test reverse sorted
  console.assert(
    bubbleSort([5, 4, 3, 2, 1]).join(',') === [1, 2, 3, 4, 5].join(','),
    "Should handle reverse sorted array"
  );

  // Test empty array
  console.assert(bubbleSort([]).length === 0, "Should handle empty array");

  // Test single element
  console.assert(bubbleSort([42])[0] === 42, "Should handle single element");

  console.log("✅ All bubble sort tests passed!");
}
```

### Bubble Sort Implementation:

```typescript
function bubbleSort(array: number[]): number[] {
  const result = [...array]; // Copy to avoid modifying original

  for (let i = 0; i < result.length - 1; i++) {
    for (let j = 0; j < result.length - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        // Swap elements
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }

  return result;
}
```

**Analysis:**
- **Time Complexity**: O(n²) - nested loops
- **Space Complexity**: O(n) - creates a copy
- **Stable**: Equal elements keep their relative order
- **Adaptive**: Can be optimized to stop early if already sorted

## 🎯 Chapter Summary

In this chapter, you learned:

1. **Algorithm Fundamentals**: Correctness, efficiency, termination
2. **Linear Search**: Simple O(n) search algorithm
3. **Approximation Algorithms**: Learning from our codebase
4. **Binary Search**: Efficient O(log n) search on sorted arrays
5. **Bubble Sort**: Simple O(n²) sorting algorithm
6. **Complexity Analysis**: Big O notation and performance comparison

## 🔗 Key Concepts Review

- **Linear Search**: O(n) - checks each element
- **Binary Search**: O(log n) - divide and conquer
- **Bubble Sort**: O(n²) - nested comparisons
- **Big O**: Measures algorithm efficiency
- **Sorted Requirement**: Binary search needs sorted data

## 🚀 Next Steps

Now that you understand algorithms, in **Chapter 4** we'll combine data structures and algorithms. You'll see how they work together to solve complex problems!

## 📚 Additional Resources

- **Big O Cheat Sheet**: Search online for complexity comparisons
- **Our Codebase**: Look at `algorithms/stateMachineAlgorithms.ts` for advanced algorithms
- **Visualizations**: Use tools like Algorithm Visualizer to see algorithms in action

---

**Completed the exercise?** Implement bubble sort and test it thoroughly, then head to [Chapter 4: Combining Data Structures and Algorithms](./04-combining-concepts.md) to see how they work together!</content>
<parameter name="filePath">/Users/macbookpro/GUSKI/Algorithms_and_Datastructures/algorithms-tutorial/chapters/03-algorithms.md
