# Chapter 4: Combining Data Structures and Algorithms

## 🎯 Learning Objectives

By the end of this chapter, you will:
- Understand how data structures and algorithms work together
- Implement graph traversal with Breadth-First Search (BFS)
- Create tree traversal algorithms
- See real-world examples from our codebase
- Learn when to choose specific data structure + algorithm combinations

## 📖 How Data Structures and Algorithms Work Together

Data structures provide the foundation, and algorithms operate on them. The choice of data structure can dramatically affect algorithm efficiency.

### Key Insights

1. **Right Tool for the Job**: Different problems need different combinations
2. **Efficiency Trade-offs**: No single "best" solution - depends on use case
3. **Abstraction**: Algorithms work on interfaces, not specific implementations
4. **Composition**: Complex systems combine multiple data structures and algorithms

### Common Patterns

| Problem Type | Data Structure | Algorithm | Example |
|-------------|----------------|-----------|---------|
| Finding items | Array | Linear Search | Simple lookup |
| Finding in sorted data | Array | Binary Search | Fast lookup |
| Adding/removing frequently | Linked List | Various | Dynamic collections |
| Hierarchical data | Tree | Tree Traversal | File systems |
| Network relationships | Graph | BFS/DFS | Social networks |
| Priority processing | Priority Queue | Heap operations | Task scheduling |

## 💻 Example: Graph Traversal with BFS

Let's combine a data structure (Graph) with an algorithm (Breadth-First Search). First, we need a simple graph data structure:

```typescript
interface Graph<T> {
  addVertex(vertex: T): void;
  addEdge(from: T, to: T): void;
  getNeighbors(vertex: T): T[];
}

// Simple adjacency list implementation
class AdjacencyListGraph<T> implements Graph<T> {
  private adjacencyList: Map<T, T[]> = new Map();

  addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(from: T, to: T): void {
    if (!this.adjacencyList.has(from)) {
      this.addVertex(from);
    }
    if (!this.adjacencyList.has(to)) {
      this.addVertex(to);
    }
    this.adjacencyList.get(from)!.push(to);
  }

  getNeighbors(vertex: T): T[] {
    return this.adjacencyList.get(vertex) || [];
  }
}
```

Now implement BFS algorithm:

```typescript
function breadthFirstSearch<T>(graph: Graph<T>, start: T): T[] {
  const visited: Set<T> = new Set();
  const queue: T[] = [];
  const result: T[] = [];

  queue.push(start);
  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);

    for (const neighbor of graph.getNeighbors(current)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}
```

### Testing BFS

```typescript
function testBFS() {
  const graph = new AdjacencyListGraph<string>();
  graph.addEdge('A', 'B');
  graph.addEdge('A', 'C');
  graph.addEdge('B', 'D');
  graph.addEdge('C', 'D');

  const traversal = breadthFirstSearch(graph, 'A');
  console.assert(traversal.join(',') === 'A,B,C,D', `Expected A,B,C,D but got ${traversal.join(',')}`);

  console.log("✅ BFS test passed!");
}

testBFS();
```

**Learning from Our Codebase:**
- Our [`AdjacencyListGraph`](../../../typescript/datastructures/graph.ts) is more sophisticated (supports weights, directed/undirected)
- BFS is fundamental for many graph algorithms
- This shows how algorithms leverage data structure methods

## 🌳 Example: Tree Traversal

Using our tree structure concept, let's implement tree traversal algorithms:

```typescript
// Simple tree node (inspired by our TreeNode)
interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

// Depth-first traversal algorithm
function depthFirstTraversal<T>(node: TreeNode<T>): T[] {
  const result: T[] = [];

  function traverse(current: TreeNode<T>): void {
    result.push(current.value);
    for (const child of current.children) {
      traverse(child);
    }
  }

  traverse(node);
  return result;
}

// Breadth-first traversal for trees
function breadthFirstTreeTraversal<T>(root: TreeNode<T>): T[] {
  const result: T[] = [];
  const queue: TreeNode<T>[] = [];

  queue.push(root);

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current.value);

    for (const child of current.children) {
      queue.push(child);
    }
  }

  return result;
}
```

### Testing Tree Traversals

```typescript
function testTreeTraversals() {
  const root: TreeNode<string> = {
    value: 'A',
    children: [
      {
        value: 'B',
        children: [
          { value: 'D', children: [] },
          { value: 'E', children: [] }
        ]
      },
      {
        value: 'C',
        children: [
          { value: 'F', children: [] }
        ]
      }
    ]
  };

  // Test depth-first (pre-order)
  const dfsResult = depthFirstTraversal(root);
  console.assert(dfsResult.join(',') === 'A,B,D,E,C,F', `DFS failed: ${dfsResult.join(',')}`);

  // Test breadth-first (level-order)
  const bfsResult = breadthFirstTreeTraversal(root);
  console.assert(bfsResult.join(',') === 'A,B,C,D,E,F', `BFS failed: ${bfsResult.join(',')}`);

  console.log("✅ All tree traversal tests passed!");
}

testTreeTraversals();
```

## 🏪 Real-World Example: Task Management System

