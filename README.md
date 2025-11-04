# Algorithms and Data Structures

A TypeScript library of algorithms and data structures with proper separation of concerns.

## Project Structure

```
Algorithm_and_Datastructures/
├── algorithms/              # Algorithm implementations
│   ├── approximations.ts    # Multiplicative approximation algorithms
│   ├── estimator.ts         # Streaming estimation algorithms
│   ├── subtreeMode.ts       # Tree mode computation algorithm
│   ├── utils.ts             # Utility functions
│   ├── examples/            # Usage examples
│   │   └── recommendationExample.ts
│   ├── index.ts             # Main exports
│   └── README.md
│
├── datastructures/          # Data structure definitions
│   ├── tree.ts              # Tree data structure
│   ├── graph.ts             # Graph data structures
│   ├── index.ts             # Main exports
│   └── README.md
│
├── typescript/              # TypeScript configurations and tests
│   ├── algorithms.test.ts   # Unit tests
│   └── index.ts             # Legacy exports (re-exports from algorithms & datastructures)
│
└── datastructures/algorithms/ # Legacy location (being phased out)
```

## Organization Principle

- **`/algorithms/`** - Contains all algorithm implementations
  - Approximation algorithms
  - Streaming algorithms
  - Tree algorithms
  - Utility functions

- **`/datastructures/`** - Contains all data structure definitions
  - Tree structures
  - Graph structures (adjacency list and matrix representations)
  - Interfaces and types

This separation follows best practices:
- **Data structures** define the shape and structure of data
- **Algorithms** contain the logic and operations that work on those data structures

## Installation

```bash
npm install
```

## Testing

```bash
npm test
```

## Usage

```typescript
// Import algorithms
import { 
  subtreeMode, 
  isMultiplicativeApproximation, 
  calculateDensity,
  obliviousStreamingAlgorithm 
} from './algorithms';

// Import data structures
import { TreeNode, Tree, AdjacencyListGraph, AdjacencyMatrixGraph } from './datastructures';

// Use trees
const leaf: TreeNode = { children: [], color: 1 };
const tree: Tree = { root: leaf };
const modes = subtreeMode(tree.root);

// Use graphs
const graph = new AdjacencyListGraph<string>(false, false);
graph.addVertex('A');
graph.addVertex('B');
graph.addEdge('A', 'B');
```

## Features

### Data Structures
- **Tree structures** with colored leaf nodes
- **Graph structures** with multiple representations:
  - Adjacency list (efficient for sparse graphs)
  - Adjacency matrix (efficient for dense graphs)
  - Support for directed/undirected graphs
  - Support for weighted/unweighted edges

### Approximation Algorithms
- Multiplicative approximation checking
- Epsilon-flip number calculation
- Two-sided approximation verification

### Streaming Algorithms
- Frequency vector calculation from stream updates
- Oblivious streaming estimation
- Memory-efficient processing

### Tree Algorithms
- Subtree mode computation with memoization
- Works with colored leaf nodes

### Utilities
- Range generation
- Vector density (sparsity) calculation

## Examples

See `algorithms/examples/` for real-world use cases, including:
- E-commerce recommendation systems
- Streaming data processing

## License

MIT
