<?php

/**
 * Correlation clustering algorithms for signed graphs.
 * Correlation clustering aims to partition vertices into clusters that minimize
 * the number of disagreements with the edge signs.
 */

/**
 * Represents a clustering result where each vertex is assigned to a cluster.
 */
class Clustering {
  /** @var array Map where key is vertex ID and value is cluster ID */
  public array $clustering;
  /** @var int Number of mistakes in this clustering */
  public int $mistakes;
  /** @var int Number of clusters */
  public int $clusterCount;

  public function __construct(array $clustering, int $mistakes, int $clusterCount) {
    $this->clustering = $clustering;
    $this->mistakes = $mistakes;
    $this->clusterCount = $clusterCount;
  }
}

/**
 * Correlation clustering implementation for signed graphs.
 * This algorithm partitions vertices into clusters to minimize the disagreement
 * between cluster assignments and edge signs.
 */
class CorrelationClustering {
  private array $vertices;
  private array $positiveEdges; // Use array keys for fast lookup
  private array $negativeEdges;

  /**
   * Constructs a CorrelationClustering instance.
   * @param array $vertices Array of vertex IDs
   * @param array $positiveEdges Array of positive edge tuples [u, v]
   * @param array $negativeEdges Array of negative edge tuples [u, v]
   */
  public function __construct(array $vertices, array $positiveEdges, array $negativeEdges) {
    $this->vertices = $vertices;
    $this->positiveEdges = [];
    $this->negativeEdges = [];

    foreach ($positiveEdges as $edge) {
      $this->positiveEdges[$this->edgeKey($edge[0], $edge[1])] = true;
    }
    foreach ($negativeEdges as $edge) {
      $this->negativeEdges[$this->edgeKey($edge[0], $edge[1])] = true;
    }
  }

  /**
   * Creates a unique key for an undirected edge.
   */
  private function edgeKey(int $u, int $v): string {
    return $u < $v ? "{$u}-{$v}" : "{$v}-{$u}";
  }

  /**
   * Calculates the number of mistakes in a given clustering.
   * A mistake occurs when:
   * - A positive edge connects vertices in different clusters, OR
   * - A negative edge connects vertices in the same cluster
   * @param array $clustering Map where key is vertex ID and value is cluster ID
   * @return int Number of mistakes
   */
  public function calculateMistakes(array $clustering): int {
    $mistakes = 0;

    // Check positive edges - should be within same cluster
    foreach ($this->positiveEdges as $edgeKey => $value) {
      [$u, $v] = explode('-', $edgeKey);
      $u = (int)$u;
      $v = (int)$v;
      if (($clustering[$u] ?? null) !== ($clustering[$v] ?? null)) {
        $mistakes++;
      }
    }

    // Check negative edges - should be in different clusters
    foreach ($this->negativeEdges as $edgeKey => $value) {
      [$u, $v] = explode('-', $edgeKey);
      $u = (int)$u;
      $v = (int)$v;
      if (($clustering[$u] ?? null) === ($clustering[$v] ?? null)) {
        $mistakes++;
      }
    }

    return $mistakes;
  }

  /**
   * Gets the number of clusters in a clustering.
   */
  private function getClusterCount(array $clustering): int {
    return count(array_unique($clustering));
  }

  /**
   * Creates a deep copy of a clustering array.
   */
  private function cloneClustering(array $clustering): array {
    return $clustering;
  }

  /**
   * Implements a greedy correlation clustering algorithm.
   * This algorithm iteratively tries to merge clusters to reduce mistakes.
   * @return Clustering The best clustering found
   */
  public function greedyCorrelationClustering(): Clustering {
    // Initialize: each vertex in its own cluster
    $clustering = [];
    foreach ($this->vertices as $vertex) {
      $clustering[$vertex] = $vertex;
    }

    $bestClustering = $this->cloneClustering($clustering);
    $minMistakes = $this->calculateMistakes($bestClustering);

    $improved = true;
    $iterations = 0;
    $maxIterations = count($this->vertices) * count($this->vertices); // Prevent infinite loops

    while ($improved && $iterations < $maxIterations) {
      $improved = false;
      $iterations++;

      // Try merging each pair of clusters
      $currentClusters = array_unique($clustering);

      for ($i = 0; $i < count($currentClusters); $i++) {
        for ($j = $i + 1; $j < count($currentClusters); $j++) {
          $clusterA = $currentClusters[$i];
          $clusterB = $currentClusters[$j];

          // Try merging clusterA into clusterB
          $testClustering = $this->cloneClustering($clustering);

          // Move all vertices from clusterA to clusterB
          foreach ($testClustering as $vertex => $cluster) {
            if ($cluster === $clusterA) {
              $testClustering[$vertex] = $clusterB;
            }
          }

          $testMistakes = $this->calculateMistakes($testClustering);

          if ($testMistakes < $minMistakes) {
            $minMistakes = $testMistakes;
            $bestClustering = $this->cloneClustering($testClustering);
            $clustering = $testClustering;
            $improved = true;
          }
        }
      }
    }

    return new Clustering($bestClustering, $minMistakes, $this->getClusterCount($bestClustering));
  }