Let's combine multiple data structures and algorithms to create a task management system:

```typescript
interface Task {
  id: number;
  description: string;
  priority: number; // 1 = low, 5 = high
  completed: boolean;
}

class TaskManager {
  private tasks: Map<number, Task> = new Map(); // Fast lookup by ID
  private priorityQueue: Task[] = []; // Sorted by priority

  addTask(task: Task): void {
    this.tasks.set(task.id, task);
    this.insertIntoPriorityQueue(task);
  }

  private insertIntoPriorityQueue(task: Task): void {
    // Simple insertion sort by priority (descending)
    let inserted = false;
    for (let i = 0; i < this.priorityQueue.length; i++) {
      if (task.priority > this.priorityQueue[i].priority) {
        this.priorityQueue.splice(i, 0, task);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      this.priorityQueue.push(task);
    }
  }

  getNextTask(): Task | undefined {
    return this.priorityQueue.find(task => !task.completed);
  }

  completeTask(id: number): boolean {
    const task = this.tasks.get(id);
    if (task && !task.completed) {
      task.completed = true;
      return true;
    }
    return false;
  }

  searchTasks(query: string): Task[] {
    const results: Task[] = [];
    for (const task of this.tasks.values()) {
      if (task.description.toLowerCase().includes(query.toLowerCase())) {
        results.push(task);
      }
    }
    return results;
  }
}
```

### Testing the Task Manager

```typescript
function testTaskManager() {
  const manager = new TaskManager();

  // Add tasks
  manager.addTask({ id: 1, description: "Write code", priority: 3, completed: false });
  manager.addTask({ id: 2, description: "Fix bugs", priority: 5, completed: false });
  manager.addTask({ id: 3, description: "Write tests", priority: 4, completed: false });

  // Test priority ordering
  const nextTask = manager.getNextTask();
  console.assert(nextTask?.id === 2, "Highest priority task should be first");

  // Test completion
  console.assert(manager.completeTask(2) === true, "Should complete task 2");
  console.assert(manager.completeTask(2) === false, "Should not complete already completed task");

  // Test search
  const searchResults = manager.searchTasks("write");
  console.assert(searchResults.length === 2, "Should find 2 tasks with 'write'");
  console.assert(searchResults.some(t => t.id === 1), "Should find task 1");
  console.assert(searchResults.some(t => t.id === 3), "Should find task 3");

  console.log("✅ All TaskManager tests passed!");
}

testTaskManager();
```

## 🛒 Learning from Our E-commerce Example

Our codebase has a comprehensive e-commerce system. Let's look at how it combines data structures and algorithms:

```typescript
// Inspired by our e-commerce implementation
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

class ProductCatalog {
  private products: Map<string, Product> = new Map(); // Fast lookup
  private categoryIndex: Map<string, Set<string>> = new Map(); // Category to product IDs

  addProduct(product: Product): void {
    this.products.set(product.id, product);

    // Update category index
    if (!this.categoryIndex.has(product.category)) {
      this.categoryIndex.set(product.category, new Set());
    }
    this.categoryIndex.get(product.category)!.add(product.id);
  }

  searchByCategory(category: string): Product[] {
    const productIds = this.categoryIndex.get(category);
    if (!productIds) return [];

    return Array.from(productIds)
      .map(id => this.products.get(id)!)
      .filter(product => product !== undefined);
  }

  searchByPriceRange(min: number, max: number): Product[] {
    const results: Product[] = [];
    for (const product of this.products.values()) {
      if (product.price >= min && product.price <= max) {
        results.push(product);
      }
    }
    return results;
  }
}
```

## 🎯 Chapter Summary

In this chapter, you learned:

1. **Data Structure + Algorithm Integration**: How they work together for efficiency
2. **Graph Algorithms**: BFS traversal on adjacency list graphs
3. **Tree Algorithms**: DFS and BFS traversal of tree structures
4. **Complex Systems**: Task manager combining multiple data structures
5. **Real-World Patterns**: Learning from our e-commerce implementation

## 🔗 Key Concepts Review

- **BFS**: Level-by-level graph/tree traversal using a queue
- **DFS**: Depth-first tree traversal using recursion
- **Indexing**: Using Maps for fast lookup (like our category index)
- **Multiple Structures**: Combining different data structures for complex needs
- **Algorithm Choice**: Selecting the right algorithm for the data structure

## 🚀 Next Steps

Now that you understand how data structures and algorithms work together, in **Chapter 5** we'll focus on best practices for writing robust, efficient, and maintainable code.

## 📚 Additional Resources

- **Design Patterns**: Search for "data structures and algorithms patterns"
- **Our Codebase**: Study `real life examples/ecommerce.test.ts` for complex combinations
- **System Design**: Learn how large systems combine multiple data structures

---

**Ready for best practices?** Head to [Chapter 5: Best Practices](./05-best-practices.md) to learn how to write professional-quality algorithms and data structures!</content>
<parameter name="filePath">/Users/macbookpro/GUSKI/Algorithms_and_Datastructures/algorithms-tutorial/chapters/04-combining-concepts.md
