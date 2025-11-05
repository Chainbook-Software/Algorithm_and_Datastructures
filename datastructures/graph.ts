/**
 * Graph data structures and interfaces.
 * Supports directed/undirected graphs, weighted/unweighted edges,
 * and different representations (adjacency list, adjacency matrix).
 */

/**
 * Represents a graph edge with optional weight.
 */
export interface GraphEdge<T = any> {
  /** Source vertex */
  from: T;
  /** Target vertex */
  to: T;
  /** Edge weight (default: 1 for unweighted graphs) */
  weight?: number;
}

/**
 * Represents a vertex in a graph with optional data.
 */
export interface GraphVertex<T = any> {
  /** Unique identifier for the vertex */
  id: T;
  /** Optional data associated with the vertex */
  data?: any;
}

/**
 * Adjacency list representation of a graph.
 * Each key maps to an array of neighboring vertices with their edge weights.
 */
export type AdjacencyList<T> = Map<T, Array<{ vertex: T; weight: number }>>;

/**
 * Adjacency matrix representation of a graph.
 * A 2D array where matrix[i][j] represents the weight of edge from vertex i to j.
 * Use 0 or Infinity for no edge.
 */
export type AdjacencyMatrix = number[][];

/**
 * Generic graph interface supporting different representations.
 */
export interface Graph<T = any> {
  /** Whether the graph is directed */
  readonly isDirected: boolean;
  /** Whether edges have weights */
  readonly isWeighted: boolean;
  /** List of all vertices in the graph */
  readonly vertices: T[];
  /** List of all edges in the graph */
  readonly edges: GraphEdge<T>[];

  /**
   * Add a vertex to the graph.
   * @param vertex The vertex to add
   * @param data Optional data associated with the vertex
   */
  addVertex(vertex: T, data?: any): void;

  /**
   * Remove a vertex and all its edges from the graph.
   * @param vertex The vertex to remove
   */
  removeVertex(vertex: T): void;

  /**
   * Add an edge between two vertices.
   * @param from Source vertex
   * @param to Target vertex
   * @param weight Edge weight (default: 1)
   */
  addEdge(from: T, to: T, weight?: number): void;

  /**
   * Remove an edge between two vertices.
   * @param from Source vertex
   * @param to Target vertex
   */
  removeEdge(from: T, to: T): void;

  /**
   * Check if an edge exists between two vertices.
   * @param from Source vertex
   * @param to Target vertex
   * @returns True if edge exists
   */
  hasEdge(from: T, to: T): boolean;

  /**
   * Get the weight of an edge between two vertices.
   * @param from Source vertex
   * @param to Target vertex
   * @returns Edge weight or undefined if no edge exists
   */
  getEdgeWeight(from: T, to: T): number | undefined;

  /**
   * Get all neighbors of a vertex.
   * @param vertex The vertex
   * @returns Array of neighboring vertices
   */
  getNeighbors(vertex: T): T[];

  /**
   * Get the degree of a vertex (number of edges).
   * For directed graphs, this returns out-degree.
   * @param vertex The vertex
   * @returns Degree of the vertex
   */
  getDegree(vertex: T): number;

  /**
   * Get the in-degree of a vertex (for directed graphs).
   * @param vertex The vertex
   * @returns In-degree of the vertex
   */
  getInDegree?(vertex: T): number;

  /**
   * Get the out-degree of a vertex (for directed graphs).
   * @param vertex The vertex
   * @returns Out-degree of the vertex
   */
  getOutDegree?(vertex: T): number;

  /**
   * Check if the graph contains a vertex.
   * @param vertex The vertex to check
   * @returns True if vertex exists
   */
  hasVertex(vertex: T): boolean;

  /**
   * Get the number of vertices in the graph.
   */
  getVertexCount(): number;

  /**
   * Get the number of edges in the graph.
   */
  getEdgeCount(): number;

  /**
   * Clear all vertices and edges from the graph.
   */
  clear(): void;

  /**
   * Create a copy of the graph.
   * @returns A new graph instance with the same structure
   */
  clone(): Graph<T>;
}

/**
 * Adjacency list implementation of a graph.
 * Efficient for sparse graphs with O(1) edge operations on average.
 */
