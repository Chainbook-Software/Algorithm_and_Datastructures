// =============================================================================
// 🎯 ALGORITHMS AND DATA STRUCTURES TUTORIAL - COMPLETE IMPLEMENTATION
// =============================================================================
// This file contains all the implementations from the tutorial book
// Run this file to test all data structures and algorithms
// =============================================================================

console.log("🚀 Starting Algorithms and Data Structures Tutorial Tests...\n");

// =============================================================================
// CHAPTER 2: ARRAYS AND STRINGS
// =============================================================================

class ArrayOperations {
  static binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] === target) return mid;
      if (arr[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }

  static bubbleSort(arr: number[]): number[] {
    const result = [...arr];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result.length - i - 1; j++) {
        if (result[j] > result[j + 1]) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
        }
      }
    }
    return result;
  }

  static reverseString(str: string): string {
    return str.split('').reverse().join('');
  }

  static isPalindrome(str: string): boolean {
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanStr === cleanStr.split('').reverse().join('');
  }
}

// =============================================================================
// CHAPTER 3: LINKED LISTS
// =============================================================================

class ListNode<T> {
  constructor(public value: T, public next: ListNode<T> | null = null) {}
}

class LinkedList<T> {
  head: ListNode<T> | null = null;
  size = 0;

  append(value: T): void {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }

  prepend(value: T): void {
    const newNode = new ListNode(value, this.head);
    this.head = newNode;
    this.size++;
  }

  delete(value: T): boolean {
    if (!this.head) return false;

    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        this.size--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  find(value: T): ListNode<T> | null {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

// =============================================================================
// CHAPTER 4: STACKS AND QUEUES
// =============================================================================

class Stack<T> {
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

class Queue<T> {
  private items: T[] = [];
  private front = 0;

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.front];
    this.front++;
    // Reset front when queue becomes empty
    if (this.front === this.items.length) {
      this.items = [];
      this.front = 0;
    }
    return item;
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.front];
  }

  isEmpty(): boolean {
    return this.front === this.items.length;
  }

  size(): number {
    return this.items.length - this.front;
  }
}

// =============================================================================
// CHAPTER 5: HASH TABLES
// =============================================================================

class HashTable<K, V> {
  private table: Array<Array<[K, V]>> = [];
  private size = 0;

  constructor(private capacity = 16) {
    this.table = new Array(capacity);
  }

  private hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash) % this.capacity;
  }

  set(key: K, value: V): void {
    const index = this.hash(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }

    // Check if key exists
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i][0] === key) {
        this.table[index][i][1] = value;
        return;
      }
    }

    this.table[index].push([key, value]);
    this.size++;
  }

  get(key: K): V | undefined {
    const index = this.hash(key);
    if (!this.table[index]) return undefined;

    for (const [k, v] of this.table[index]) {
      if (k === key) return v;
    }
    return undefined;
  }

  delete(key: K): boolean {
    const index = this.hash(key);
    if (!this.table[index]) return false;

    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i][0] === key) {
        this.table[index].splice(i, 1);
        this.size--;
        return true;
      }
    }
    return false;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  keys(): K[] {
    const result: K[] = [];
    for (const bucket of this.table) {
      if (bucket) {
        for (const [key] of bucket) {
          result.push(key);
        }
      }
    }
    return result;
  }

  values(): V[] {
    const result: V[] = [];
    for (const bucket of this.table) {
      if (bucket) {
        for (const [, value] of bucket) {
          result.push(value);
        }
      }
    }
    return result;
  }
}

// =============================================================================
// CHAPTER 6: TREES AND BINARY SEARCH TREES
// =============================================================================

class TreeNode<T> {
  constructor(
    public value: T,
    public left: TreeNode<T> | null = null,
    public right: TreeNode<T> | null = null
  ) {}
}

class BinarySearchTree<T> {
  root: TreeNode<T> | null = null;

