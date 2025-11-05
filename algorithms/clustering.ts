/**
 * Correlation clustering algorithms for signed graphs.
 * Correlation clustering aims to partition vertices into clusters that minimize
 * the number of disagreements with the edge signs.
 */

/**
 * Represents a clustering result where each vertex is assigned to a cluster.
 */
export interface Clustering {
  /** Map where key is vertex ID and value is cluster ID */
  clustering: Map<number, number>;
  /** Number of mistakes in this clustering */
  mistakes: number;
  /** Number of clusters */
  clusterCount: number;
}

/**
 * Correlation clustering implementation for signed graphs.
 * This algorithm partitions vertices into clusters to minimize the disagreement
 * between cluster assignments and edge signs.
 */
export class CorrelationClustering {
  private vertices: number[];
  private positiveEdges: Set<string>; // Use string keys for fast lookup
  private negativeEdges: Set<string>;

  /**
   * Constructs a CorrelationClustering instance.
   * @param vertices Array of vertex IDs
   * @param positiveEdges Array of positive edge tuples [u, v]
   * @param negativeEdges Array of negative edge tuples [u, v]
   */
  constructor(
    vertices: number[],
    positiveEdges: [number, number][],
    negativeEdges: [number, number][]
  ) {
    this.vertices = [...vertices];
    this.positiveEdges = new Set(positiveEdges.map(([u, v]) => this.edgeKey(u, v)));
    this.negativeEdges = new Set(negativeEdges.map(([u, v]) => this.edgeKey(u, v)));
  }

  /**
   * Creates a unique key for an undirected edge.
   */
  private edgeKey(u: number, v: number): string {
    return u < v ? `${u}-${v}` : `${v}-${u}`;
  }

  /**
   * Calculates the number of mistakes in a given clustering.
   * A mistake occurs when:
   * - A positive edge connects vertices in different clusters, OR
   * - A negative edge connects vertices in the same cluster
   * @param clustering Map where key is vertex ID and value is cluster ID
   * @returns Number of mistakes
   */
  calculateMistakes(clustering: Map<number, number>): number {
    let mistakes = 0;

    // Check positive edges - should be within same cluster
    for (const edgeKey of this.positiveEdges) {
      const [u, v] = edgeKey.split('-').map(Number);
      if (clustering.get(u) !== clustering.get(v)) {
        mistakes++;
      }
    }

    // Check negative edges - should be in different clusters
    for (const edgeKey of this.negativeEdges) {
      const [u, v] = edgeKey.split('-').map(Number);
      if (clustering.get(u) === clustering.get(v)) {
        mistakes++;
      }
    }

    return mistakes;
  }

  /**
   * Gets the number of clusters in a clustering.
   */
  private getClusterCount(clustering: Map<number, number>): number {
    return new Set(clustering.values()).size;
  }

  /**
   * Creates a deep copy of a clustering map.
   */
  private cloneClustering(clustering: Map<number, number>): Map<number, number> {
    return new Map(clustering);
  }

  /**
   * Implements a greedy correlation clustering algorithm.
   * This algorithm iteratively tries to merge clusters to reduce mistakes.
   * @returns The best clustering found
   */
  greedyCorrelationClustering(): Clustering {
    // Initialize: each vertex in its own cluster
    const clustering: Map<number, number> = new Map();
    for (const vertex of this.vertices) {
      clustering.set(vertex, vertex);
    }

    let bestClustering = this.cloneClustering(clustering);
    let minMistakes = this.calculateMistakes(bestClustering);

    let improved = true;
    let iterations = 0;
    const maxIterations = this.vertices.length * this.vertices.length; // Prevent infinite loops

    while (improved && iterations < maxIterations) {
      improved = false;
      iterations++;

      // Try merging each pair of clusters
      const currentClusters = Array.from(new Set(clustering.values()));

      for (let i = 0; i < currentClusters.length; i++) {
        for (let j = i + 1; j < currentClusters.length; j++) {
          const clusterA = currentClusters[i];
          const clusterB = currentClusters[j];

          // Try merging clusterA into clusterB
          const testClustering = this.cloneClustering(clustering);

          // Move all vertices from clusterA to clusterB
          for (const [vertex, cluster] of testClustering) {
            if (cluster === clusterA) {
              testClustering.set(vertex, clusterB);
            }
          }

          const testMistakes = this.calculateMistakes(testClustering);

          if (testMistakes < minMistakes) {
            minMistakes = testMistakes;
            bestClustering = this.cloneClustering(testClustering);
            clustering.clear();
            testClustering.forEach((cluster, vertex) => clustering.set(vertex, cluster));
            improved = true;
          }
        }
      }
    }

    return {
      clustering: bestClustering,
      mistakes: minMistakes,
      clusterCount: this.getClusterCount(bestClustering)
    };
  }

