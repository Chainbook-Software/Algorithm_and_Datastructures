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

/**
 * A basic implementation of the LP relaxation for Correlation Clustering.
 * Note: Solving general LPs requires an LP solver library. This code provides the *formulation*
 * of the LP, but it does NOT include a solver.  You will need to integrate an external
 * LP solver library (e.g., `glpk.js`, `lp_solve`) to obtain numerical solutions.
 */
export class CorrelationClusteringLP {
  private positiveEdges: [number, number][];
  private negativeEdges: [number, number][];
  private vertices: number[];

  /**
   * Constructs a CorrelationClusteringLP instance.
   * @param vertices The vertices in the graph.
   * @param positiveEdges The positive edges (i, j).
   * @param negativeEdges The negative edges (i, j).
   */
  constructor(vertices: number[], positiveEdges: [number, number][], negativeEdges: [number, number][]) {
    this.vertices = vertices;
    this.positiveEdges = positiveEdges;
    this.negativeEdges = negativeEdges;
  }

  /**
   * Formulates the Correlation Clustering LP. This function *generates* the objective function,
   * constraints, and variable bounds, but it *does not solve it*.  Solving requires
   * an external LP solver.
   * @returns An object containing the objective coefficients, constraint coefficients,
   * right-hand sides, constraint types, and variable bounds, in a format suitable for
   * an LP solver library.  **NOTE: This function does NOT solve the LP.**
   */
  formulateLP(): {
    objectiveCoefficients: number[];
    constraintCoefficients: number[][];
    rhs: number[];
    constraintTypes: string[]; // "<=", ">=", "="
    variableBounds: { min: number; max: number }[];
    variableNames: string[];
  } {
    const numVertices = this.vertices.length;

    // 1. Define Variables
    //   - z_ij for each edge (i, j)
    //   - z_S for each subset S of vertices (This becomes impractical for large graphs)

    // In this simplified implementation, we will NOT enumerate all subsets S.
    // Instead, we will focus on formulating the objective and constraints related to z_ij variables.
    // A full implementation would require generating all possible subsets, which grows exponentially
    // with the number of vertices, making it impractical for larger graphs.

    const objectiveCoefficients: number[] = [];
    const constraintCoefficients: number[][] = [];
    const rhs: number[] = [];
    const constraintTypes: string[] = [];
    const variableBounds: { min: number; max: number }[] = [];
    const variableNames: string[] = [];

    // 2. Objective Function Coefficients
    //    min  ∑_{ij∈E+} z_{ij} + ∑_{ij∈E-} (1 - z_{ij})
    //    which is equivalent to min ∑_{ij∈E+} z_{ij} - ∑_{ij∈E-} z_{ij} + |E-|
    //    Since |E-| is a constant, we can minimize ∑_{ij∈E+} z_{ij} - ∑_{ij∈E-} z_{ij}

    // Create a map to store the index of each z_ij variable
    const edgeVariableIndex: Map<string, number> = new Map();
    let variableIndex = 0;

    //Positive Edges
    for (const [i, j] of this.positiveEdges) {
      objectiveCoefficients.push(1); // Coefficient for z_ij
      variableBounds.push({ min: 0, max: 1 }); // 0 <= z_ij <= 1
      variableNames.push(`z_${i}_${j}`);
      edgeVariableIndex.set(`${i}_${j}`, variableIndex++);
    }

    //Negative Edges
    for (const [i, j] of this.negativeEdges) {
      objectiveCoefficients.push(-1); // Coefficient for z_ij
      variableBounds.push({ min: 0, max: 1 }); // 0 <= z_ij <= 1
      variableNames.push(`z_${i}_${j}`);
      edgeVariableIndex.set(`${i}_${j}`, variableIndex++);
    }

    // 3. Constraints (Simplified - Without Explicit Subset Enumeration)
    //    The core difficulty here is representing the constraints involving z_S variables
    //    without explicitly enumerating all subsets.

    // Example: Triangle Inequality Constraints (Relaxation)
    // For any three vertices i, j, k:
    // z_ij <= z_ik + z_jk
    // z_ik <= z_ij + z_jk
    // z_jk <= z_ij + z_ik
    // These constraints are a common relaxation used in practice.

    // Iterate through all triplets of vertices
    for (let i = 0; i < numVertices; i++) {
      for (let j = i + 1; j < numVertices; j++) {
        for (let k = j + 1; k < numVertices; k++) {
          const vertexI = this.vertices[i];
          const vertexJ = this.vertices[j];
          const vertexK = this.vertices[k];

          // Get the variable indices for the edges (i, j), (i, k), and (j, k)
          const indexIJ = edgeVariableIndex.get(`${vertexI}_${vertexJ}`) ?? edgeVariableIndex.get(`${vertexJ}_${vertexI}`) ?? -1;
          const indexIK = edgeVariableIndex.get(`${vertexI}_${vertexK}`) ?? edgeVariableIndex.get(`${vertexK}_${vertexI}`) ?? -1;
          const indexJK = edgeVariableIndex.get(`${vertexJ}_${vertexK}`) ?? edgeVariableIndex.get(`${vertexK}_${vertexJ}`) ?? -1;

          //If any of the edges do not exist, skip
          if (indexIJ === -1 || indexIK === -1 || indexJK === -1) continue;

          // Constraint 1: z_ij <= z_ik + z_jk  =>  z_ij - z_ik - z_jk <= 0
          const constraint1: number[] = new Array(variableIndex).fill(0);
          constraint1[indexIJ] = 1;
          constraint1[indexIK] = -1;
          constraint1[indexJK] = -1;
          constraintCoefficients.push(constraint1);
          rhs.push(0);
          constraintTypes.push("<=");

          // Constraint 2: z_ik <= z_ij + z_jk  =>  -z_ij + z_ik - z_jk <= 0
          const constraint2: number[] = new Array(variableIndex).fill(0);
          constraint2[indexIJ] = -1;
          constraint2[indexIK] = 1;
          constraint2[indexJK] = -1;
          constraintCoefficients.push(constraint2);
          rhs.push(0);
          constraintTypes.push("<=");

          // Constraint 3: z_jk <= z_ij + z_ik  =>  -z_ij - z_ik + z_jk <= 0
          const constraint3: number[] = new Array(variableIndex).fill(0);
          constraint3[indexIJ] = -1;
          constraint3[indexIK] = -1;
          constraint3[indexJK] = 1;
          constraintCoefficients.push(constraint3);
          rhs.push(0);
          constraintTypes.push("<=");

        }
      }
    }

    return {
      objectiveCoefficients,
      constraintCoefficients,
      rhs,
      constraintTypes,
      variableBounds,
      variableNames
    };
  }

