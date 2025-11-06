# Exercise 1: Implement Your Own Queue

## 🎯 Objective
Implement a `Queue` interface and `ArrayQueue` class similar to the Stack example in Chapter 2.

## 📋 Requirements

### Interface Definition
```typescript
interface Queue<T> {
  enqueue(item: T): void;     // Add item to back of queue
  dequeue(): T | undefined;   // Remove and return front item
  front(): T | undefined;     // Look at front item without removing
  isEmpty(): boolean;         // Check if queue is empty
  size(): number;             // Get number of items
}
```

### Implementation Requirements
- Use an array as the underlying data structure
- Implement FIFO (First-In-First-Out) behavior
- Handle edge cases (empty queue operations)
- Proper TypeScript typing

## 💻 Solution Template

```typescript
class ArrayQueue<T> implements Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    // Your implementation here
  }

  dequeue(): T | undefined {
    // Your implementation here
  }

  front(): T | undefined {
    // Your implementation here
  }

  isEmpty(): boolean {
    // Your implementation here
  }

  size(): number {
    // Your implementation here
  }
}
```

## ✅ Test Cases

```typescript
function testQueue() {
  const queue = new ArrayQueue<string>();

  // Test empty queue
  console.assert(queue.isEmpty() === true, "Queue should be empty initially");
  console.assert(queue.size() === 0, "Size should be 0");
  console.assert(queue.front() === undefined, "Front of empty queue should be undefined");
  console.assert(queue.dequeue() === undefined, "Dequeue from empty queue should return undefined");

  // Test enqueue operations
  queue.enqueue("Alice");
  console.assert(queue.isEmpty() === false, "Queue should not be empty after enqueue");
  console.assert(queue.size() === 1, "Size should be 1");
  console.assert(queue.front() === "Alice", "Front should be first enqueued item");

  queue.enqueue("Bob");
  console.assert(queue.size() === 2, "Size should be 2");
  console.assert(queue.front() === "Alice", "Front should still be first item");

  queue.enqueue("Charlie");
  console.assert(queue.size() === 3, "Size should be 3");

  // Test dequeue operations (FIFO behavior)
  const first = queue.dequeue();
  console.assert(first === "Alice", "Should dequeue first enqueued item");
  console.assert(queue.size() === 2, "Size should be 2 after dequeue");
  console.assert(queue.front() === "Bob", "Front should now be Bob");

  const second = queue.dequeue();
  console.assert(second === "Bob", "Should dequeue Bob next");
  console.assert(queue.front() === "Charlie", "Front should now be Charlie");

  const third = queue.dequeue();
  console.assert(third === "Charlie", "Should dequeue Charlie last");
  console.assert(queue.isEmpty() === true, "Queue should be empty after all dequeues");

  console.log("✅ All queue tests passed!");
}

// Run the tests
testQueue();
```

## 💡 Hints

1. **Enqueue**: Add to the end of the array
2. **Dequeue**: Remove from the beginning of the array
3. **Front**: Look at the first element without removing it
4. **Empty Check**: Check if array length is 0
5. **Size**: Return array length

## 🚀 Extension Ideas

- Add a `clear()` method to remove all items
- Add a `toArray()` method to get a copy of all items
- Implement a circular queue with fixed size
- Add priority queue functionality

## 📚 Learning Objectives

By completing this exercise, you will:
- Understand FIFO data structure behavior
- Practice interface implementation
- Handle edge cases in data structures
- Write comprehensive tests</content>
<parameter name="filePath">/Users/macbookpro/GUSKI/Algorithms_and_Datastructures/algorithms-tutorial/exercises/01-queue-implementation.md