  /**
   * Implements a simplified greedy correlation clustering.
   * This version tries merging individual vertex clusters.
   * @returns The best clustering found
   */
  simpleGreedyClustering(): Clustering {
    // Initialize: each vertex in its own cluster
    const clustering: Map<number, number> = new Map();
    for (const vertex of this.vertices) {
      clustering.set(vertex, vertex);
    }

    let bestClustering = this.cloneClustering(clustering);
    let minMistakes = this.calculateMistakes(bestClustering);

    let changed = true;
    while (changed) {
      changed = false;

      for (const u of this.vertices) {
        for (const v of this.vertices) {
          if (u === v) continue;

          const uCluster = clustering.get(u)!;
          const vCluster = clustering.get(v)!;

          if (uCluster === vCluster) continue; // Already in same cluster

          // Try merging u's cluster into v's cluster
          const testClustering = this.cloneClustering(clustering);

          // Move u's cluster to v's cluster
          for (const [vertex, cluster] of testClustering) {
            if (cluster === uCluster) {
              testClustering.set(vertex, vCluster);
            }
          }

          const testMistakes = this.calculateMistakes(testClustering);

          if (testMistakes < minMistakes) {
            minMistakes = testMistakes;
            bestClustering = this.cloneClustering(testClustering);
            // Update current clustering
            clustering.clear();
            testClustering.forEach((cluster, vertex) => clustering.set(vertex, cluster));
            changed = true;
          }
        }
      }
    }

    return {
      clustering: bestClustering,
      mistakes: minMistakes,
      clusterCount: this.getClusterCount(bestClustering)
    };
  }

  /**
   * Gets clusters as arrays of vertices.
   * @param clustering The clustering result
   * @returns Map where key is cluster ID and value is array of vertices
   */
  getClustersAsArrays(clustering: Map<number, number>): Map<number, number[]> {
    const clusterMap: Map<number, number[]> = new Map();

    for (const [vertex, clusterId] of clustering) {
      if (!clusterMap.has(clusterId)) {
        clusterMap.set(clusterId, []);
      }
      clusterMap.get(clusterId)!.push(vertex);
    }

    return clusterMap;
  }

  /**
   * Prints a clustering result in a readable format.
   * @param clustering The clustering to print
   */
  printClustering(clustering: Clustering): void {
    console.log(`Clustering Result (${clustering.clusterCount} clusters, ${clustering.mistakes} mistakes):`);

    const clusters = this.getClustersAsArrays(clustering.clustering);

    for (const [clusterId, vertices] of clusters) {
      console.log(`Cluster ${clusterId}: [${vertices.sort().join(', ')}]`);
    }
  }

  /**
   * Validates that all vertices are accounted for in the clustering.
   * @param clustering The clustering to validate
   * @returns True if valid, false otherwise
   */
  validateClustering(clustering: Map<number, number>): boolean {
    const clusteredVertices = new Set(clustering.keys());
    return this.vertices.every(vertex => clusteredVertices.has(vertex));
  }

  /**
   * Gets statistics about the signed graph.
   */
  getGraphStats(): {
    vertexCount: number;
    positiveEdgeCount: number;
    negativeEdgeCount: number;
    totalEdgeCount: number;
  } {
    return {
      vertexCount: this.vertices.length,
      positiveEdgeCount: this.positiveEdges.size,
      negativeEdgeCount: this.negativeEdges.size,
      totalEdgeCount: this.positiveEdges.size + this.negativeEdges.size
    };
  }
}