export class AdjacencyListGraph<T> implements Graph<T> {
  public readonly isDirected: boolean;
  public readonly isWeighted: boolean;
  private adjacencyList: AdjacencyList<T>;
  private vertexData: Map<T, any>;
  private _edges: GraphEdge<T>[];

  constructor(isDirected: boolean = false, isWeighted: boolean = false) {
    this.isDirected = isDirected;
    this.isWeighted = isWeighted;
    this.adjacencyList = new Map<T, Array<{ vertex: T; weight: number }>>();
    this.vertexData = new Map<T, any>();
    this._edges = [];
  }

  get vertices(): T[] {
    return Array.from(this.adjacencyList.keys());
  }

  get edges(): GraphEdge<T>[] {
    return [...this._edges];
  }

  addVertex(vertex: T, data?: any): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
      if (data !== undefined) {
        this.vertexData.set(vertex, data);
      }
    }
  }

  removeVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) return;

    // Remove all edges from this vertex
    this.adjacencyList.delete(vertex);
    this.vertexData.delete(vertex);

    // Remove all edges to this vertex
    for (const [fromVertex, neighbors] of this.adjacencyList) {
      const filteredNeighbors = neighbors.filter(neighbor => neighbor.vertex !== vertex);
      this.adjacencyList.set(fromVertex, filteredNeighbors);
    }

    // Remove from edges array
    this._edges = this._edges.filter(edge => edge.from !== vertex && edge.to !== vertex);

    // For undirected graphs, also remove reverse edges
    if (!this.isDirected) {
      this._edges = this._edges.filter(edge => edge.to !== vertex && edge.from !== vertex);
    }
  }

  addEdge(from: T, to: T, weight: number = 1): void {
    this.addVertex(from);
    this.addVertex(to);

    const neighbors = this.adjacencyList.get(from)!;
    const existingEdgeIndex = neighbors.findIndex(neighbor => neighbor.vertex === to);

    if (existingEdgeIndex >= 0) {
      // Update existing edge weight
      neighbors[existingEdgeIndex].weight = weight;
    } else {
      // Add new edge
      neighbors.push({ vertex: to, weight });
    }

    // Add to edges array
    const existingEdgeIndexInArray = this._edges.findIndex(edge => edge.from === from && edge.to === to);
    if (existingEdgeIndexInArray >= 0) {
      this._edges[existingEdgeIndexInArray].weight = weight;
    } else {
      this._edges.push({ from, to, weight });
    }

    // For undirected graphs, add reverse edge
    if (!this.isDirected) {
      const reverseNeighbors = this.adjacencyList.get(to)!;
      const reverseExistingIndex = reverseNeighbors.findIndex(neighbor => neighbor.vertex === from);

      if (reverseExistingIndex >= 0) {
        reverseNeighbors[reverseExistingIndex].weight = weight;
      } else {
        reverseNeighbors.push({ vertex: from, weight });
      }

      // Add reverse edge to edges array if not already present
      const reverseEdgeIndex = this._edges.findIndex(edge => edge.from === to && edge.to === from);
      if (reverseEdgeIndex === -1) {
        this._edges.push({ from: to, to: from, weight });
      }
    }
  }

  removeEdge(from: T, to: T): void {
    const neighbors = this.adjacencyList.get(from);
    if (neighbors) {
      const filteredNeighbors = neighbors.filter(neighbor => neighbor.vertex !== to);
      this.adjacencyList.set(from, filteredNeighbors);
    }

    // Remove from edges array
    this._edges = this._edges.filter(edge => !(edge.from === from && edge.to === to));

    // For undirected graphs, remove reverse edge
    if (!this.isDirected) {
      const reverseNeighbors = this.adjacencyList.get(to);
      if (reverseNeighbors) {
        const filteredReverseNeighbors = reverseNeighbors.filter(neighbor => neighbor.vertex !== from);
        this.adjacencyList.set(to, filteredReverseNeighbors);
      }

      this._edges = this._edges.filter(edge => !(edge.from === to && edge.to === from));
    }
  }

  hasEdge(from: T, to: T): boolean {
    const neighbors = this.adjacencyList.get(from);
    return neighbors ? neighbors.some(neighbor => neighbor.vertex === to) : false;
  }

  getEdgeWeight(from: T, to: T): number | undefined {
    const neighbors = this.adjacencyList.get(from);
    const edge = neighbors?.find(neighbor => neighbor.vertex === to);
    return edge?.weight;
  }

  getNeighbors(vertex: T): T[] {
    const neighbors = this.adjacencyList.get(vertex);
    return neighbors ? neighbors.map(neighbor => neighbor.vertex) : [];
  }

  getDegree(vertex: T): number {
    if (this.isDirected) {
      return this.getOutDegree!(vertex);
    }
    return this.adjacencyList.get(vertex)?.length || 0;
  }

  getInDegree(vertex: T): number {
    if (!this.isDirected) return this.getDegree(vertex);

    let inDegree = 0;
    for (const [fromVertex, neighbors] of this.adjacencyList) {
      if (neighbors.some(neighbor => neighbor.vertex === vertex)) {
        inDegree++;
      }
    }
    return inDegree;
  }

  getOutDegree(vertex: T): number {
    return this.adjacencyList.get(vertex)?.length || 0;
  }

  hasVertex(vertex: T): boolean {
    return this.adjacencyList.has(vertex);
  }

  getVertexCount(): number {
    return this.adjacencyList.size;
  }

  getEdgeCount(): number {
    return this.isDirected ? this._edges.length : Math.floor(this._edges.length / 2);
  }

  clear(): void {
    this.adjacencyList.clear();
    this.vertexData.clear();
    this._edges = [];
  }

  clone(): Graph<T> {
    const cloned = new AdjacencyListGraph<T>(this.isDirected, this.isWeighted);

    // Clone vertices
    for (const vertex of this.vertices) {
      cloned.addVertex(vertex, this.vertexData.get(vertex));
    }

    // Clone edges
    for (const edge of this._edges) {
      if (this.isDirected || edge.from <= edge.to) { // Avoid duplicating undirected edges
        cloned.addEdge(edge.from, edge.to, edge.weight);
      }
    }

    return cloned;
  }
}