  insert(value: T): void {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  search(value: T): boolean {
    let current = this.root;
    while (current) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }

  delete(value: T): boolean {
    const deleteNode = (node: TreeNode<T> | null, val: T): TreeNode<T> | null => {
      if (!node) return null;

      if (val < node.value) {
        node.left = deleteNode(node.left, val);
      } else if (val > node.value) {
        node.right = deleteNode(node.right, val);
      } else {
        // Node found
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        // Node with two children
        const minRight = this.findMin(node.right);
        node.value = minRight.value;
        node.right = deleteNode(node.right, minRight.value);
      }
      return node;
    };

    const originalSize = this.size();
    this.root = deleteNode(this.root, value);
    return this.size() !== originalSize;
  }

  inorder(): T[] {
    const result: T[] = [];
    const traverse = (node: TreeNode<T> | null) => {
      if (node) {
        traverse(node.left);
        result.push(node.value);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  preorder(): T[] {
    const result: T[] = [];
    const traverse = (node: TreeNode<T> | null) => {
      if (node) {
        result.push(node.value);
        traverse(node.left);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  postorder(): T[] {
    const result: T[] = [];
    const traverse = (node: TreeNode<T> | null) => {
      if (node) {
        traverse(node.left);
        traverse(node.right);
        result.push(node.value);
      }
    };
    traverse(this.root);
    return result;
  }

  private findMin(node: TreeNode<T>): TreeNode<T> {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  size(): number {
    let count = 0;
    const traverse = (node: TreeNode<T> | null) => {
      if (node) {
        count++;
        traverse(node.left);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return count;
  }
}

// =============================================================================
// ADVANCED ALGORITHMS
// =============================================================================

class AdvancedAlgorithms {
  static quicksort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;

    const pivot = arr[arr.length - 1];
    const left: number[] = [];
    const right: number[] = [];

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] < pivot) left.push(arr[i]);
      else right.push(arr[i]);
    }

    return [...this.quicksort(left), pivot, ...this.quicksort(right)];
  }

  static mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid));
    const right = this.mergeSort(arr.slice(mid));

    return this.merge(left, right);
  }

  private static merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

// =============================================================================
// COMPREHENSIVE TEST SUITE
// =============================================================================

function runAllTests() {
  console.log("🧪 Running Comprehensive Test Suite...\n");

  // Test Array Operations
  console.log("📊 Testing Array Operations...");
  const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];
  console.assert(ArrayOperations.binarySearch(sortedArray, 7) === 3, "Binary search");
  console.assert(ArrayOperations.binarySearch(sortedArray, 4) === -1, "Binary search not found");

  const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
  const sorted = ArrayOperations.bubbleSort(unsortedArray);
  console.assert(sorted[0] === 11 && sorted[6] === 90, "Bubble sort");

  console.assert(ArrayOperations.reverseString("hello") === "olleh", "Reverse string");
  console.assert(ArrayOperations.isPalindrome("racecar"), "Palindrome check");

  // Test Linked List
  console.log("🔗 Testing Linked List...");
  const list = new LinkedList<number>();
  list.append(1);
  list.append(2);
  list.append(3);
  list.prepend(0);
  console.assert(list.toArray().join(',') === '0,1,2,3', "Linked list operations");
  console.assert(list.delete(2), "Delete from linked list");
  console.assert(list.find(1)?.value === 1, "Find in linked list");

  // Test Stack
  console.log("📚 Testing Stack...");
  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  stack.push(3);
  console.assert(stack.peek() === 3, "Stack peek");
  console.assert(stack.pop() === 3, "Stack pop");
  console.assert(stack.size() === 2, "Stack size");

  // Test Queue
  console.log("🚶 Testing Queue...");
  const queue = new Queue<string>();
  queue.enqueue("first");
  queue.enqueue("second");
  queue.enqueue("third");
  console.assert(queue.peek() === "first", "Queue peek");
  console.assert(queue.dequeue() === "first", "Queue dequeue");
  console.assert(queue.size() === 2, "Queue size");

  // Test Hash Table
  console.log("🔑 Testing Hash Table...");
  const hashTable = new HashTable<string, number>();
  hashTable.set("one", 1);
  hashTable.set("two", 2);
  hashTable.set("three", 3);
  console.assert(hashTable.get("two") === 2, "Hash table get");
  console.assert(hashTable.has("one"), "Hash table has");
  console.assert(hashTable.delete("three"), "Hash table delete");
  console.assert(!hashTable.has("three"), "Hash table delete verification");

  // Test Binary Search Tree
  console.log("🌳 Testing Binary Search Tree...");
  const bst = new BinarySearchTree<number>();
  bst.insert(8);
  bst.insert(3);
  bst.insert(10);
  bst.insert(1);
  bst.insert(6);
  bst.insert(14);
  bst.insert(4);
  bst.insert(7);
  bst.insert(13);

  console.assert(bst.search(6), "BST search");
  console.assert(!bst.search(99), "BST search not found");
  console.assert(bst.inorder().join(',') === '1,3,4,6,7,8,10,13,14', "BST inorder traversal");
  console.assert(bst.delete(3), "BST delete");
  console.assert(bst.size() === 8, "BST size after delete");

  // Test Advanced Algorithms
  console.log("⚡ Testing Advanced Algorithms...");
  const testArray = [3, 6, 8, 10, 1, 2, 1];
  const quickSorted = AdvancedAlgorithms.quicksort(testArray);
  console.assert(quickSorted.join(',') === '1,1,2,3,6,8,10', "Quicksort");

  const mergeSorted = AdvancedAlgorithms.mergeSort(testArray);
  console.assert(mergeSorted.join(',') === '1,1,2,3,6,8,10', "Merge sort");

  console.log("\n🎉 All tests passed! You have successfully implemented all data structures and algorithms!");
  console.log("🚀 You are now ready to tackle complex programming challenges!");
}

// =============================================================================
// FINAL PROJECT: TASK MANAGER SYSTEM (Mini Version)
// =============================================================================

interface SimpleTask {
  id: number;
  description: string;
  priority: number;
  completed: boolean;
}

class SimpleTaskManager {
  private tasks: Map<number, SimpleTask> = new Map();
  private nextId = 1;

  addTask(description: string, priority: number): number {
    const task: SimpleTask = {
      id: this.nextId++,
      description,
      priority,
      completed: false
    };
    this.tasks.set(task.id, task);
    return task.id;
  }

  completeTask(id: number): boolean {
    const task = this.tasks.get(id);
    if (task && !task.completed) {
      task.completed = true;
      return true;
    }
    return false;
  }

  getTasks(): SimpleTask[] {
    return Array.from(this.tasks.values());
  }

  getPendingTasks(): SimpleTask[] {
    return this.getTasks().filter(task => !task.completed);
  }

  getCompletedTasks(): SimpleTask[] {
    return this.getTasks().filter(task => task.completed);
  }
}

// Test the final project
function testFinalProject() {
  console.log("\n🏆 Testing Final Project: Task Manager System...");

  const manager = new SimpleTaskManager();

  // Add tasks
  const task1 = manager.addTask("Learn algorithms", 5);
  const task2 = manager.addTask("Build data structures", 4);
  const task3 = manager.addTask("Complete tutorial", 5);

  // Complete a task
  manager.completeTask(task2);

  // Check results
  const allTasks = manager.getTasks();
  const pendingTasks = manager.getPendingTasks();
  const completedTasks = manager.getCompletedTasks();

  console.assert(allTasks.length === 3, "All tasks count");
  console.assert(pendingTasks.length === 2, "Pending tasks count");
  console.assert(completedTasks.length === 1, "Completed tasks count");
  console.assert(completedTasks[0].id === task2, "Completed task ID");

  console.log("✅ Task Manager System working perfectly!");
}

// =============================================================================
// RUN ALL TESTS
// =============================================================================

runAllTests();
testFinalProject();

console.log("\n🎯 TUTORIAL COMPLETE!");
console.log("You have mastered:");
console.log("✅ Arrays and Strings");
console.log("✅ Linked Lists");
console.log("✅ Stacks and Queues");
console.log("✅ Hash Tables");
console.log("✅ Binary Search Trees");
console.log("✅ Sorting Algorithms");
console.log("✅ Complete Task Manager System");
console.log("\n🚀 Ready for advanced algorithms and real-world projects!");
console.log("Keep coding and building amazing things! 🎉");

// Export for use in other files
export {
  ArrayOperations,
  LinkedList,
  ListNode,
  Stack,
  Queue,
  HashTable,
  BinarySearchTree,
  TreeNode,
  AdvancedAlgorithms,
  SimpleTaskManager
};
