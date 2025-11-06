# Chapter 2: Understanding Data Structures

## 🎯 Learning Objectives

By the end of this chapter, you will:
- Understand what data structures are and why they matter
- Implement a Stack data structure with full functionality
- Learn from our TreeNode implementation in the codebase
- Create your own Queue data structure
- Understand interface design and implementation patterns

## 📖 What Are Data Structures?

Data structures define how data is organized, stored, and manipulated. They provide specific operations for accessing and modifying data. The choice of data structure affects the efficiency of operations.

### Key Concepts

1. **Interface**: A contract that defines what methods a data structure must have
2. **Implementation**: The actual code that fulfills the interface
3. **Operations**: Common operations include insert, delete, search, traverse
4. **Complexity**: How efficient operations are (measured in Big O notation)

### Why Data Structures Matter

Different data structures excel at different operations:
- **Arrays**: Fast access by index, slow insertion/deletion
- **Linked Lists**: Fast insertion/deletion, slow random access
- **Trees**: Hierarchical data, fast search
- **Graphs**: Complex relationships, flexible modeling

## 💻 Example 1: Implementing a Simple Stack

Let's start with a basic data structure: a **Stack**. A stack follows the Last-In-First-Out (LIFO) principle, like a stack of plates.

Based on our codebase patterns, here's how to implement a Stack:

```typescript
// First, define an interface for the Stack
interface Stack<T> {
  push(item: T): void;        // Add item to top
  pop(): T | undefined;       // Remove and return top item
  peek(): T | undefined;      // Look at top item without removing
  isEmpty(): boolean;         // Check if stack is empty
  size(): number;             // Get number of items
}

// Now implement the Stack using an array
class ArrayStack<T> implements Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}
```

### Testing Our Stack Implementation

```typescript
// Test the stack
function testStack() {
  const stack = new ArrayStack<number>();

  // Test empty stack
  console.assert(stack.isEmpty() === true, "Stack should be empty initially");
  console.assert(stack.size() === 0, "Size should be 0");

  // Test push operations
  stack.push(1);
  stack.push(2);
  stack.push(3);

  console.assert(stack.isEmpty() === false, "Stack should not be empty after push");
  console.assert(stack.size() === 3, "Size should be 3");
  console.assert(stack.peek() === 3, "Peek should return top item (3)");

  // Test pop operations (LIFO behavior)
  const popped1 = stack.pop();
  console.assert(popped1 === 3, "Pop should return 3 (last pushed)");
  console.assert(stack.size() === 2, "Size should be 2 after pop");

  const popped2 = stack.pop();
  console.assert(popped2 === 2, "Pop should return 2");
  console.assert(stack.peek() === 1, "Peek should now return 1");

  console.log("✅ All stack tests passed!");
}

// Run the test
testStack();
```

**Key Points:**
- We defined an interface first (like our `Graph` interface in the codebase)
- The implementation uses an array as the underlying storage
- All operations are O(1) - very efficient!
- LIFO behavior: Last item pushed is first item popped

## 📚 Learning from Our Tree Data Structure

Looking at our codebase, we have a [`TreeNode`](../../../typescript/datastructures/tree.ts) interface:

```typescript
export interface TreeNode {
  children: TreeNode[];
  color?: number; // Optional property for colored leaves
}
```

This is a simple tree structure. Let's create our own binary tree:

```typescript
interface BinaryTreeNode<T> {
  value: T;
  left: BinaryTreeNode<T> | null;
  right: BinaryTreeNode<T> | null;
}

class BinarySearchTree<T> {
  private root: BinaryTreeNode<T> | null = null;

  insert(value: T): void {
    const newNode: BinaryTreeNode<T> = { value, left: null, right: null };

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }

  // Search method
  search(value: T): boolean {
    let current = this.root;
    while (current !== null) {
      if (value === current.value) {
        return true;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return false;
  }
}
```

**Learning from Our Codebase:**
- Our [`TreeNode`](../../../typescript/datastructures/tree.ts) uses an array for children (general tree)
- We added a [`color`](../../../typescript/datastructures/tree.ts) property for specific use cases
- This shows how to extend basic structures for specific needs