/**
 * Adjacency matrix implementation of a graph.
 * Efficient for dense graphs and constant-time edge queries.
 */
export class AdjacencyMatrixGraph implements Graph<number> {
  public readonly isDirected: boolean;
  public readonly isWeighted: boolean;
  private matrix: AdjacencyMatrix;
  private vertexMap: Map<number, number>; // Maps vertex ID to matrix index
  private reverseVertexMap: Map<number, number>; // Maps matrix index to vertex ID
  private _vertices: number[];
  private nextIndex: number;

  constructor(isDirected: boolean = false, isWeighted: boolean = false) {
    this.isDirected = isDirected;
    this.isWeighted = isWeighted;
    this.matrix = [];
    this.vertexMap = new Map<number, number>();
    this.reverseVertexMap = new Map<number, number>();
    this._vertices = [];
    this.nextIndex = 0;
  }

  get vertices(): number[] {
    return [...this._vertices];
  }

  get edges(): GraphEdge<number>[] {
    const edges: GraphEdge<number>[] = [];
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        const weight = this.matrix[i][j];
        if (weight !== 0 && weight !== Infinity) {
          const fromVertex = this.reverseVertexMap.get(i)!;
          const toVertex = this.reverseVertexMap.get(j)!;
          edges.push({ from: fromVertex, to: toVertex, weight });
        }
      }
    }
    return edges;
  }

  private resizeMatrix(newSize: number): void {
    const currentSize = this.matrix.length;

    // Add new rows
    for (let i = currentSize; i < newSize; i++) {
      this.matrix[i] = new Array(newSize).fill(this.isWeighted ? 0 : Infinity);
    }

    // Add new columns to existing rows
    for (let i = 0; i < currentSize; i++) {
      while (this.matrix[i].length < newSize) {
        this.matrix[i].push(this.isWeighted ? 0 : Infinity);
      }
    }
  }

  addVertex(vertex: number): void {
    if (this.vertexMap.has(vertex)) return;

    this.vertexMap.set(vertex, this.nextIndex);
    this.reverseVertexMap.set(this.nextIndex, vertex);
    this._vertices.push(vertex);

    this.resizeMatrix(this.nextIndex + 1);
    this.nextIndex++;
  }

  removeVertex(vertex: number): void {
    const index = this.vertexMap.get(vertex);
    if (index === undefined) return;

    // Remove from mappings
    this.vertexMap.delete(vertex);
    this.reverseVertexMap.delete(index);
    this._vertices = this._vertices.filter(v => v !== vertex);

    // Rebuild matrix without the removed vertex
    const newMatrix: AdjacencyMatrix = [];
    const newVertexMap = new Map<number, number>();
    const newReverseVertexMap = new Map<number, number>();

    let newIndex = 0;
    for (const v of this._vertices) {
      newVertexMap.set(v, newIndex);
      newReverseVertexMap.set(newIndex, v);
      newIndex++;
    }

    // Create new matrix
    for (let i = 0; i < this._vertices.length; i++) {
      newMatrix[i] = [];
      for (let j = 0; j < this._vertices.length; j++) {
        const oldI = this.vertexMap.get(this._vertices[i])!;
        const oldJ = this.vertexMap.get(this._vertices[j])!;
        newMatrix[i][j] = this.matrix[oldI][oldJ];
      }
    }

    this.matrix = newMatrix;
    this.vertexMap = newVertexMap;
    this.reverseVertexMap = newReverseVertexMap;
    this.nextIndex = this._vertices.length;
  }

  addEdge(from: number, to: number, weight: number = 1): void {
    this.addVertex(from);
    this.addVertex(to);

    const fromIndex = this.vertexMap.get(from)!;
    const toIndex = this.vertexMap.get(to)!;

    this.matrix[fromIndex][toIndex] = weight;

    if (!this.isDirected) {
      this.matrix[toIndex][fromIndex] = weight;
    }
  }

  removeEdge(from: number, to: number): void {
    const fromIndex = this.vertexMap.get(from);
    const toIndex = this.vertexMap.get(to);

    if (fromIndex !== undefined && toIndex !== undefined) {
      this.matrix[fromIndex][toIndex] = this.isWeighted ? 0 : Infinity;

      if (!this.isDirected) {
        this.matrix[toIndex][fromIndex] = this.isWeighted ? 0 : Infinity;
      }
    }
  }

  hasEdge(from: number, to: number): boolean {
    const fromIndex = this.vertexMap.get(from);
    const toIndex = this.vertexMap.get(to);

    if (fromIndex === undefined || toIndex === undefined) return false;

    const weight = this.matrix[fromIndex][toIndex];
    return weight !== 0 && weight !== Infinity;
  }

  getEdgeWeight(from: number, to: number): number | undefined {
    const fromIndex = this.vertexMap.get(from);
    const toIndex = this.vertexMap.get(to);

    if (fromIndex === undefined || toIndex === undefined) return undefined;

    const weight = this.matrix[fromIndex][toIndex];
    return (weight !== 0 && weight !== Infinity) ? weight : undefined;
  }

  getNeighbors(vertex: number): number[] {
    const index = this.vertexMap.get(vertex);
    if (index === undefined) return [];

    const neighbors: number[] = [];
    for (let j = 0; j < this.matrix[index].length; j++) {
      const weight = this.matrix[index][j];
      if (weight !== 0 && weight !== Infinity) {
        neighbors.push(this.reverseVertexMap.get(j)!);
      }
    }
    return neighbors;
  }

  getDegree(vertex: number): number {
    if (this.isDirected) {
      return this.getOutDegree(vertex);
    }
    return this.getNeighbors(vertex).length;
  }

  getInDegree(vertex: number): number {
    if (!this.isDirected) return this.getDegree(vertex);

    const index = this.vertexMap.get(vertex);
    if (index === undefined) return 0;

    let inDegree = 0;
    for (let i = 0; i < this.matrix.length; i++) {
      const weight = this.matrix[i][index];
      if (weight !== 0 && weight !== Infinity) {
        inDegree++;
      }
    }
    return inDegree;
  }

  getOutDegree(vertex: number): number {
    return this.getNeighbors(vertex).length;
  }

  hasVertex(vertex: number): boolean {
    return this.vertexMap.has(vertex);
  }

  getVertexCount(): number {
    return this._vertices.length;
  }

  getEdgeCount(): number {
    let count = 0;
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        const weight = this.matrix[i][j];
        if (weight !== 0 && weight !== Infinity) {
          if (this.isDirected || i <= j) { // Count each undirected edge only once
            count++;
          }
        }
      }
    }
    return count;
  }

  clear(): void {
    this.matrix = [];
    this.vertexMap.clear();
    this.reverseVertexMap.clear();
    this._vertices = [];
    this.nextIndex = 0;
  }

  clone(): Graph<number> {
    const cloned = new AdjacencyMatrixGraph(this.isDirected, this.isWeighted);

    // Clone vertices
    for (const vertex of this._vertices) {
      cloned.addVertex(vertex);
    }

    // Clone matrix
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        const weight = this.matrix[i][j];
        if (weight !== 0 && weight !== Infinity) {
          const fromVertex = this.reverseVertexMap.get(i)!;
          const toVertex = this.reverseVertexMap.get(j)!;
          cloned.addEdge(fromVertex, toVertex, weight);
        }
      }
    }

    return cloned;
  }
}

