/// <reference types="jest" />

import { range, isMultiplicativeApproximation, isMultiplicativeApproximationTwoSided, calculateDensity, calculateFlipNumber, calculateFrequencyVector, StreamUpdate, TreeNode, subtreeMode, AdjacencyListGraph, AdjacencyMatrixGraph } from './index';

describe('range', () => {
  test('returns array from 1 to k for positive k', () => {
    expect(range(5)).toEqual([1, 2, 3, 4, 5]);
    expect(range(1)).toEqual([1]);
    expect(range(3)).toEqual([1, 2, 3]);
  });

  test('returns empty array for k <= 0', () => {
    expect(range(0)).toEqual([]);
    expect(range(-1)).toEqual([]);
  });
});

describe('isMultiplicativeApproximation', () => {
  test('returns true for valid approximation', () => {
    expect(isMultiplicativeApproximation(0.1, 10, 10.5)).toBe(true);
    expect(isMultiplicativeApproximation(0.1, 10, 10)).toBe(true);
  });

  test('returns false for invalid approximation', () => {
    expect(isMultiplicativeApproximation(0.1, 10, 11.1)).toBe(false);
    expect(isMultiplicativeApproximation(0.1, 10, 9.9)).toBe(false);
  });

  test('throws error for negative epsilon', () => {
    expect(() => isMultiplicativeApproximation(-0.1, 10, 10.5)).toThrow("Epsilon must be non-negative.");
  });

  test('throws error for negative x or y', () => {
    expect(() => isMultiplicativeApproximation(0.1, -10, 10.5)).toThrow("x and y must be non-negative.");
    expect(() => isMultiplicativeApproximation(0.1, 10, -10.5)).toThrow("x and y must be non-negative.");
  });
});

describe('isMultiplicativeApproximationTwoSided', () => {
  test('returns true for valid two-sided approximation', () => {
    expect(isMultiplicativeApproximationTwoSided(0.1, 10, 9.5)).toBe(true);
    expect(isMultiplicativeApproximationTwoSided(0.1, 10, 10.5)).toBe(true);
    expect(isMultiplicativeApproximationTwoSided(0.1, 10, 10)).toBe(true);
  });

  test('returns false for invalid two-sided approximation', () => {
    expect(isMultiplicativeApproximationTwoSided(0.1, 10, 9.0)).toBe(false);
    expect(isMultiplicativeApproximationTwoSided(0.1, 10, 11.1)).toBe(false);
  });

  test('throws error for negative epsilon', () => {
    expect(() => isMultiplicativeApproximationTwoSided(-0.1, 10, 10.5)).toThrow("Epsilon must be non-negative.");
  });

  test('throws error for negative x or y', () => {
    expect(() => isMultiplicativeApproximationTwoSided(0.1, -10, 10.5)).toThrow("x and y must be non-negative.");
    expect(() => isMultiplicativeApproximationTwoSided(0.1, 10, -10.5)).toThrow("x and y must be non-negative.");
  });
});

describe('calculateDensity', () => {
  test('calculates the number of non-zero elements', () => {
    expect(calculateDensity([1, 0, 2, -1, 0, 3])).toBe(4);
    expect(calculateDensity([0, 0, 0])).toBe(0);
    expect(calculateDensity([1, 2, 3])).toBe(3);
  });
});

describe('calculateFlipNumber', () => {
  test('calculates the epsilon-flip number', () => {
    expect(calculateFlipNumber([1, 1.2, 0.5, 1.8, 2.1], 0.2)).toBe(3);
    expect(calculateFlipNumber([1, 1.05], 0.1)).toBe(1);
    expect(calculateFlipNumber([1], 0.1)).toBe(0);
  });

  test('throws error for negative epsilon', () => {
    expect(() => calculateFlipNumber([1, 2], -0.1)).toThrow("Epsilon must be non-negative.");
  });
});

