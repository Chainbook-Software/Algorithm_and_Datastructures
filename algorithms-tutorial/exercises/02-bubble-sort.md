# Exercise 2: Implement Bubble Sort

## 🎯 Objective
Implement the bubble sort algorithm to sort an array of numbers in ascending order.

## 📖 How Bubble Sort Works

Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.

### Algorithm Steps:
1. Compare each pair of adjacent elements
2. Swap them if they are in the wrong order
3. Repeat until no swaps are needed
4. Each pass moves the largest element to the end

### Visual Example:
```
Initial: [3, 1, 4, 1, 5]
Pass 1:  [1, 3, 1, 4, 5]  (3 > 1, swap)
         [1, 1, 3, 4, 5]  (3 > 1, swap)
         [1, 1, 3, 4, 5]  (3 < 4, no swap)
         [1, 1, 3, 4, 5]  (4 < 5, no swap)

Pass 2:  [1, 1, 3, 4, 5]  (1 == 1, no swap)
         [1, 1, 3, 4, 5]  (1 < 3, no swap)
         [1, 1, 3, 4, 5]  (3 < 4, no swap)

Result:  [1, 1, 3, 4, 5]  (Already sorted!)
```

## 💻 Implementation Requirements

- Sort array of numbers in ascending order
- Use bubble sort algorithm
- Return a new sorted array (don't modify original)
- Handle edge cases (empty array, single element, already sorted)

## 📝 Solution Template

```typescript
function bubbleSort(array: number[]): number[] {
  // Create a copy to avoid modifying original
  const result = [...array];

  // Your bubble sort implementation here

  return result;
}
```

## ✅ Test Cases

```typescript
function testBubbleSort() {
  // Test basic sorting
  console.assert(
    bubbleSort([3, 1, 4, 1, 5]).join(',') === [1, 1, 3, 4, 5].join(','),
    "Should sort basic array"
  );

  // Test already sorted array
  console.assert(
    bubbleSort([1, 2, 3, 4, 5]).join(',') === [1, 2, 3, 4, 5].join(','),
    "Should handle already sorted array"
  );

  // Test reverse sorted array
  console.assert(
    bubbleSort([5, 4, 3, 2, 1]).join(',') === [1, 2, 3, 4, 5].join(','),
    "Should handle reverse sorted array"
  );

  // Test array with duplicates
  console.assert(
    bubbleSort([3, 1, 4, 1, 5, 2, 3]).join(',') === [1, 1, 2, 3, 3, 4, 5].join(','),
    "Should handle duplicates correctly"
  );

  // Test empty array
  console.assert(bubbleSort([]).length === 0, "Should handle empty array");

  // Test single element
  console.assert(bubbleSort([42])[0] === 42, "Should handle single element");

  // Test negative numbers
  console.assert(
    bubbleSort([3, -1, 4, -5, 0]).join(',') === [-5, -1, 0, 3, 4].join(','),
    "Should handle negative numbers"
  );

  console.log("✅ All bubble sort tests passed!");
}

// Run the tests
testBubbleSort();
```

## 💡 Implementation Hints

### Basic Structure:
```typescript
function bubbleSort(array: number[]): number[] {
  const result = [...array]; // Copy to avoid modifying original

  // Outer loop: number of passes
  for (let i = 0; i < result.length - 1; i++) {
    // Inner loop: compare adjacent elements
    for (let j = 0; j < result.length - i - 1; j++) {
      // Compare and swap if needed
      if (result[j] > result[j + 1]) {
        // Swap elements
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }

  return result;
}
```

### Key Points:
1. **Outer Loop**: Controls the number of passes (n-1 passes for n elements)
2. **Inner Loop**: Compares adjacent elements (reduces by i each pass)
3. **Comparison**: `result[j] > result[j + 1]` for ascending order
4. **Swap**: Use array destructuring `[a, b] = [b, a]`

## 📊 Complexity Analysis

- **Time Complexity**: O(n²) - nested loops
- **Space Complexity**: O(n) - creates a copy
- **Stability**: Bubble sort is stable (equal elements keep relative order)
- **Adaptability**: Can be optimized to stop early if already sorted

## 🚀 Extension Ideas

### Optimization 1: Early Termination
Stop if no swaps occurred in a pass (array already sorted):

```typescript
function optimizedBubbleSort(array: number[]): number[] {
  const result = [...array];

  for (let i = 0; i < result.length - 1; i++) {
    let swapped = false;

    for (let j = 0; j < result.length - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }

    // If no swaps occurred, array is already sorted
    if (!swapped) {
      break;
    }
  }

  return result;
}
```

### Optimization 2: Bidirectional Bubble Sort (Cocktail Sort)
Alternate between forward and backward passes:

```typescript
function cocktailSort(array: number[]): number[] {
  const result = [...array];
  let start = 0;
  let end = result.length - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;

    // Forward pass
    for (let i = start; i < end; i++) {
      if (result[i] > result[i + 1]) {
        [result[i], result[i + 1]] = [result[i + 1], result[i]];
        swapped = true;
      }
    }

    if (!swapped) break;
    swapped = false;
    end--;

    // Backward pass
    for (let i = end - 1; i >= start; i--) {
      if (result[i] > result[i + 1]) {
        [result[i], result[i + 1]] = [result[i + 1], result[i]];
        swapped = true;
      }
    }

    start++;
  }

  return result;
}
```

## 🎯 Learning Objectives

By completing this exercise, you will:
- Understand comparison-based sorting algorithms
- Implement nested loop patterns
- Practice array manipulation and swapping
- Analyze algorithm complexity
- Learn optimization techniques

## 🔗 Related Concepts

- **Selection Sort**: Find minimum element each pass
- **Insertion Sort**: Build sorted array one element at a time
- **Quick Sort**: Divide and conquer approach (much faster!)
- **Merge Sort**: Divide and merge approach (stable and efficient)</content>
<parameter name="filePath">/Users/macbookpro/GUSKI/Algorithms_and_Datastructures/algorithms-tutorial/exercises/02-bubble-sort.md
