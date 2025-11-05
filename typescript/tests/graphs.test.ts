/// <reference types="jest" />

import { AdjacencyListGraph, AdjacencyMatrixGraph, SignedGraph } from '../index';

describe('AdjacencyListGraph', () => {
  describe('undirected unweighted graph', () => {
    let graph: AdjacencyListGraph<number>;

    beforeEach(() => {
      graph = new AdjacencyListGraph(false, false);
    });

    test('adds and removes vertices', () => {
      graph.addVertex(1);
      graph.addVertex(2);
      expect(graph.hasVertex(1)).toBe(true);
      expect(graph.hasVertex(2)).toBe(true);
      expect(graph.getVertexCount()).toBe(2);

      graph.removeVertex(1);
      expect(graph.hasVertex(1)).toBe(false);
      expect(graph.getVertexCount()).toBe(1);
    });

    test('adds and removes edges', () => {
      graph.addEdge(1, 2);
      expect(graph.hasEdge(1, 2)).toBe(true);
      expect(graph.hasEdge(2, 1)).toBe(true); // undirected
      expect(graph.getEdgeCount()).toBe(1);

      graph.removeEdge(1, 2);
      expect(graph.hasEdge(1, 2)).toBe(false);
      expect(graph.getEdgeCount()).toBe(0);
    });

    test('gets neighbors and degree', () => {
      graph.addEdge(1, 2);
      graph.addEdge(1, 3);
      expect(graph.getNeighbors(1)).toEqual(expect.arrayContaining([2, 3]));
      expect(graph.getDegree(1)).toBe(2);
    });
  });

  describe('directed weighted graph', () => {
    let graph: AdjacencyListGraph<string>;

    beforeEach(() => {
      graph = new AdjacencyListGraph(true, true);
    });

    test('handles directed edges and weights', () => {
      graph.addEdge('A', 'B', 5);
      expect(graph.hasEdge('A', 'B')).toBe(true);
      expect(graph.hasEdge('B', 'A')).toBe(false); // directed
      expect(graph.getEdgeWeight('A', 'B')).toBe(5);
      expect(graph.getEdgeCount()).toBe(1);
    });

    test('gets in-degree and out-degree', () => {
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'A');
      graph.addEdge('A', 'C');
      expect(graph.getOutDegree('A')).toBe(2);
      expect(graph.getInDegree('A')).toBe(1);
      expect(graph.getDegree('A')).toBe(2); // for directed, degree = out-degree
    });
  });
});

describe('AdjacencyMatrixGraph', () => {
  describe('undirected unweighted graph', () => {
    let graph: AdjacencyMatrixGraph;

    beforeEach(() => {
      graph = new AdjacencyMatrixGraph(false, false);
    });

    test('adds and removes vertices', () => {
      graph.addVertex(1);
      graph.addVertex(2);
      expect(graph.hasVertex(1)).toBe(true);
      expect(graph.hasVertex(2)).toBe(true);
      expect(graph.getVertexCount()).toBe(2);

      graph.removeVertex(1);
      expect(graph.hasVertex(1)).toBe(false);
      expect(graph.getVertexCount()).toBe(1);
    });

    test('adds and removes edges', () => {
      graph.addEdge(1, 2);
      expect(graph.hasEdge(1, 2)).toBe(true);
      expect(graph.hasEdge(2, 1)).toBe(true); // undirected
      expect(graph.getEdgeCount()).toBe(1);

      graph.removeEdge(1, 2);
      expect(graph.hasEdge(1, 2)).toBe(false);
      expect(graph.getEdgeCount()).toBe(0);
    });

    test('gets neighbors and degree', () => {
      graph.addEdge(1, 2);
      graph.addEdge(1, 3);
      expect(graph.getNeighbors(1)).toEqual(expect.arrayContaining([2, 3]));
      expect(graph.getDegree(1)).toBe(2);
    });
  });

  describe('directed weighted graph', () => {
    let graph: AdjacencyMatrixGraph;

    beforeEach(() => {
      graph = new AdjacencyMatrixGraph(true, true);
    });

    test('handles directed edges and weights', () => {
      graph.addEdge(1, 2, 5);
      expect(graph.hasEdge(1, 2)).toBe(true);
      expect(graph.hasEdge(2, 1)).toBe(false); // directed
      expect(graph.getEdgeWeight(1, 2)).toBe(5);
      expect(graph.getEdgeCount()).toBe(1);
    });

    test('gets in-degree and out-degree', () => {
      graph.addEdge(1, 2);
      graph.addEdge(2, 1);
      graph.addEdge(1, 3);
      expect(graph.getOutDegree(1)).toBe(2);
      expect(graph.getInDegree(1)).toBe(1);
      expect(graph.getDegree(1)).toBe(2); // for directed, degree = out-degree
    });
  });
});

describe('SignedGraph', () => {
  test('creates complete signed graph', () => {
    const graph = new SignedGraph(3);
    expect(graph.getVertexCount()).toBe(3);
    expect(graph.getEdgeCount()).toBe(3); // C(3,2) = 3 edges
    expect(graph.isComplete()).toBe(true);
  });

  test('gets edge signs', () => {
    const graph = new SignedGraph(3, false); // All positive edges
    expect(graph.getEdgeSign(0, 1)).toBe(1);
    expect(graph.getEdgeSign(1, 2)).toBe(1);
    expect(graph.getEdgeSign(0, 2)).toBe(1);
    expect(graph.getEdgeSign(0, 0)).toBe(0); // No self-loops
  });

  test('flips edge signs', () => {
    const graph = new SignedGraph(3, false);
    expect(graph.getEdgeSign(0, 1)).toBe(1);
    graph.flipEdgeSign(0, 1);
    expect(graph.getEdgeSign(0, 1)).toBe(-1);
    graph.flipEdgeSign(0, 1);
    expect(graph.getEdgeSign(0, 1)).toBe(1);
  });

  test('counts positive and negative edges', () => {
    const graph = new SignedGraph(3, false);
    expect(graph.countPositiveEdges()).toBe(3);
    expect(graph.countNegativeEdges()).toBe(0);

    graph.flipEdgeSign(0, 1);
    expect(graph.countPositiveEdges()).toBe(2);
    expect(graph.countNegativeEdges()).toBe(1);
  });

  test('throws errors for invalid operations', () => {
    const graph = new SignedGraph(3);
    expect(() => graph.addVertex(3)).toThrow();
    expect(() => graph.removeVertex(0)).toThrow();
    expect(() => graph.removeEdge(0, 1)).toThrow();
    expect(() => graph.clear()).toThrow();
    expect(() => graph.flipEdgeSign(0, 3)).toThrow();
    expect(() => graph.flipEdgeSign(0, 0)).toThrow();
  });

  test('implements Graph interface correctly', () => {
    const graph = new SignedGraph(3, false);
    expect(graph.isDirected).toBe(false);
    expect(graph.isWeighted).toBe(true);
    expect(graph.vertices).toEqual([0, 1, 2]);
    expect(graph.hasEdge(0, 1)).toBe(true);
    expect(graph.getEdgeWeight(0, 1)).toBe(1);
    expect(graph.getNeighbors(0)).toEqual([1, 2]);
    expect(graph.getDegree(0)).toBe(2);
  });
});
