"""
Correlation clustering algorithms for signed graphs.
Correlation clustering aims to partition vertices into clusters that minimize
the number of disagreements with the edge signs.
"""

from typing import List, Dict, Tuple, Any
from dataclasses import dataclass

@dataclass
class Clustering:
  """Represents a clustering result where each vertex is assigned to a cluster."""
  clustering: Dict[int, int]  # Map where key is vertex ID and value is cluster ID
  mistakes: int  # Number of mistakes in this clustering
  cluster_count: int  # Number of clusters

class CorrelationClustering:
  """Correlation clustering implementation for signed graphs.
  This algorithm partitions vertices into clusters to minimize the disagreement
  between cluster assignments and edge signs.
  """

  def __init__(self, vertices: List[int], positive_edges: List[Tuple[int, int]], negative_edges: List[Tuple[int, int]]):
    """Constructs a CorrelationClustering instance.

    Args:
      vertices: Array of vertex IDs
      positive_edges: Array of positive edge tuples [u, v]
      negative_edges: Array of negative edge tuples [u, v]
    """
    self.vertices = vertices
    self.positive_edges = set(self._edge_key(u, v) for u, v in positive_edges)
    self.negative_edges = set(self._edge_key(u, v) for u, v in negative_edges)

  def _edge_key(self, u: int, v: int) -> str:
    """Creates a unique key for an undirected edge."""
    return f"{min(u, v)}-{max(u, v)}"

  def calculate_mistakes(self, clustering: Dict[int, int]) -> int:
    """Calculates the number of mistakes in a given clustering.
    A mistake occurs when:
    - A positive edge connects vertices in different clusters, OR
    - A negative edge connects vertices in the same cluster

    Args:
      clustering: Map where key is vertex ID and value is cluster ID

    Returns:
      Number of mistakes
    """
    mistakes = 0

    # Check positive edges - should be within same cluster
    for edge_key in self.positive_edges:
      u, v = map(int, edge_key.split('-'))
      if clustering.get(u) != clustering.get(v):
        mistakes += 1

    # Check negative edges - should be in different clusters
    for edge_key in self.negative_edges:
      u, v = map(int, edge_key.split('-'))
      if clustering.get(u) == clustering.get(v):
        mistakes += 1

    return mistakes

  def _get_cluster_count(self, clustering: Dict[int, int]) -> int:
    """Gets the number of clusters in a clustering."""
    return len(set(clustering.values()))

  def _clone_clustering(self, clustering: Dict[int, int]) -> Dict[int, int]:
    """Creates a deep copy of a clustering dict."""
    return clustering.copy()

  def greedy_correlation_clustering(self) -> Clustering:
    """Implements a greedy correlation clustering algorithm.
    This algorithm iteratively tries to merge clusters to reduce mistakes.

    Returns:
      The best clustering found
    """
    # Initialize: each vertex in its own cluster
    clustering = {vertex: vertex for vertex in self.vertices}

    best_clustering = self._clone_clustering(clustering)
    min_mistakes = self.calculate_mistakes(best_clustering)

    improved = True
    iterations = 0
    max_iterations = len(self.vertices) * len(self.vertices)  # Prevent infinite loops

    while improved and iterations < max_iterations:
      improved = False
      iterations += 1

      # Try merging each pair of clusters
      current_clusters = list(set(clustering.values()))

      for i in range(len(current_clusters)):
        for j in range(i + 1, len(current_clusters)):
          cluster_a = current_clusters[i]
          cluster_b = current_clusters[j]

          # Try merging clusterA into clusterB
          test_clustering = self._clone_clustering(clustering)

          # Move all vertices from clusterA to clusterB
          for vertex, cluster in test_clustering.items():
            if cluster == cluster_a:
              test_clustering[vertex] = cluster_b

          test_mistakes = self.calculate_mistakes(test_clustering)

          if test_mistakes < min_mistakes:
            min_mistakes = test_mistakes
            best_clustering = self._clone_clustering(test_clustering)
            clustering = test_clustering
            improved = True

    return Clustering(best_clustering, min_mistakes, self._get_cluster_count(best_clustering))

  def simple_greedy_clustering(self) -> Clustering:
    """Implements a simplified greedy correlation clustering.
    This version tries merging individual vertex clusters.

    Returns:
      The best clustering found
    """
    # Initialize: each vertex in its own cluster
    clustering = {vertex: vertex for vertex in self.vertices}

    best_clustering = self._clone_clustering(clustering)
    min_mistakes = self.calculate_mistakes(best_clustering)

    changed = True
    while changed:
      changed = False

      for u in self.vertices:
        for v in self.vertices:
          if u == v:
            continue

          u_cluster = clustering.get(u)
          v_cluster = clustering.get(v)

          if u_cluster == v_cluster:
            continue  # Already in same cluster

          # Try merging u's cluster into v's cluster
          test_clustering = self._clone_clustering(clustering)

          # Move u's cluster to v's cluster
          for vertex, cluster in test_clustering.items():
            if cluster == u_cluster:
              test_clustering[vertex] = v_cluster

          test_mistakes = self.calculate_mistakes(test_clustering)

          if test_mistakes < min_mistakes:
            min_mistakes = test_mistakes
            best_clustering = self._clone_clustering(test_clustering)
            # Update current clustering
            clustering = test_clustering
            changed = True

    return Clustering(best_clustering, min_mistakes, self._get_cluster_count(best_clustering))

  def get_clusters_as_arrays(self, clustering: Dict[int, int]) -> Dict[int, List[int]]:
    """Gets clusters as arrays of vertices.

    Args:
      clustering: The clustering result

    Returns:
      Map where key is cluster ID and value is array of vertices
    """
    cluster_map: Dict[int, List[int]] = {}

    for vertex, cluster_id in clustering.items():
      if cluster_id not in cluster_map:
        cluster_map[cluster_id] = []
      cluster_map[cluster_id].append(vertex)

    return cluster_map

  def print_clustering(self, clustering: Clustering) -> None:
    """Prints a clustering result in a readable format.

    Args:
      clustering: The clustering to print
    """
    print(f"Clustering Result ({clustering.cluster_count} clusters, {clustering.mistakes} mistakes):")

    clusters = self.get_clusters_as_arrays(clustering.clustering)

    for cluster_id, vertices in clusters.items():
      print(f"Cluster {cluster_id}: [{', '.join(map(str, sorted(vertices)))}]")

  def validate_clustering(self, clustering: Dict[int, int]) -> bool:
    """Validates that all vertices are accounted for in the clustering.

    Args:
      clustering: The clustering to validate

    Returns:
      True if valid, false otherwise
    """
    clustered_vertices = set(clustering.keys())
    return set(self.vertices) == clustered_vertices

  def get_graph_stats(self) -> Dict[str, int]:
    """Gets statistics about the signed graph."""
    return {
      'vertex_count': len(self.vertices),
      'positive_edge_count': len(self.positive_edges),
      'negative_edge_count': len(self.negative_edges),
      'total_edge_count': len(self.positive_edges) + len(self.negative_edges)
    }

