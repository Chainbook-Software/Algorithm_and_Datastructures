/// <reference types="jest" />

import { CorrelationClustering, Clustering, CorrelationClusteringLP } from '../index';

describe('CorrelationClustering', () => {
  describe('calculateMistakes', () => {
    test('calculates mistakes correctly', () => {
      const vertices = [0, 1, 2];
      const positiveEdges: [number, number][] = [[0, 1]];
      const negativeEdges: [number, number][] = [[1, 2]];
      const clustering = new CorrelationClustering(vertices, positiveEdges, negativeEdges);

      // Clustering where 0 and 1 are together (good for positive edge), 1 and 2 are separate (good for negative edge)
      const goodClustering = new Map([[0, 0], [1, 0], [2, 1]]);
      expect(clustering.calculateMistakes(goodClustering)).toBe(0);

      // Clustering where 0 and 1 are separate (bad for positive edge), 1 and 2 are together (bad for negative edge)
      const badClustering = new Map([[0, 0], [1, 1], [2, 1]]);
      expect(clustering.calculateMistakes(badClustering)).toBe(2);
    });
  });

  describe('greedyCorrelationClustering', () => {
    test('finds optimal clustering for simple case', () => {
      const vertices = [0, 1, 2];
      const positiveEdges: [number, number][] = [[0, 1], [1, 2]];
      const negativeEdges: [number, number][] = [];
      const clustering = new CorrelationClustering(vertices, positiveEdges, negativeEdges);

      const result = clustering.greedyCorrelationClustering();
      expect(result.mistakes).toBe(0);
      expect(result.clusterCount).toBe(1); // All should be in one cluster
    });

    test('handles conflicting constraints', () => {
      const vertices = [0, 1, 2];
      const positiveEdges: [number, number][] = [[0, 1]];
      const negativeEdges: [number, number][] = [[1, 2]];
      const clustering = new CorrelationClustering(vertices, positiveEdges, negativeEdges);

      const result = clustering.greedyCorrelationClustering();
      // Should have 0 and 1 together, 2 separate
      expect(result.mistakes).toBe(0);
      expect(result.clusterCount).toBe(2);
    });
  });

  describe('simpleGreedyClustering', () => {
    test('produces valid clustering', () => {
      const vertices = [0, 1, 2, 3];
      const positiveEdges: [number, number][] = [[0, 1], [2, 3]];
      const negativeEdges: [number, number][] = [[1, 2]];
      const clustering = new CorrelationClustering(vertices, positiveEdges, negativeEdges);

      const result = clustering.simpleGreedyClustering();
      expect(result.mistakes).toBeGreaterThanOrEqual(0);
      expect(result.clusterCount).toBeGreaterThan(0);
      expect(clustering.validateClustering(result.clustering)).toBe(true);
    });
  });

  describe('helper methods', () => {
    test('getClustersAsArrays works correctly', () => {
      const vertices = [0, 1, 2, 3];
      const positiveEdges: [number, number][] = [];
      const negativeEdges: [number, number][] = [];
      const clustering = new CorrelationClustering(vertices, positiveEdges, negativeEdges);

      const clusteringMap = new Map([[0, 0], [1, 0], [2, 1], [3, 1]]);
      const clusters = clustering.getClustersAsArrays(clusteringMap);

      expect(clusters.get(0)).toEqual([0, 1]);
      expect(clusters.get(1)).toEqual([2, 3]);
    });

    test('validateClustering works correctly', () => {
      const vertices = [0, 1, 2];
      const positiveEdges: [number, number][] = [];
      const negativeEdges: [number, number][] = [];
      const clustering = new CorrelationClustering(vertices, positiveEdges, negativeEdges);

      const validClustering = new Map([[0, 0], [1, 1], [2, 2]]);
      const invalidClustering = new Map([[0, 0], [1, 1]]); // Missing vertex 2

      expect(clustering.validateClustering(validClustering)).toBe(true);
      expect(clustering.validateClustering(invalidClustering)).toBe(false);
    });

    test('getGraphStats returns correct statistics', () => {
      const vertices = [0, 1, 2, 3];
      const positiveEdges: [number, number][] = [[0, 1], [1, 2]];
      const negativeEdges: [number, number][] = [[2, 3]];
      const clustering = new CorrelationClustering(vertices, positiveEdges, negativeEdges);

      const stats = clustering.getGraphStats();
      expect(stats.vertexCount).toBe(4);
      expect(stats.positiveEdgeCount).toBe(2);
      expect(stats.negativeEdgeCount).toBe(1);
      expect(stats.totalEdgeCount).toBe(3);
    });
  });

  describe('edge cases', () => {
    test('handles empty graph', () => {
      const vertices: number[] = [];
      const positiveEdges: [number, number][] = [];
      const negativeEdges: [number, number][] = [];
      const clustering = new CorrelationClustering(vertices, positiveEdges, negativeEdges);

      const result = clustering.greedyCorrelationClustering();
      expect(result.mistakes).toBe(0);
      expect(result.clusterCount).toBe(0);
    });

    test('handles single vertex', () => {
      const vertices = [0];
      const positiveEdges: [number, number][] = [];
      const negativeEdges: [number, number][] = [];
      const clustering = new CorrelationClustering(vertices, positiveEdges, negativeEdges);

      const result = clustering.greedyCorrelationClustering();
      expect(result.mistakes).toBe(0);
      expect(result.clusterCount).toBe(1);
    });

    test('handles disconnected graph', () => {
      const vertices = [0, 1, 2, 3];
      const positiveEdges: [number, number][] = [];
      const negativeEdges: [number, number][] = [];
      const clustering = new CorrelationClustering(vertices, positiveEdges, negativeEdges);

      const result = clustering.greedyCorrelationClustering();
      expect(result.mistakes).toBe(0);
      expect(result.clusterCount).toBe(4); // Each vertex in its own cluster
    });
  });
});

