# Chapter 5: Best Practices

## 🎯 Learning Objectives

By the end of this chapter, you will:
- Write comprehensive tests for your data structures and algorithms
- Document your code with proper JSDoc comments
- Analyze and understand Big O complexity
- Implement proper error handling and input validation
- Follow TypeScript best practices for type safety

## ✅ Testing Your Code

Always test your implementations. Here's how to test the Stack we created:

```typescript
// Test functions for our ArrayStack
function testStack() {
  const stack = new ArrayStack<number>();

  // Test empty stack
  console.assert(stack.isEmpty() === true, "Stack should be empty initially");
  console.assert(stack.size() === 0, "Size should be 0");

  // Test push
  stack.push(1);
  console.assert(stack.isEmpty() === false, "Stack should not be empty after push");
  console.assert(stack.size() === 1, "Size should be 1");
  console.assert(stack.peek() === 1, "Peek should return 1");

  // Test pop
  const popped = stack.pop();
  console.assert(popped === 1, "Pop should return 1");
  console.assert(stack.isEmpty() === true, "Stack should be empty after pop");

  console.log("✅ All stack tests passed!");
}

// Test edge cases
function testStackEdgeCases() {
  const stack = new ArrayStack<string>();

  // Test with strings
  stack.push("hello");
  stack.push("world");
  console.assert(stack.peek() === "world", "Should peek last pushed item");
  console.assert(stack.pop() === "world", "Should pop last pushed item");

  // Test large numbers
  const bigStack = new ArrayStack<number>();
  for (let i = 0; i < 1000; i++) {
    bigStack.push(i);
  }
  console.assert(bigStack.size() === 1000, "Should handle large stacks");
  console.assert(bigStack.pop() === 999, "Should pop last item");

  console.log("✅ All stack edge case tests passed!");
}

// Run all tests
testStack();
testStackEdgeCases();
```

### Testing Best Practices

1. **Test Normal Cases**: Expected inputs and outputs
2. **Test Edge Cases**: Empty inputs, single elements, large inputs
3. **Test Error Cases**: Invalid inputs, boundary conditions
4. **Test Performance**: For large datasets (if applicable)
5. **Use Assertions**: Clear failure messages

## 📚 Documentation Standards

Document your code with JSDoc comments for professional code:

```typescript
/**
 * Calculates the sum of all elements in an array.
 * @param numbers Array of numbers to sum
 * @returns The sum of all numbers
 * @throws {TypeError} If input is not an array of numbers
 * @example
 * ```typescript
 * sumArray([1, 2, 3]) // returns 6
 * sumArray([]) // returns 0
 * ```
 */
function sumArray(numbers: number[]): number {
  if (!Array.isArray(numbers)) {
    throw new TypeError("Input must be an array");
  }

  let sum = 0;
  for (const num of numbers) {
    if (typeof num !== 'number') {
      throw new TypeError("All elements must be numbers");
    }
    sum += num;
  }

  return sum;
}

/**
 * A generic stack data structure implementing LIFO (Last In, First Out) principle.
 * @template T The type of elements in the stack
 */
class ArrayStack<T> implements Stack<T> {
  private items: T[] = [];

  /**
   * Adds an item to the top of the stack.
   * @param item The item to add
   * @timeComplexity O(1)
   * @spaceComplexity O(1) amortized
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns the top item from the stack.
   * @returns The top item, or undefined if stack is empty
   * @timeComplexity O(1)
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  // ... other methods with documentation
}
```

### Documentation Best Practices

1. **Describe Purpose**: What does the function/class do?
2. **Document Parameters**: Type and description for each parameter
3. **Document Return Values**: What is returned and when?
4. **Document Exceptions**: What errors can be thrown?
5. **Include Examples**: Code examples for common usage
6. **Complexity Comments**: Time and space complexity where relevant

## 📊 Analyzing Efficiency (Big O Notation)

Understanding Big O helps you choose the right algorithms:

### Common Complexities

```typescript
// O(1) - Constant Time
function getFirstElement<T>(array: T[]): T | undefined {
  return array[0]; // Always takes same time regardless of array size
}

// O(n) - Linear Time
function linearSearch<T>(array: T[], target: T): number {
  for (let i = 0; i < array.length; i++) { // Time grows with array size
    if (array[i] === target) return i;
  }
  return -1;
}

// O(log n) - Logarithmic Time
function binarySearch(sortedArray: number[], target: number): number {
  let left = 0, right = sortedArray.length - 1;
  while (left <= right) { // Each iteration cuts search space in half
    const mid = Math.floor((left + right) / 2);
    if (sortedArray[mid] === target) return mid;
    if (sortedArray[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// O(n²) - Quadratic Time
function bubbleSort(array: number[]): number[] {
  const result = [...array];
  for (let i = 0; i < result.length; i++) {     // O(n)
    for (let j = 0; j < result.length - i; j++) { // O(n) - nested loops = O(n²)
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  return result;
}
```

### Big O Rules

1. **Drop Constants**: O(2n) becomes O(n)
2. **Drop Lower Terms**: O(n² + n) becomes O(n²)
3. **Focus on Worst Case**: Usually what matters most
4. **Consider Input Size**: How does performance change with data size?