  /**
   * **This is a placeholder for solving the LP.**  You MUST replace this with code that uses
   * an actual LP solver library (e.g., glpk.js, lp_solve). This function currently returns
   * a dummy solution.
   * @param lpFormulation The LP formulation generated by `formulateLP()`.
   * @returns A dummy solution. **Replace this with a call to a real LP solver.**
   */
  solveLP(
    lpFormulation: {
      objectiveCoefficients: number[];
      constraintCoefficients: number[][];
      rhs: number[];
      constraintTypes: string[];
      variableBounds: { min: number; max: number }[];
      variableNames: string[];
    }
  ): { [variableName: string]: number } {
    console.warn(
      "Warning: solveLP() is a placeholder.  You MUST integrate a real LP solver library to use this code."
    );

    const dummySolution: { [variableName: string]: number } = {};
    for (const variableName of lpFormulation.variableNames) {
      dummySolution[variableName] = 0.5; // Assign a dummy value of 0.5 to all variables
    }
    return dummySolution;
  }


  /**
   * Interprets the LP solution to produce a clustering. This is a heuristic approach
   * and may not produce an optimal clustering.
   * @param lpSolution The LP solution (a map of variable names to values).
   * @returns A clustering represented as a map where the key is the vertex and the value
   * is the cluster ID.
   */
  interpretSolution(lpSolution: { [variableName: string]: number }): Map<number, number> {
    const clustering: Map<number, number> = new Map();
    let clusterId = 0;

    for (const vertex of this.vertices) {
      if (!clustering.has(vertex)) {
        // Start a new cluster
        clustering.set(vertex, clusterId);

        // Assign other vertices to the same cluster based on z_ij values
        for (const otherVertex of this.vertices) {
          if (vertex === otherVertex) continue;

          const variableName = `z_${vertex}_${otherVertex}`;
          const zValue = lpSolution[variableName] ?? lpSolution[`z_${otherVertex}_${vertex}`] ?? -1;

          if (zValue !== -1 && zValue < 0.5) {
            // If z_ij is close to 0, put otherVertex in the same cluster
            clustering.set(otherVertex, clusterId);
          }
        }
        clusterId++; // Next cluster
      }
    }
    return clustering;
  }


  /**
   * Prints the clustering result.
   * @param clustering A map where key is the vertex and value is the cluster ID.
   */
  printClustering(clustering: Map<number, number>): void {
    const clusterMap: Map<number, number[]> = new Map();
    for (const [vertex, clusterId] of clustering) {
      if (!clusterMap.has(clusterId)) {
        clusterMap.set(clusterId, []);
      }
      clusterMap.get(clusterId)?.push(vertex);
    }

    for (const [clusterId, vertices] of clusterMap) {
      console.log(`Cluster ${clusterId}: ${vertices.join(", ")}`);
    }
  }
}