  /**
   * Implements a simplified greedy correlation clustering.
   * This version tries merging individual vertex clusters.
   * @return Clustering The best clustering found
   */
  public function simpleGreedyClustering(): Clustering {
    // Initialize: each vertex in its own cluster
    $clustering = [];
    foreach ($this->vertices as $vertex) {
      $clustering[$vertex] = $vertex;
    }

    $bestClustering = $this->cloneClustering($clustering);
    $minMistakes = $this->calculateMistakes($bestClustering);

    $changed = true;
    while ($changed) {
      $changed = false;

      foreach ($this->vertices as $u) {
        foreach ($this->vertices as $v) {
          if ($u === $v) continue;

          $uCluster = $clustering[$u] ?? null;
          $vCluster = $clustering[$v] ?? null;

          if ($uCluster === $vCluster) continue; // Already in same cluster

          // Try merging u's cluster into v's cluster
          $testClustering = $this->cloneClustering($clustering);

          // Move u's cluster to v's cluster
          foreach ($testClustering as $vertex => $cluster) {
            if ($cluster === $uCluster) {
              $testClustering[$vertex] = $vCluster;
            }
          }

          $testMistakes = $this->calculateMistakes($testClustering);

          if ($testMistakes < $minMistakes) {
            $minMistakes = $testMistakes;
            $bestClustering = $this->cloneClustering($testClustering);
            // Update current clustering
            $clustering = $testClustering;
            $changed = true;
          }
        }
      }
    }

    return new Clustering($bestClustering, $minMistakes, $this->getClusterCount($bestClustering));
  }

  /**
   * Gets clusters as arrays of vertices.
   * @param array $clustering The clustering result
   * @return array Map where key is cluster ID and value is array of vertices
   */
  public function getClustersAsArrays(array $clustering): array {
    $clusterMap = [];

    foreach ($clustering as $vertex => $clusterId) {
      if (!isset($clusterMap[$clusterId])) {
        $clusterMap[$clusterId] = [];
      }
      $clusterMap[$clusterId][] = $vertex;
    }

    return $clusterMap;
  }

  /**
   * Prints a clustering result in a readable format.
   * @param Clustering $clustering The clustering to print
   */
  public function printClustering(Clustering $clustering): void {
    echo "Clustering Result ({$clustering->clusterCount} clusters, {$clustering->mistakes} mistakes):\n";

    $clusters = $this->getClustersAsArrays($clustering->clustering);

    foreach ($clusters as $clusterId => $vertices) {
      sort($vertices);
      echo "Cluster {$clusterId}: [" . implode(', ', $vertices) . "]\n";
    }
  }

  /**
   * Validates that all vertices are accounted for in the clustering.
   * @param array $clustering The clustering to validate
   * @return bool True if valid, false otherwise
   */
  public function validateClustering(array $clustering): bool {
    $clusteredVertices = array_keys($clustering);
    return empty(array_diff($this->vertices, $clusteredVertices));
  }

  /**
   * Gets statistics about the signed graph.
   */
  public function getGraphStats(): array {
    return [
      'vertexCount' => count($this->vertices),
      'positiveEdgeCount' => count($this->positiveEdges),
      'negativeEdgeCount' => count($this->negativeEdges),
      'totalEdgeCount' => count($this->positiveEdges) + count($this->negativeEdges)
    ];
  }
}