### Complexity Comparison

For different input sizes:
- **n = 10**: O(1) = 1, O(log n) = 3, O(n) = 10, O(n²) = 100
- **n = 100**: O(1) = 1, O(log n) = 7, O(n) = 100, O(n²) = 10,000
- **n = 1,000**: O(1) = 1, O(log n) = 10, O(n) = 1,000, O(n²) = 1,000,000

## ⚠️ Error Handling and Input Validation

Always validate inputs and handle errors gracefully:

```typescript
/**
 * Safely divides two numbers with comprehensive error handling.
 * @param dividend The number to be divided
 * @param divisor The number to divide by
 * @returns The quotient
 * @throws {TypeError} If either argument is not a number
 * @throws {Error} If attempting to divide by zero
 */
function safeDivide(dividend: number, divisor: number): number {
  // Type validation
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new TypeError("Both dividend and divisor must be numbers");
  }

  // Value validation
  if (!isFinite(dividend) || !isFinite(divisor)) {
    throw new Error("Both numbers must be finite");
  }

  // Domain-specific validation
  if (divisor === 0) {
    throw new Error("Cannot divide by zero");
  }

  return dividend / divisor;
}

// Usage with error handling
function calculateAverage(numbers: number[]): number {
  if (!Array.isArray(numbers)) {
    throw new TypeError("Input must be an array");
  }

  if (numbers.length === 0) {
    throw new Error("Cannot calculate average of empty array");
  }

  const sum = numbers.reduce((acc, num) => {
    if (typeof num !== 'number') {
      throw new TypeError("All array elements must be numbers");
    }
    return acc + num;
  }, 0);

  return sum / numbers.length;
}
```

### Error Handling Best Practices

1. **Validate Inputs**: Check types, ranges, and constraints
2. **Meaningful Messages**: Clear error messages for debugging
3. **Appropriate Error Types**: Use specific error classes when possible
4. **Fail Fast**: Catch errors early rather than letting them propagate
5. **Recovery Options**: Provide ways to recover from errors when possible

## 🔒 TypeScript Best Practices

Leverage TypeScript for type safety:

```typescript
// Use generics for reusable components
interface Stack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
  size(): number;
}

// Use union types for constrained values
type Priority = 1 | 2 | 3 | 4 | 5; // Only allow specific priority values

interface Task {
  id: number;
  description: string;
  priority: Priority; // Type-safe priority
  completed: boolean;
}

// Use readonly for immutable data
interface Point {
  readonly x: number;
  readonly y: number;
}

// Use utility types
type TaskSummary = Pick<Task, 'id' | 'description' | 'completed'>;
type OptionalTask = Partial<Task>;

// Use const assertions for literal types
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
type HttpMethod = typeof HTTP_METHODS[number]; // 'GET' | 'POST' | 'PUT' | 'DELETE'
```

## 🧪 Testing Framework Integration

For more advanced testing, integrate with Jest (like our codebase):

```typescript
// stack.test.ts
import { ArrayStack } from './stack';

describe('ArrayStack', () => {
  let stack: ArrayStack<number>;

  beforeEach(() => {
    stack = new ArrayStack<number>();
  });

  describe('initial state', () => {
    it('should be empty when created', () => {
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
    });
  });

  describe('push operation', () => {
    it('should add items to the stack', () => {
      stack.push(1);
      expect(stack.isEmpty()).toBe(false);
      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe(1);
    });
  });

  describe('pop operation', () => {
    it('should remove and return the top item', () => {
      stack.push(1);
      stack.push(2);
      const popped = stack.pop();
      expect(popped).toBe(2);
      expect(stack.size()).toBe(1);
    });

    it('should return undefined when stack is empty', () => {
      const popped = stack.pop();
      expect(popped).toBeUndefined();
    });
  });
});
```

## 🎯 Chapter Summary

In this chapter, you learned:

1. **Comprehensive Testing**: Normal cases, edge cases, and error cases
2. **Professional Documentation**: JSDoc comments with examples
3. **Complexity Analysis**: Big O notation and performance implications
4. **Error Handling**: Input validation and meaningful error messages
5. **TypeScript Best Practices**: Generics, union types, and type safety

## 🔗 Key Concepts Review

- **Testing**: Always test implementations thoroughly
- **Documentation**: Clear docs help others (and future you!)
- **Big O**: O(1) < O(log n) < O(n) < O(n²)
- **Error Handling**: Validate inputs, provide meaningful messages
- **Type Safety**: Use TypeScript features for robust code

## 🚀 Next Steps

Now that you know best practices, in **Chapter 6** we'll explore advanced topics from our codebase, including approximation algorithms, state machines, and streaming algorithms.

## 📚 Additional Resources

- **Jest Documentation**: Learn advanced testing techniques
- **TypeScript Handbook**: Deep dive into advanced TypeScript features
- **Our Codebase**: Look at our test files for professional testing examples

---

**Practiced the best practices?** Apply them to your previous implementations, then head to [Chapter 6: Advanced Topics](./06-advanced-topics.md) to explore sophisticated algorithms!</content>
<parameter name="filePath">/Users/macbookpro/GUSKI/Algorithms_and_Datastructures/algorithms-tutorial/chapters/05-best-practices.md