class CorrelationClusteringLP:
  """A basic implementation of the LP relaxation for Correlation Clustering.
  Note: Solving general LPs requires an LP solver library. This code provides the *formulation*
  of the LP, but it does NOT include a solver.  You will need to integrate an external
  LP solver library (e.g., glpk.js, lp_solve`) to obtain numerical solutions.
  """

  def __init__(self, vertices: List[int], positive_edges: List[Tuple[int, int]], negative_edges: List[Tuple[int, int]]):
    """Constructs a CorrelationClusteringLP instance.

    Args:
      vertices: The vertices in the graph.
      positive_edges: The positive edges (i, j).
      negative_edges: The negative edges (i, j).
    """
    self.vertices = vertices
    self.positive_edges = positive_edges
    self.negative_edges = negative_edges

  def formulate_lp(self) -> Dict[str, Any]:
    """Formulates the Correlation Clustering LP. This function *generates* the objective function,
    constraints, and variable bounds, but it *does not solve it*.  Solving requires
    an external LP solver.

    Returns:
      An object containing the objective coefficients, constraint coefficients,
      right-hand sides, constraint types, and variable bounds, in a format suitable for
      an LP solver library.  **NOTE: This function does NOT solve the LP.**
    """
    num_vertices = len(self.vertices)

    # 1. Define Variables
    #   - z_ij for each edge (i, j)
    #   - z_S for each subset S of vertices (This becomes impractical for large graphs)

    # In this simplified implementation, we will NOT enumerate all subsets S.
    # Instead, we will focus on formulating the objective and constraints related to z_ij variables.
    # A full implementation would require generating all possible subsets, which grows exponentially
    # with the number of vertices, making it impractical for larger graphs.

    objective_coefficients = []
    constraint_coefficients = []
    rhs = []
    constraint_types = []
    variable_bounds = []
    variable_names = []

    # 2. Objective Function Coefficients
    #    min  ∑_{ij∈E+} z_{ij} + ∑_{ij∈E-} (1 - z_{ij})
    #    which is equivalent to min ∑_{ij∈E+} z_{ij} - ∑_{ij∈E-} z_{ij} + |E-|
    #    Since |E-| is a constant, we can minimize ∑_{ij∈E+} z_{ij} - ∑_{ij∈E-} z_{ij}

    # Create a map to store the index of each z_ij variable
    edge_variable_index = {}
    variable_index = 0

    # Positive Edges
    for u, v in self.positive_edges:
      objective_coefficients.append(1)  # Coefficient for z_ij
      variable_bounds.append({'min': 0, 'max': 1})  # 0 <= z_ij <= 1
      variable_names.append(f"z_{u}_{v}")
      edge_variable_index[f"{u}_{v}"] = variable_index
      variable_index += 1

    # Negative Edges
    for u, v in self.negative_edges:
      objective_coefficients.append(-1)  # Coefficient for z_ij
      variable_bounds.append({'min': 0, 'max': 1})  # 0 <= z_ij <= 1
      variable_names.append(f"z_{u}_{v}")
      edge_variable_index[f"{u}_{v}"] = variable_index
      variable_index += 1

    # 3. Constraints (Simplified - Without Explicit Subset Enumeration)
    #    The core difficulty here is representing the constraints involving z_S variables
    #    without explicitly enumerating all subsets.

    # Example: Triangle Inequality Constraints (Relaxation)
    # For any three vertices i, j, k:
    # z_ij <= z_ik + z_jk
    # z_ik <= z_ij + z_jk
    # z_jk <= z_ij + z_ik
    # These constraints are a common relaxation used in practice.

    # Iterate through all triplets of vertices
    for i in range(num_vertices):
      for j in range(i + 1, num_vertices):
        for k in range(j + 1, num_vertices):
          vertex_i = self.vertices[i]
          vertex_j = self.vertices[j]
          vertex_k = self.vertices[k]

          # Get the variable indices for the edges (i, j), (i, k), and (j, k)
          index_ij = edge_variable_index.get(f"{vertex_i}_{vertex_j}") or edge_variable_index.get(f"{vertex_j}_{vertex_i}", -1)
          index_ik = edge_variable_index.get(f"{vertex_i}_{vertex_k}") or edge_variable_index.get(f"{vertex_k}_{vertex_i}", -1)
          index_jk = edge_variable_index.get(f"{vertex_j}_{vertex_k}") or edge_variable_index.get(f"{vertex_k}_{vertex_j}", -1)

          # If any of the edges do not exist, skip
          if index_ij == -1 or index_ik == -1 or index_jk == -1:
            continue

          # Constraint 1: z_ij <= z_ik + z_jk  =>  z_ij - z_ik - z_jk <= 0
          constraint1 = [0] * variable_index
          constraint1[index_ij] = 1
          constraint1[index_ik] = -1
          constraint1[index_jk] = -1
          constraint_coefficients.append(constraint1)
          rhs.append(0)
          constraint_types.append("<=")

          # Constraint 2: z_ik <= z_ij + z_jk  =>  -z_ij + z_ik - z_jk <= 0
          constraint2 = [0] * variable_index
          constraint2[index_ij] = -1
          constraint2[index_ik] = 1
          constraint2[index_jk] = -1
          constraint_coefficients.append(constraint2)
          rhs.append(0)
          constraint_types.append("<=")

          # Constraint 3: z_jk <= z_ij + z_ik  =>  -z_ij - z_ik + z_jk <= 0
          constraint3 = [0] * variable_index
          constraint3[index_ij] = -1
          constraint3[index_ik] = -1
          constraint3[index_jk] = 1
          constraint_coefficients.append(constraint3)
          rhs.append(0)
          constraint_types.append("<=")

    return {
      'objective_coefficients': objective_coefficients,
      'constraint_coefficients': constraint_coefficients,
      'rhs': rhs,
      'constraint_types': constraint_types,
      'variable_bounds': variable_bounds,
      'variable_names': variable_names
    }

  def solve_lp(self, lp_formulation: Dict[str, Any]) -> Dict[str, float]:
    """**This is a placeholder for solving the LP.**  You MUST replace this with code that uses
    an actual LP solver library (e.g., glpk.js, lp_solve). This function currently returns
    a dummy solution.

    Args:
      lp_formulation: The LP formulation generated by `formulate_lp()`.

    Returns:
      A dummy solution. **Replace this with a call to a real LP solver.**
    """
    print("Warning: solve_lp() is a placeholder.  You MUST integrate a real LP solver library to use this code.")

    dummy_solution = {}
    for variable_name in lp_formulation['variable_names']:
      dummy_solution[variable_name] = 0.5  # Assign a dummy value of 0.5 to all variables
    return dummy_solution

  def interpret_solution(self, lp_solution: Dict[str, float]) -> Dict[int, int]:
    """Interprets the LP solution to produce a clustering. This is a heuristic approach
    and may not produce an optimal clustering.

    Args:
      lp_solution: The LP solution (a map of variable names to values).

    Returns:
      A clustering represented as a map where the key is the vertex and the value is the cluster ID.
    """
    clustering = {}
    cluster_id = 0

    for vertex in self.vertices:
      if vertex not in clustering:
        # Start a new cluster
        clustering[vertex] = cluster_id

        # Assign other vertices to the same cluster based on z_ij values
        for other_vertex in self.vertices:
          if vertex == other_vertex:
            continue

          variable_name = f"z_{vertex}_{other_vertex}"
          z_value = lp_solution.get(variable_name, lp_solution.get(f"z_{other_vertex}_{vertex}", -1))

          if z_value != -1 and z_value < 0.5:
            # If z_ij is close to 0, put otherVertex in the same cluster
            clustering[other_vertex] = cluster_id
        cluster_id += 1  # Next cluster

    return clustering

  def print_clustering(self, clustering: Dict[int, int]) -> None:
    """Prints the clustering result.

    Args:
      clustering: A map where key is the vertex and value is the cluster ID.
    """
    cluster_map = {}
    for vertex, cluster_id in clustering.items():
      if cluster_id not in cluster_map:
        cluster_map[cluster_id] = []
      cluster_map[cluster_id].append(vertex)

    for cluster_id, vertices in cluster_map.items():
      print(f"Cluster {cluster_id}: {', '.join(map(str, vertices))}")