/**
 * Represents a complete signed graph where edges are either positive (+1) or negative (-1).
 * This is a specialized graph implementation for signed graph theory applications.
 */
export class SignedGraph implements Graph<number> {
  public readonly isDirected: boolean = false; // Signed graphs are typically undirected
  public readonly isWeighted: boolean = true; // Uses +1/-1 weights for signed edges
  private _vertexCount: number;
  private adjMatrix: (1 | -1 | 0)[][]; // 1 for positive edge, -1 for negative edge, 0 for no edge

  /**
   * Constructs a complete signed graph with the given number of vertices.
   * @param vertices The number of vertices in the graph.
   * @param randomizeEdges If true, randomly assigns positive/negative edges. If false, initializes with positive edges.
   */
  constructor(vertices: number, randomizeEdges: boolean = true) {
    this._vertexCount = vertices;
    this.adjMatrix = Array(vertices)
      .fill(null)
      .map(() => Array(vertices).fill(0));

    // Create a complete graph with positive and negative edges
    for (let i = 0; i < vertices; i++) {
      for (let j = i + 1; j < vertices; j++) {
        // Assign either 1 or -1
        const sign = randomizeEdges ? (Math.random() < 0.5 ? 1 : -1) : 1;
        this.adjMatrix[i][j] = sign;
        this.adjMatrix[j][i] = sign; // Ensure symmetry for undirected graph
      }
    }
  }