describe('CorrelationClusteringLP', () => {
  describe('formulateLP', () => {
    test('formulates LP correctly for simple case', () => {
      const vertices = [1, 2, 3];
      const positiveEdges: [number, number][] = [[1, 2]];
      const negativeEdges: [number, number][] = [[2, 3]];
      const lpModel = new CorrelationClusteringLP(vertices, positiveEdges, negativeEdges);

      const formulation = lpModel.formulateLP();

      // Should have 2 variables (one for each edge)
      expect(formulation.variableNames).toEqual(['z_1_2', 'z_2_3']);
      expect(formulation.objectiveCoefficients).toEqual([1, -1]); // +1 for positive edge, -1 for negative edge
      expect(formulation.variableBounds).toHaveLength(2);
      expect(formulation.variableBounds[0]).toEqual({ min: 0, max: 1 });
      expect(formulation.variableBounds[1]).toEqual({ min: 0, max: 1 });
    });

    test('includes triangle inequality constraints for triplets', () => {
      const vertices = [1, 2, 3, 4];
      const positiveEdges: [number, number][] = [[1, 2], [1, 3], [2, 3]];
      const negativeEdges: [number, number][] = [];
      const lpModel = new CorrelationClusteringLP(vertices, positiveEdges, negativeEdges);

      const formulation = lpModel.formulateLP();

      // Should have 3 variables for the triangle edges
      expect(formulation.variableNames).toEqual(['z_1_2', 'z_1_3', 'z_2_3']);
      expect(formulation.objectiveCoefficients).toEqual([1, 1, 1]); // All positive edges

      // Should have 3 triangle inequality constraints (3 per triplet)
      expect(formulation.constraintCoefficients).toHaveLength(3);
      expect(formulation.constraintTypes).toEqual(['<=', '<=', '<=']);
      expect(formulation.rhs).toEqual([0, 0, 0]);
    });

    test('handles empty edges', () => {
      const vertices = [1, 2, 3];
      const positiveEdges: [number, number][] = [];
      const negativeEdges: [number, number][] = [];
      const lpModel = new CorrelationClusteringLP(vertices, positiveEdges, negativeEdges);

      const formulation = lpModel.formulateLP();

      expect(formulation.variableNames).toEqual([]);
      expect(formulation.objectiveCoefficients).toEqual([]);
      expect(formulation.constraintCoefficients).toEqual([]);
    });
  });

  describe('solveLP', () => {
    test('returns dummy solution with warning', () => {
      const vertices = [1, 2];
      const positiveEdges: [number, number][] = [[1, 2]];
      const negativeEdges: [number, number][] = [];
      const lpModel = new CorrelationClusteringLP(vertices, positiveEdges, negativeEdges);

      const formulation = lpModel.formulateLP();

      // Mock console.warn to capture the warning
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const solution = lpModel.solveLP(formulation);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Warning: solveLP() is a placeholder.  You MUST integrate a real LP solver library to use this code."
      );

      expect(solution).toEqual({ 'z_1_2': 0.5 });

      consoleWarnSpy.mockRestore();
    });
  });

  describe('interpretSolution', () => {
    test('interprets solution to create clustering', () => {
      const vertices = [1, 2, 3];
      const positiveEdges: [number, number][] = [[1, 2]];
      const negativeEdges: [number, number][] = [[2, 3]];
      const lpModel = new CorrelationClusteringLP(vertices, positiveEdges, negativeEdges);

      // Solution where z_1_2 = 0.3 (should cluster 1 and 2), z_2_3 = 0.7 (should separate 2 and 3)
      const lpSolution = { 'z_1_2': 0.3, 'z_2_3': 0.7 };

      const clustering = lpModel.interpretSolution(lpSolution);

      // Should have 1 and 2 in same cluster (0), 3 in different cluster (1)
      expect(clustering.get(1)).toBe(clustering.get(2));
      expect(clustering.get(2)).not.toBe(clustering.get(3));
    });

    test('handles missing edge variables', () => {
      const vertices = [1, 2, 3];
      const positiveEdges: [number, number][] = [[1, 2]];
      const negativeEdges: [number, number][] = [];
      const lpModel = new CorrelationClusteringLP(vertices, positiveEdges, negativeEdges);

      // Solution missing some variables
      const lpSolution = { 'z_1_2': 0.3 };

      const clustering = lpModel.interpretSolution(lpSolution);

      // Should still create valid clustering
      expect(clustering.has(1)).toBe(true);
      expect(clustering.has(2)).toBe(true);
      expect(clustering.has(3)).toBe(true);
    });
  });

  describe('printClustering', () => {
    test('prints clustering correctly', () => {
      const vertices = [1, 2, 3];
      const positiveEdges: [number, number][] = [];
      const negativeEdges: [number, number][] = [];
      const lpModel = new CorrelationClusteringLP(vertices, positiveEdges, negativeEdges);

      const clustering = new Map([[1, 0], [2, 0], [3, 1]]);

      // Mock console.log to capture output
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      lpModel.printClustering(clustering);

      expect(consoleLogSpy).toHaveBeenCalledWith('Cluster 0: 1, 2');
      expect(consoleLogSpy).toHaveBeenCalledWith('Cluster 1: 3');

      consoleLogSpy.mockRestore();
    });
  });

  describe('integration test', () => {
    test('end-to-end LP formulation and interpretation', () => {
      const vertices = [1, 2, 3];
      const positiveEdges: [number, number][] = [[1, 2], [2, 3]];
      const negativeEdges: [number, number][] = [[1, 3]];
      const lpModel = new CorrelationClusteringLP(vertices, positiveEdges, negativeEdges);

      // Formulate LP
      const formulation = lpModel.formulateLP();

      // Get dummy solution
      const solution = lpModel.solveLP(formulation);

      // Interpret solution
      const clustering = lpModel.interpretSolution(solution);

      // Should produce a valid clustering
      expect(clustering.size).toBe(3);
      expect(Array.from(clustering.keys())).toEqual(expect.arrayContaining([1, 2, 3]));
    });
  });
});