/**
 * A basic implementation of the LP relaxation for Correlation Clustering.
 * Note: Solving general LPs requires an LP solver library. This code provides the *formulation*
 * of the LP, but it does NOT include a solver.  You will need to integrate an external
 * LP solver library (e.g., glpk.js, lp_solve`) to obtain numerical solutions.
 */
class CorrelationClusteringLP {
  private array $positiveEdges;
  private array $negativeEdges;
  private array $vertices;

  /**
   * Constructs a CorrelationClusteringLP instance.
   * @param array $vertices The vertices in the graph.
   * @param array $positiveEdges The positive edges (i, j).
   * @param array $negativeEdges The negative edges (i, j).
   */
  public function __construct(array $vertices, array $positiveEdges, array $negativeEdges) {
    $this->vertices = $vertices;
    $this->positiveEdges = $positiveEdges;
    $this->negativeEdges = $negativeEdges;
  }

  /**
   * Formulates the Correlation Clustering LP. This function *generates* the objective function,
   * constraints, and variable bounds, but it *does not solve it*.  Solving requires
   * an external LP solver.
   * @return array An object containing the objective coefficients, constraint coefficients,
   * right-hand sides, constraint types, and variable bounds, in a format suitable for
   * an LP solver library.  **NOTE: This function does NOT solve the LP.**
   */
  public function formulateLP(): array {
    $numVertices = count($this->vertices);

    // 1. Define Variables
    //   - z_ij for each edge (i, j)
    //   - z_S for each subset S of vertices (This becomes impractical for large graphs)

    // In this simplified implementation, we will NOT enumerate all subsets S.
    // Instead, we will focus on formulating the objective and constraints related to z_ij variables.
    // A full implementation would require generating all possible subsets, which grows exponentially
    // with the number of vertices, making it impractical for larger graphs.

    $objectiveCoefficients = [];
    $constraintCoefficients = [];
    $rhs = [];
    $constraintTypes = [];
    $variableBounds = [];
    $variableNames = [];

    // 2. Objective Function Coefficients
    //    min  ∑_{ij∈E+} z_{ij} + ∑_{ij∈E-} (1 - z_{ij})
    //    which is equivalent to min ∑_{ij∈E+} z_{ij} - ∑_{ij∈E-} z_{ij} + |E-|
    //    Since |E-| is a constant, we can minimize ∑_{ij∈E+} z_{ij} - ∑_{ij∈E-} z_{ij}

    // Create a map to store the index of each z_ij variable
    $edgeVariableIndex = [];
    $variableIndex = 0;

    //Positive Edges
    foreach ($this->positiveEdges as $edge) {
      $objectiveCoefficients[] = 1; // Coefficient for z_ij
      $variableBounds[] = ['min' => 0, 'max' => 1]; // 0 <= z_ij <= 1
      $variableNames[] = "z_{$edge[0]}_{$edge[1]}";
      $edgeVariableIndex["{$edge[0]}_{$edge[1]}"] = $variableIndex++;
    }

    //Negative Edges
    foreach ($this->negativeEdges as $edge) {
      $objectiveCoefficients[] = -1; // Coefficient for z_ij
      $variableBounds[] = ['min' => 0, 'max' => 1]; // 0 <= z_ij <= 1
      $variableNames[] = "z_{$edge[0]}_{$edge[1]}";
      $edgeVariableIndex["{$edge[0]}_{$edge[1]}"] = $variableIndex++;
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
    for ($i = 0; $i < $numVertices; $i++) {
      for ($j = $i + 1; $j < $numVertices; $j++) {
        for ($k = $j + 1; $k < $numVertices; $k++) {
          $vertexI = $this->vertices[$i];
          $vertexJ = $this->vertices[$j];
          $vertexK = $this->vertices[$k];

          // Get the variable indices for the edges (i, j), (i, k), and (j, k)
          $indexIJ = $edgeVariableIndex["{$vertexI}_{$vertexJ}"] ?? $edgeVariableIndex["{$vertexJ}_{$vertexI}"] ?? -1;
          $indexIK = $edgeVariableIndex["{$vertexI}_{$vertexK}"] ?? $edgeVariableIndex["{$vertexK}_{$vertexI}"] ?? -1;
          $indexJK = $edgeVariableIndex["{$vertexJ}_{$vertexK}"] ?? $edgeVariableIndex["{$vertexK}_{$vertexJ}"] ?? -1;

          //If any of the edges do not exist, skip
          if ($indexIJ === -1 || $indexIK === -1 || $indexJK === -1) continue;

          // Constraint 1: z_ij <= z_ik + z_jk  =>  z_ij - z_ik - z_jk <= 0
          $constraint1 = array_fill(0, $variableIndex, 0);
          $constraint1[$indexIJ] = 1;
          $constraint1[$indexIK] = -1;
          $constraint1[$indexJK] = -1;
          $constraintCoefficients[] = $constraint1;
          $rhs[] = 0;
          $constraintTypes[] = "<=";

          // Constraint 2: z_ik <= z_ij + z_jk  =>  -z_ij + z_ik - z_jk <= 0
          $constraint2 = array_fill(0, $variableIndex, 0);
          $constraint2[$indexIJ] = -1;
          $constraint2[$indexIK] = 1;
          $constraint2[$indexJK] = -1;
          $constraintCoefficients[] = $constraint2;
          $rhs[] = 0;
          $constraintTypes[] = "<=";

          // Constraint 3: z_jk <= z_ij + z_ik  =>  -z_ij - z_ik + z_jk <= 0
          $constraint3 = array_fill(0, $variableIndex, 0);
          $constraint3[$indexIJ] = -1;
          $constraint3[$indexIK] = -1;
          $constraint3[$indexJK] = 1;
          $constraintCoefficients[] = $constraint3;
          $rhs[] = 0;
          $constraintTypes[] = "<=";

        }
      }
    }

    return [
      'objectiveCoefficients' => $objectiveCoefficients,
      'constraintCoefficients' => $constraintCoefficients,
      'rhs' => $rhs,
      'constraintTypes' => $constraintTypes,
      'variableBounds' => $variableBounds,
      'variableNames' => $variableNames
    ];
  }

  /**
   * **This is a placeholder for solving the LP.**  You MUST replace this with code that uses
   * an actual LP solver library (e.g., glpk.js, lp_solve). This function currently returns
   * a dummy solution.
   * @param array $lpFormulation The LP formulation generated by `formulateLP()`.
   * @return array A dummy solution. **Replace this with a call to a real LP solver.**
   */
  public function solveLP(array $lpFormulation): array {
    echo "Warning: solveLP() is a placeholder.  You MUST integrate a real LP solver library to use this code.\n";

    $dummySolution = [];
    foreach ($lpFormulation['variableNames'] as $variableName) {
      $dummySolution[$variableName] = 0.5; // Assign a dummy value of 0.5 to all variables
    }
    return $dummySolution;
  }


  /**
   * Interprets the LP solution to produce a clustering. This is a heuristic approach
   * and may not produce an optimal clustering.
   * @param array $lpSolution The LP solution (a map of variable names to values).
   * @return array A clustering represented as a map where the key is the vertex and the value
   * is the cluster ID.
   */
  public function interpretSolution(array $lpSolution): array {
    $clustering = [];
    $clusterId = 0;

    foreach ($this->vertices as $vertex) {
      if (!isset($clustering[$vertex])) {
        // Start a new cluster
        $clustering[$vertex] = $clusterId;

        // Assign other vertices to the same cluster based on z_ij values
        foreach ($this->vertices as $otherVertex) {
          if ($vertex === $otherVertex) continue;

          $variableName = "z_{$vertex}_{$otherVertex}";
          $zValue = $lpSolution[$variableName] ?? $lpSolution["z_{$otherVertex}_{$vertex}"] ?? -1;

          if ($zValue !== -1 && $zValue < 0.5) {
            // If z_ij is close to 0, put otherVertex in the same cluster
            $clustering[$otherVertex] = $clusterId;
          }
        }
        $clusterId++; // Next cluster
      }
    }
    return $clustering;
  }


  /**
   * Prints the clustering result.
   * @param array $clustering A map where key is the vertex and value is the cluster ID.
   */
  public function printClustering(array $clustering): void {
    $clusterMap = [];
    foreach ($clustering as $vertex => $clusterId) {
      if (!isset($clusterMap[$clusterId])) {
        $clusterMap[$clusterId] = [];
      }
      $clusterMap[$clusterId][] = $vertex;
    }

    foreach ($clusterMap as $clusterId => $vertices) {
      echo "Cluster {$clusterId}: " . implode(", ", $vertices) . "\n";
    }
  }
}

?>