  get vertices(): number[] {
    return Array.from({ length: this._vertexCount }, (_, i) => i);
  }

  get edges(): GraphEdge<number>[] {
    const edges: GraphEdge<number>[] = [];
    for (let i = 0; i < this._vertexCount; i++) {
      for (let j = i + 1; j < this._vertexCount; j++) {
        const weight = this.adjMatrix[i][j];
        if (weight !== 0) {
          edges.push({ from: i, to: j, weight });
        }
      }
    }
    return edges;
  }

  /**
   * Checks if the graph is complete (every pair of vertices has an edge).
   * @returns True if the graph is complete, false otherwise.
   */
  isComplete(): boolean {
    for (let i = 0; i < this._vertexCount; i++) {
      for (let j = i + 1; j < this._vertexCount; j++) {
        if (this.adjMatrix[i][j] === 0) {
          return false; // If any edge is missing, the graph is not complete
        }
      }
    }
    return true;
  }

  /**
   * Gets the sign of an edge between two vertices.
   * @param from Source vertex
   * @param to Target vertex
   * @returns 1 for positive edge, -1 for negative edge, 0 for no edge
   */
  getEdgeSign(from: number, to: number): 1 | -1 | 0 {
    if (from < 0 || from >= this._vertexCount || to < 0 || to >= this._vertexCount) {
      return 0;
    }
    return this.adjMatrix[from][to];
  }

  /**
   * Flips the sign of an edge between two vertices.
   * @param from Source vertex
   * @param to Target vertex
   */
  flipEdgeSign(from: number, to: number): void {
    if (from < 0 || from >= this._vertexCount || to < 0 || to >= this._vertexCount) {
      throw new Error("Invalid vertex indices");
    }
    if (from === to) {
      throw new Error("Cannot flip self-loop");
    }

    const currentSign = this.getEdgeSign(from, to);
    if (currentSign === 0) {
      throw new Error("Cannot flip non-existent edge");
    }

    const newSign = currentSign === 1 ? -1 : 1;
    this.adjMatrix[from][to] = newSign;
    this.adjMatrix[to][from] = newSign; // Maintain symmetry
  }