### Testing the Binary Search Tree

```typescript
function testBinarySearchTree() {
  const bst = new BinarySearchTree<number>();

  // Insert values
  bst.insert(5);
  bst.insert(3);
  bst.insert(7);
  bst.insert(1);
  bst.insert(9);

  // Test search
  console.assert(bst.search(5) === true, "Should find root value");
  console.assert(bst.search(3) === true, "Should find left child");
  console.assert(bst.search(7) === true, "Should find right child");
  console.assert(bst.search(1) === true, "Should find leaf node");
  console.assert(bst.search(9) === true, "Should find another leaf");
  console.assert(bst.search(4) === false, "Should not find non-existent value");

  console.log("✅ All BST tests passed!");
}

testBinarySearchTree();
```

## ✅ Exercise 1: Create Your Own Queue

A **Queue** follows First-In-First-Out (FIFO) principle. Implement a `Queue` interface and `ArrayQueue` class similar to the Stack example above.

### Requirements:
- Interface with methods: `enqueue`, `dequeue`, `front`, `isEmpty`, `size`
- Array-based implementation
- FIFO behavior (first item added is first item removed)
- Proper TypeScript typing
- Comprehensive tests

### Solution Template:

```typescript
interface Queue<T> {
  enqueue(item: T): void;     // Add item to back of queue
  dequeue(): T | undefined;   // Remove and return front item
  front(): T | undefined;     // Look at front item without removing
  isEmpty(): boolean;         // Check if queue is empty
  size(): number;             // Get number of items
}

class ArrayQueue<T> implements Queue<T> {
  // Your implementation here
}
```

### Test Cases to Implement:

```typescript
function testQueue() {
  const queue = new ArrayQueue<string>();

  // Test empty queue
  console.assert(queue.isEmpty() === true);
  console.assert(queue.size() === 0);

  // Test enqueue
  queue.enqueue("Alice");
  queue.enqueue("Bob");
  queue.enqueue("Charlie");

  console.assert(queue.isEmpty() === false);
  console.assert(queue.size() === 3);
  console.assert(queue.front() === "Alice");

  // Test dequeue (FIFO behavior)
  const first = queue.dequeue();
  console.assert(first === "Alice");
  console.assert(queue.size() === 2);
  console.assert(queue.front() === "Bob");

  const second = queue.dequeue();
  console.assert(second === "Bob");
  console.assert(queue.front() === "Charlie");

  console.log("✅ All queue tests passed!");
}
```

## 🎯 Chapter Summary

In this chapter, you learned:

1. **Data Structure Fundamentals**: Interfaces, implementations, and complexity
2. **Stack Implementation**: LIFO behavior with array backing
3. **Tree Structures**: Learning from our TreeNode and creating BST
4. **Interface Design**: How to define contracts for data structures
5. **Testing**: Writing comprehensive tests for your implementations

## 🔗 Key Concepts Review

- **Interface**: Defines the contract (what methods must exist)
- **Implementation**: The actual code that fulfills the interface
- **LIFO vs FIFO**: Stack (LIFO) vs Queue (FIFO)
- **Complexity**: Most operations in our examples are O(1)
- **Testing**: Always test your implementations thoroughly

## 🚀 Next Steps

Now that you understand basic data structures, in **Chapter 3** we'll explore algorithms that operate on these structures. You'll implement searching and sorting algorithms that bring data structures to life!

## 📚 Additional Resources

- **Stack Overflow**: Search for "data structures typescript" for more examples
- **Our Codebase**: Look at `datastructures/graph.ts` for a more complex data structure
- **Visualizations**: Use tools like VisuAlgo to see data structures in action

---

**Ready for the exercise?** Implement the Queue data structure, then head to [Chapter 3: Understanding Algorithms](./03-algorithms.md) to learn how algorithms bring data structures to life!</content>
<parameter name="filePath">/Users/macbookpro/GUSKI/Algorithms_and_Datastructures/algorithms-tutorial/chapters/02-data-structures.md