describe('calculateFrequencyVector', () => {
  test('calculates frequency vector after updates', () => {
    const updates: StreamUpdate[] = [
      { itemIndex: 1, delta: 1 },
      { itemIndex: 2, delta: -1 },
      { itemIndex: 1, delta: 1 },
    ];
    expect(calculateFrequencyVector(4, updates, 3)).toEqual([2, -1, 0, 0]);
  });

  test('throws error for invalid n', () => {
    expect(() => calculateFrequencyVector(0, [], 0)).toThrow("n must be a positive integer.");
  });
});

describe('subtreeMode', () => {
  test('computes mode for a single leaf node', () => {
    const leaf: TreeNode = { children: [], color: 5 };
    const result = subtreeMode(leaf);
    expect(result.get(leaf)).toBe(5);
  });

  test('computes mode for a tree with multiple leaves', () => {
    const leaf1: TreeNode = { children: [], color: 1 };
    const leaf2: TreeNode = { children: [], color: 2 };
    const leaf3: TreeNode = { children: [], color: 1 };
    const root: TreeNode = { children: [leaf1, leaf2, leaf3] };
    const result = subtreeMode(root);
    expect(result.get(leaf1)).toBe(1);
    expect(result.get(leaf2)).toBe(2);
    expect(result.get(leaf3)).toBe(1);
    expect(result.get(root)).toBe(1); // 1 appears twice, 2 once
  });

  test('computes mode for a more complex tree', () => {
    const leaf1: TreeNode = { children: [], color: 1 };
    const leaf2: TreeNode = { children: [], color: 2 };
    const leaf3: TreeNode = { children: [], color: 2 };
    const leaf4: TreeNode = { children: [], color: 3 };
    const internal1: TreeNode = { children: [leaf1, leaf2] };
    const internal2: TreeNode = { children: [leaf3, leaf4] };
    const root: TreeNode = { children: [internal1, internal2] };
    const result = subtreeMode(root);
    expect(result.get(leaf1)).toBe(1);
    expect(result.get(leaf2)).toBe(2);
    expect(result.get(leaf3)).toBe(2);
    expect(result.get(leaf4)).toBe(3);
    expect(result.get(internal1)).toBe(1); // modes: 1 and 2, 1 appears once, but since equal, takes the first max
    expect(result.get(internal2)).toBe(2); // 2 and 3, 2 appears once
    expect(result.get(root)).toBe(1); // 1 and 2, 1 appears once
  });
});

describe('AdjacencyListGraph', () => {
  describe('undirected unweighted graph', () => {
    let graph: AdjacencyListGraph<string>;

    beforeEach(() => {
      graph = new AdjacencyListGraph<string>(false, false);
    });

    test('starts empty', () => {
      expect(graph.getVertexCount()).toBe(0);
      expect(graph.getEdgeCount()).toBe(0);
      expect(graph.vertices).toEqual([]);
      expect(graph.edges).toEqual([]);
    });

    test('adds vertices', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      expect(graph.getVertexCount()).toBe(2);
      expect(graph.vertices).toEqual(['A', 'B']);
      expect(graph.hasVertex('A')).toBe(true);
      expect(graph.hasVertex('C')).toBe(false);
    });

    test('adds edges', () => {
      graph.addVertex('A');
      graph.addVertex('B');
      graph.addEdge('A', 'B');
      expect(graph.getEdgeCount()).toBe(1);
      expect(graph.hasEdge('A', 'B')).toBe(true);
      expect(graph.hasEdge('B', 'A')).toBe(true); // undirected
      expect(graph.getNeighbors('A')).toEqual(['B']);
      expect(graph.getNeighbors('B')).toEqual(['A']);
    });

    test('removes edges', () => {
      graph.addEdge('A', 'B');
      expect(graph.hasEdge('A', 'B')).toBe(true);
      graph.removeEdge('A', 'B');
      expect(graph.hasEdge('A', 'B')).toBe(false);
      expect(graph.hasEdge('B', 'A')).toBe(false); // undirected
    });

    test('calculates degrees correctly', () => {
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');
      expect(graph.getDegree('A')).toBe(2);
      expect(graph.getDegree('B')).toBe(1);
      expect(graph.getDegree('C')).toBe(1);
    });

    test('removes vertices', () => {
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');
      graph.removeVertex('A');
      expect(graph.hasVertex('A')).toBe(false);
      expect(graph.getVertexCount()).toBe(2);
      expect(graph.hasEdge('B', 'C')).toBe(false);
    });
  });

  describe('directed weighted graph', () => {
    let graph: AdjacencyListGraph<string>;

    beforeEach(() => {
      graph = new AdjacencyListGraph<string>(true, true);
    });

    test('handles directed edges', () => {
      graph.addEdge('A', 'B', 5);
      expect(graph.hasEdge('A', 'B')).toBe(true);
      expect(graph.hasEdge('B', 'A')).toBe(false); // directed
      expect(graph.getEdgeWeight('A', 'B')).toBe(5);
      expect(graph.getEdgeWeight('B', 'A')).toBeUndefined();
    });

    test('calculates in/out degrees', () => {
      graph.addEdge('A', 'B', 1);
      graph.addEdge('B', 'A', 2);
      graph.addEdge('A', 'C', 3);
      expect(graph.getOutDegree('A')).toBe(2);
      expect(graph.getInDegree('A')).toBe(1);
      expect(graph.getOutDegree('B')).toBe(1);
      expect(graph.getInDegree('B')).toBe(1);
      expect(graph.getOutDegree('C')).toBe(0);
      expect(graph.getInDegree('C')).toBe(1);
    });
  });
});

