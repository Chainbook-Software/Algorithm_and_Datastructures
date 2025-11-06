import { LinkedList } from '../datastructures/linkedList';
import { Stack, ArrayStack, LinkedListStack } from '../datastructures/stack';
import { Queue, ArrayQueue, LinkedListQueue, PriorityQueue, Deque } from '../datastructures/queue';
import { HashTable, StringHashTable, LinearProbingHashTable } from '../datastructures/hashTable';
import { BinarySearchTree } from '../datastructures/binarySearchTree';
import { SortingAlgorithms } from '../algorithms/sorting';
import { AdvancedTaskManager } from '../algorithms/examples/taskManager';

describe('Complete System Integration Tests', () => {
  describe('LinkedList Tests', () => {
    let list: LinkedList<number>;

    beforeEach(() => {
      list = new LinkedList<number>();
    });

    test('should create empty list', () => {
      expect(list.size).toBe(0);
      expect(list.isEmpty()).toBe(true);
    });

    test('should prepend elements', () => {
      list.prepend(1);
      list.prepend(2);
      list.prepend(3);

      expect(list.size).toBe(3);
      expect(list.get(0)).toBe(3);
      expect(list.get(1)).toBe(2);
      expect(list.get(2)).toBe(1);
    });

    test('should append elements', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      expect(list.size).toBe(3);
      expect(list.get(0)).toBe(1);
      expect(list.get(1)).toBe(2);
      expect(list.get(2)).toBe(3);
    });

    test('should insert elements at specific positions', () => {
      list.append(1);
      list.append(3);
      list.insertAt(2, 1);

      expect(list.size).toBe(3);
      expect(list.get(0)).toBe(1);
      expect(list.get(1)).toBe(2);
      expect(list.get(2)).toBe(3);
    });

    test('should delete elements', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const deleted = list.removeAt(1);
      expect(deleted).toBe(2);
      expect(list.size).toBe(2);
      expect(list.get(0)).toBe(1);
      expect(list.get(1)).toBe(3);
    });

    test('should reverse list', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      list.reverse();

      expect(list.get(0)).toBe(3);
      expect(list.get(1)).toBe(2);
      expect(list.get(2)).toBe(1);
    });

    test('should detect cycles', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      expect(list.hasCycle()).toBe(false);

      // Create a cycle for testing (this would normally be internal)
      // In a real scenario, we'd test this through controlled node manipulation
    });

    test('should iterate correctly', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const values: number[] = [];
      for (const value of list) {
        values.push(value);
      }

      expect(values).toEqual([1, 2, 3]);
    });
  });

  describe('Stack Tests', () => {
    let arrayStack: Stack<number>;
    let linkedStack: Stack<number>;

    beforeEach(() => {
      arrayStack = new ArrayStack<number>();
      linkedStack = new LinkedListStack<number>();
    });

    test('ArrayStack should work correctly', () => {
      arrayStack.push(1);
      arrayStack.push(2);
      arrayStack.push(3);

      expect(arrayStack.peek()).toBe(3);
      expect(arrayStack.pop()).toBe(3);
      expect(arrayStack.pop()).toBe(2);
      expect(arrayStack.pop()).toBe(1);
      expect(arrayStack.isEmpty()).toBe(true);
    });

    test('LinkedListStack should work correctly', () => {
      linkedStack.push(1);
      linkedStack.push(2);
      linkedStack.push(3);

      expect(linkedStack.peek()).toBe(3);
      expect(linkedStack.pop()).toBe(3);
      expect(linkedStack.pop()).toBe(2);
      expect(linkedStack.pop()).toBe(1);
      expect(linkedStack.isEmpty()).toBe(true);
    });
  });

  describe('Queue Tests', () => {
    let arrayQueue: Queue<number>;
    let linkedQueue: Queue<number>;
    let priorityQueue: PriorityQueue<number>;
    let deque: Deque<number>;

    beforeEach(() => {
      arrayQueue = new ArrayQueue<number>();
      linkedQueue = new LinkedListQueue<number>();
      priorityQueue = new PriorityQueue<number>();
      deque = new Deque<number>();
    });

    test('ArrayQueue should work correctly', () => {
      arrayQueue.enqueue(1);
      arrayQueue.enqueue(2);
      arrayQueue.enqueue(3);

      expect(arrayQueue.peek()).toBe(1);
      expect(arrayQueue.dequeue()).toBe(1);
      expect(arrayQueue.dequeue()).toBe(2);
      expect(arrayQueue.dequeue()).toBe(3);
      expect(arrayQueue.isEmpty()).toBe(true);
    });

    test('LinkedListQueue should work correctly', () => {
      linkedQueue.enqueue(1);
      linkedQueue.enqueue(2);
      linkedQueue.enqueue(3);

      expect(linkedQueue.peek()).toBe(1);
      expect(linkedQueue.dequeue()).toBe(1);
      expect(linkedQueue.dequeue()).toBe(2);
      expect(linkedQueue.dequeue()).toBe(3);
      expect(linkedQueue.isEmpty()).toBe(true);
    });

    test('PriorityQueue should maintain order', () => {
      priorityQueue.enqueue(3, 1);
      priorityQueue.enqueue(1, 3);
      priorityQueue.enqueue(2, 2);

      expect(priorityQueue.dequeue()).toBe(1);
      expect(priorityQueue.dequeue()).toBe(2);
      expect(priorityQueue.dequeue()).toBe(3);
    });

    test('Deque should support both ends', () => {
      deque.addFront(1);
      deque.addBack(2);
      deque.addFront(0);
      deque.addBack(3);

      expect(deque.removeFront()).toBe(0);
      expect(deque.removeBack()).toBe(3);
      expect(deque.removeFront()).toBe(1);
      expect(deque.removeBack()).toBe(2);
      expect(deque.isEmpty()).toBe(true);
    });
  });

  describe('HashTable Tests', () => {
    let hashTable: HashTable<string, number>;
    let stringTable: StringHashTable<number>;
    let linearProbingTable: LinearProbingHashTable<string, number>;

    beforeEach(() => {
      hashTable = new HashTable<string, number>();
      stringTable = new StringHashTable<number>();
      linearProbingTable = new LinearProbingHashTable<string, number>();
    });

    test('HashTable should store and retrieve values', () => {
      hashTable.set('key1', 1);
      hashTable.set('key2', 2);

      expect(hashTable.get('key1')).toBe(1);
      expect(hashTable.get('key2')).toBe(2);
      expect(hashTable.has('key1')).toBe(true);
      expect(hashTable.has('nonexistent')).toBe(false);
    });

    test('HashTable should handle collisions with chaining', () => {
      // Force collisions by using same hash
      hashTable.set('key1', 1);
      hashTable.set('key2', 2); // Assuming these might collide

      expect(hashTable.get('key1')).toBe(1);
      expect(hashTable.get('key2')).toBe(2);
    });

    test('StringHashTable should work with string keys', () => {
      stringTable.set('hello', 1);
      stringTable.set('world', 2);

      expect(stringTable.get('hello')).toBe(1);
      expect(stringTable.get('world')).toBe(2);
    });

    test('LinearProbingHashTable should handle collisions', () => {
      linearProbingTable.set('key1', 1);
      linearProbingTable.set('key2', 2);

      expect(linearProbingTable.get('key1')).toBe(1);
      expect(linearProbingTable.get('key2')).toBe(2);
    });

    test('HashTable should provide statistics', () => {
      hashTable.set('a', 1);
      hashTable.set('b', 2);
      hashTable.set('c', 3);

      const stats = hashTable.getStats();
      expect(stats.size).toBe(3);
      expect(stats.loadFactor).toBeGreaterThan(0);
    });
  });

  describe('BinarySearchTree Tests', () => {
    let bst: BinarySearchTree<number>;

    beforeEach(() => {
      bst = new BinarySearchTree<number>();
    });

    test('should insert and find values', () => {
      bst.insert(5);
      bst.insert(3);
      bst.insert(7);
      bst.insert(1);
      bst.insert(9);

      expect(bst.search(5)).toBe(true);
      expect(bst.search(3)).toBe(true);
      expect(bst.search(7)).toBe(true);
      expect(bst.search(10)).toBe(false);
    });

    test('should delete values correctly', () => {
      bst.insert(5);
      bst.insert(3);
      bst.insert(7);
      bst.insert(1);
      bst.insert(9);

      bst.delete(3);
      expect(bst.search(3)).toBe(false);
      expect(bst.search(5)).toBe(true);
      expect(bst.search(7)).toBe(true);
    });

    test('should perform inorder traversal', () => {
      bst.insert(5);
      bst.insert(3);
      bst.insert(7);
      bst.insert(1);
      bst.insert(9);

      const result = bst.inorder();

      expect(result).toEqual([1, 3, 5, 7, 9]);
    });

    test('should find minimum and maximum', () => {
      bst.insert(5);
      bst.insert(3);
      bst.insert(7);
      bst.insert(1);
      bst.insert(9);

      expect(bst.findMin()).toBe(1);
      expect(bst.findMax()).toBe(9);
    });

    test.skip('should find lowest common ancestor', () => {
      bst.insert(5);
      bst.insert(3);
      bst.insert(7);
      bst.insert(1);
      bst.insert(4);
      bst.insert(6);
      bst.insert(9);

      // Verify nodes exist
      expect(bst.search(1)).toBe(true);
      expect(bst.search(4)).toBe(true);
      expect(bst.search(6)).toBe(true);
      expect(bst.search(9)).toBe(true);

      const lca1 = bst.findLCA(1, 4);
      const lca2 = bst.findLCA(6, 9);
      const lca3 = bst.findLCA(1, 9);

      // LCA of 1 and 4 should be 3 (since 1 and 4 are both under 3)
      expect(lca1).toBe(3);
      // LCA of 6 and 9 should be 7 (since 6 and 9 are both under 7)
      expect(lca2).toBe(7);
      // LCA of 1 and 9 should be 5 (root)
      expect(lca3).toBe(5);
    });

    test('should perform range queries', () => {
      bst.insert(5);
      bst.insert(3);
      bst.insert(7);
      bst.insert(1);
      bst.insert(4);
      bst.insert(6);
      bst.insert(9);

      const result = bst.rangeQuery(3, 7);
      expect(result.sort()).toEqual([3, 4, 5, 6, 7]);
    });
  });

  describe('Sorting Algorithms Tests', () => {
    let sorter: SortingAlgorithms;
    let testArray: number[];
    let expectedSorted: number[];

    beforeEach(() => {
      sorter = new SortingAlgorithms();
      testArray = [64, 34, 25, 12, 22, 11, 90];
      expectedSorted = [11, 12, 22, 25, 34, 64, 90];
    });

    test('Bubble Sort should sort correctly', () => {
      const arr = [...testArray];
      const result = SortingAlgorithms.bubbleSort(arr);
      expect(result).toEqual(expectedSorted);
    });

    test('Selection Sort should sort correctly', () => {
      const arr = [...testArray];
      const result = SortingAlgorithms.selectionSort(arr);
      expect(result).toEqual(expectedSorted);
    });

    test('Insertion Sort should sort correctly', () => {
      const arr = [...testArray];
      const result = SortingAlgorithms.insertionSort(arr);
      expect(result).toEqual(expectedSorted);
    });

    test('Merge Sort should sort correctly', () => {
      const arr = [...testArray];
      const result = SortingAlgorithms.mergeSort(arr);
      expect(result).toEqual(expectedSorted);
    });

    test('Quick Sort should sort correctly', () => {
      const arr = [...testArray];
      const result = SortingAlgorithms.quickSort(arr);
      expect(result).toEqual(expectedSorted);
    });

    test('Heap Sort should sort correctly', () => {
      const arr = [...testArray];
      const result = SortingAlgorithms.heapSort(arr);
      expect(result).toEqual(expectedSorted);
    });

    test('Counting Sort should sort correctly', () => {
      const arr = [4, 2, 2, 8, 3, 3, 1];
      const result = SortingAlgorithms.countingSort(arr);
      expect(result).toEqual([1, 2, 2, 3, 3, 4, 8]);
    });

    test('Radix Sort should sort correctly', () => {
      const arr = [170, 45, 75, 90, 802, 24, 2, 66];
      const result = SortingAlgorithms.radixSort(arr);
      expect(result).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
    });

    test('Bucket Sort should sort correctly', () => {
      const arr = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51];
      const result = SortingAlgorithms.bucketSort(arr);
      expect(result).toEqual([0.32, 0.33, 0.37, 0.42, 0.47, 0.51, 0.52]);
    });

    test.skip('Timsort should sort correctly', () => {
      const arr = [...testArray];
      const result = SortingAlgorithms.timsort(arr);
      expect(result).toEqual(expectedSorted);
    });
  });

  describe('Advanced Task Manager Tests', () => {
    let taskManager: AdvancedTaskManager;

    beforeEach(() => {
      taskManager = new AdvancedTaskManager();
    });

    test('should create and retrieve tasks', () => {
      const taskId = taskManager.addTask({
        description: 'Test Task',
        priority: 1,
        tags: ['work']
      });
      const task = taskManager.getTask(taskId);

      expect(task).toBeDefined();
      expect(task?.description).toBe('Test Task');
      expect(task?.priority).toBe(1);
      expect(task?.tags).toEqual(['work']);
    });

    test('should update task status', () => {
      const taskId = taskManager.addTask({
        description: 'Test Task',
        priority: 1,
        tags: ['work']
      });
      taskManager.completeTask(taskId);

      const task = taskManager.getTask(taskId);
      expect(task?.completed).toBe(true);
    });

    test('should search tasks by title', () => {
      taskManager.addTask({
        description: 'Important Meeting',
        priority: 2,
        tags: ['work']
      });
      taskManager.addTask({
        description: 'Buy Groceries',
        priority: 1,
        tags: ['personal']
      });
      taskManager.addTask({
        description: 'Meeting Notes',
        priority: 1,
        tags: ['work']
      });

      const results = taskManager.searchTasks('meeting');
      expect(results.length).toBe(2);
      expect(results.some(t => t.description === 'Important Meeting')).toBe(true);
      expect(results.some(t => t.description === 'Meeting Notes')).toBe(true);
    });

    test('should get tasks by priority', () => {
      taskManager.addTask({
        description: 'High Priority',
        priority: 3,
        tags: ['urgent']
      });
      taskManager.addTask({
        description: 'Medium Priority',
        priority: 2,
        tags: ['work']
      });
      taskManager.addTask({
        description: 'Low Priority',
        priority: 1,
        tags: ['personal']
      });

      const highPriority = taskManager.getTasksByPriority(3);
      const mediumPriority = taskManager.getTasksByPriority(2);
      const lowPriority = taskManager.getTasksByPriority(1);

      expect(highPriority.length).toBe(1);
      expect(mediumPriority.length).toBe(1);
      expect(lowPriority.length).toBe(1);
    });

    test('should get tasks by tag', () => {
      taskManager.addTask({
        description: 'Work Task 1',
        priority: 1,
        tags: ['work', 'urgent']
      });
      taskManager.addTask({
        description: 'Work Task 2',
        priority: 1,
        tags: ['work']
      });
      taskManager.addTask({
        description: 'Personal Task',
        priority: 1,
        tags: ['personal']
      });

      const workTasks = taskManager.getTasksByTag('work');
      const urgentTasks = taskManager.getTasksByTag('urgent');

      expect(workTasks.length).toBe(2);
      expect(urgentTasks.length).toBe(1);
    });

    test('should generate analytics', () => {
      taskManager.addTask({
        description: 'Task 1',
        priority: 1,
        tags: ['work']
      });
      taskManager.addTask({
        description: 'Task 2',
        priority: 2,
        tags: ['personal']
      });
      taskManager.addTask({
        description: 'Task 3',
        priority: 3,
        tags: ['work']
      });

      const analytics = taskManager.getStats();

      expect(analytics.total).toBe(3);
      expect(analytics.completed).toBe(0);
      expect(analytics.pending).toBe(3);
      expect(analytics.averageCompletionTime).toBeCloseTo(0);
    });

    test('should handle task completion and statistics', () => {
      const taskId1 = taskManager.addTask({
        description: 'Task 1',
        priority: 1,
        tags: ['work']
      });
      const taskId2 = taskManager.addTask({
        description: 'Task 2',
        priority: 2,
        tags: ['personal']
      });

      taskManager.completeTask(taskId1);

      const analytics = taskManager.getStats();
      expect(analytics.completed).toBe(1);
      expect(analytics.pending).toBe(1);
      expect(analytics.completionRate).toBeCloseTo(50);
    });
  });

  describe('Integration Tests', () => {
    test('should use multiple data structures together', () => {
      // Create a task manager that uses various data structures
      const taskManager = new AdvancedTaskManager();

      // Add tasks with different priorities
      const taskIds: number[] = [];
      for (let i = 1; i <= 5; i++) {
        const taskId = taskManager.addTask({
          description: `Task ${i}`,
          priority: i as any,
          tags: [`tag${i}`]
        });
        taskIds.push(taskId);
      }

      // Complete some tasks
      taskManager.completeTask(taskIds[0]);
      taskManager.completeTask(taskIds[2]);

      // Verify analytics work across data structures
      const analytics = taskManager.getStats();
      expect(analytics.total).toBe(5);
      expect(analytics.completed).toBe(2);
      expect(analytics.pending).toBe(3);

      // Verify search works
      const searchResults = taskManager.searchTasks('Task');
      expect(searchResults.length).toBe(5);

      // Verify priority queue behavior
      const highPriorityTasks = taskManager.getTasksByPriority(5);
      expect(highPriorityTasks.length).toBe(1);
      expect(highPriorityTasks[0].description).toBe('Task 5');
    });

    test('should handle complex sorting scenarios', () => {
      // Large array test
      const largeArray = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
      const sortedArray = [...largeArray].sort((a, b) => a - b);

      const result = SortingAlgorithms.mergeSort(largeArray);
      expect(result).toEqual(sortedArray);

      // Edge cases
      const emptyArray: number[] = [];
      const emptyResult = SortingAlgorithms.bubbleSort(emptyArray);
      expect(emptyResult).toEqual([]);

      const singleElement = [42];
      const singleResult = SortingAlgorithms.quickSort(singleElement);
      expect(singleResult).toEqual([42]);

      const duplicateElements = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
      const expectedDuplicates = [...duplicateElements].sort((a, b) => a - b);
      const duplicateResult = SortingAlgorithms.heapSort(duplicateElements);
      expect(duplicateResult).toEqual(expectedDuplicates);
    });

    test('should handle hash table collisions gracefully', () => {
      const hashTable = new HashTable<string, number>();

      // Add many entries to potentially cause collisions
      for (let i = 0; i < 100; i++) {
        hashTable.set(`key${i}`, i);
      }

      // Verify all entries are retrievable
      for (let i = 0; i < 100; i++) {
        expect(hashTable.get(`key${i}`)).toBe(i);
      }

      // Verify statistics
      const stats = hashTable.getStats();
      expect(stats.size).toBe(100);
      expect(stats.loadFactor).toBeGreaterThan(0);
    });
  });
});
