# Data Structures

This directory contains data structure definitions.

## Files

- `tree.ts` - Tree data structure with colored leaf nodes
  - `TreeNode` interface - Node in a tree where leaves have colors
  - `Tree` interface - Tree with a root node

- `graph.ts` - Graph data structures with multiple representations
  - `Graph<T>` interface - Generic graph interface
  - `GraphEdge<T>` interface - Edge with source, target, and optional weight
  - `GraphVertex<T>` interface - Vertex with ID and optional data
  - `AdjacencyList<T>` type - Map-based adjacency list representation
  - `AdjacencyMatrix` type - 2D array adjacency matrix representation
  - `AdjacencyListGraph<T>` class - Adjacency list implementation
  - `AdjacencyMatrixGraph` class - Adjacency matrix implementation (for numeric vertices)
  - `SignedGraph` class - Complete signed graph with positive/negative edges

## Usage

### Trees

```typescript
import { TreeNode, Tree } from './datastructures';

const leaf: TreeNode = { children: [], color: 1 };
const tree: Tree = { root: leaf };
```

### Graphs

```typescript
import { AdjacencyListGraph, AdjacencyMatrixGraph } from './datastructures';

// Create an undirected unweighted graph using adjacency list
const graph1 = new AdjacencyListGraph<string>(false, false);
graph1.addVertex('A');
graph1.addVertex('B');
graph1.addEdge('A', 'B');

// Create a directed weighted graph using adjacency matrix
const graph2 = new AdjacencyMatrixGraph(true, true);
graph2.addVertex(1);
graph2.addVertex(2);
graph2.addEdge(1, 2, 5.0);
```