  /**
   * Counts the number of positive edges in the graph.
   * @returns Number of positive edges
   */
  countPositiveEdges(): number {
    let count = 0;
    for (let i = 0; i < this._vertexCount; i++) {
      for (let j = i + 1; j < this._vertexCount; j++) {
        if (this.adjMatrix[i][j] === 1) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Counts the number of negative edges in the graph.
   * @returns Number of negative edges
   */
  countNegativeEdges(): number {
    let count = 0;
    for (let i = 0; i < this._vertexCount; i++) {
      for (let j = i + 1; j < this._vertexCount; j++) {
        if (this.adjMatrix[i][j] === -1) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Prints the adjacency matrix of the graph.
   */
  printGraph(): void {
    console.log("Signed Graph Adjacency Matrix:");
    for (let i = 0; i < this._vertexCount; i++) {
      console.log(this.adjMatrix[i].map(val => val.toString().padStart(2)).join(" "));
    }
  }

  // Graph interface implementation

  addVertex(vertex: number): void {
    throw new Error("SignedGraph is always complete - cannot add individual vertices");
  }

  removeVertex(vertex: number): void {
    throw new Error("SignedGraph is always complete - cannot remove individual vertices");
  }

  addEdge(from: number, to: number, weight?: number): void {
    if (weight !== 1 && weight !== -1) {
      throw new Error("SignedGraph edges must have weight 1 (positive) or -1 (negative)");
    }
    if (from === to) {
      throw new Error("Self-loops are not allowed in signed graphs");
    }
    if (from < 0 || from >= this._vertexCount || to < 0 || to >= this._vertexCount) {
      throw new Error("Invalid vertex indices");
    }

    const sign = weight || 1;
    this.adjMatrix[from][to] = sign;
    this.adjMatrix[to][from] = sign;
  }

  removeEdge(from: number, to: number): void {
    throw new Error("SignedGraph is always complete - cannot remove edges");
  }

  hasEdge(from: number, to: number): boolean {
    if (from < 0 || from >= this._vertexCount || to < 0 || to >= this._vertexCount) {
      return false;
    }
    return this.adjMatrix[from][to] !== 0;
  }

  getEdgeWeight(from: number, to: number): number | undefined {
    const sign = this.getEdgeSign(from, to);
    return sign === 0 ? undefined : sign;
  }

  getNeighbors(vertex: number): number[] {
    if (vertex < 0 || vertex >= this._vertexCount) {
      return [];
    }
    const neighbors: number[] = [];
    for (let i = 0; i < this._vertexCount; i++) {
      if (i !== vertex && this.adjMatrix[vertex][i] !== 0) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }

  getDegree(vertex: number): number {
    return this.getNeighbors(vertex).length;
  }

  getInDegree(vertex: number): number {
    // For undirected graphs, in-degree equals degree
    return this.getDegree(vertex);
  }

  getOutDegree(vertex: number): number {
    // For undirected graphs, out-degree equals degree
    return this.getDegree(vertex);
  }

  hasVertex(vertex: number): boolean {
    return vertex >= 0 && vertex < this._vertexCount;
  }

  getVertexCount(): number {
    return this._vertexCount;
  }

  getEdgeCount(): number {
    return (this._vertexCount * (this._vertexCount - 1)) / 2; // Always complete
  }

  clear(): void {
    throw new Error("SignedGraph is always complete - cannot clear");
  }

  clone(): Graph<number> {
    const cloned = new SignedGraph(this._vertexCount, false); // Start with positive edges

    // Copy the exact edge signs
    for (let i = 0; i < this._vertexCount; i++) {
      for (let j = i + 1; j < this._vertexCount; j++) {
        const sign = this.adjMatrix[i][j];
        cloned.adjMatrix[i][j] = sign;
        cloned.adjMatrix[j][i] = sign;
      }
    }

    return cloned;
  }
}