describe('AdjacencyMatrixGraph', () => {
  describe('undirected unweighted graph', () => {
    let graph: AdjacencyMatrixGraph;

    beforeEach(() => {
      graph = new AdjacencyMatrixGraph(false, false);
    });

    test('starts empty', () => {
      expect(graph.getVertexCount()).toBe(0);
      expect(graph.getEdgeCount()).toBe(0);
    });

    test('adds vertices', () => {
      graph.addVertex(1);
      graph.addVertex(2);
      expect(graph.getVertexCount()).toBe(2);
      expect(graph.vertices).toEqual([1, 2]);
    });

    test('adds edges', () => {
      graph.addVertex(1);
      graph.addVertex(2);
      graph.addEdge(1, 2);
      expect(graph.getEdgeCount()).toBe(1);
      expect(graph.hasEdge(1, 2)).toBe(true);
      expect(graph.hasEdge(2, 1)).toBe(true); // undirected
      expect(graph.getNeighbors(1)).toEqual([2]);
      expect(graph.getNeighbors(2)).toEqual([1]);
    });

    test('handles weighted edges', () => {
      const weightedGraph = new AdjacencyMatrixGraph(false, true);
      weightedGraph.addEdge(1, 2, 3.5);
      expect(weightedGraph.getEdgeWeight(1, 2)).toBe(3.5);
      expect(weightedGraph.getEdgeWeight(2, 1)).toBe(3.5); // undirected
    });
  });

  describe('directed graph', () => {
    let graph: AdjacencyMatrixGraph;

    beforeEach(() => {
      graph = new AdjacencyMatrixGraph(true, false);
    });

    test('handles directed edges', () => {
      graph.addEdge(1, 2);
      expect(graph.hasEdge(1, 2)).toBe(true);
      expect(graph.hasEdge(2, 1)).toBe(false); // directed
    });

    test('calculates degrees correctly', () => {
      graph.addEdge(1, 2);
      graph.addEdge(2, 1);
      graph.addEdge(1, 3);
      expect(graph.getOutDegree(1)).toBe(2);
      expect(graph.getInDegree(1)).toBe(1);
      expect(graph.getOutDegree(2)).toBe(1);
      expect(graph.getInDegree(2)).toBe(1);
      expect(graph.getOutDegree(3)).toBe(0);
      expect(graph.getInDegree(3)).toBe(1);
    });
  });
});
