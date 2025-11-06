# Chapter 8: Advanced Algorithms - Approximation, State Machines, and Streaming

## 🎯 Learning Objectives

By the end of this chapter, you will understand:
- **Approximation Algorithms**: Solving complex problems with near-optimal solutions
- **State Machines**: Modeling system behavior and processing sequences
- **Streaming Algorithms**: Processing large data streams efficiently
- **Real-World Applications**: How these algorithms solve practical problems

## 📊 Approximation Algorithms

### What are Approximation Algorithms?

Approximation algorithms find near-optimal solutions to optimization problems that are difficult or impossible to solve exactly in reasonable time. They provide guaranteed quality bounds on the solution.

### Key Concepts

- **Approximation Ratio**: How close the solution is to optimal
- **Polynomial Time**: Algorithms that run in reasonable time
- **NP-Hard Problems**: Problems where exact solutions are computationally expensive

### Example: Multiplicative Approximation

```typescript
/**
 * Checks if a value is within a multiplicative approximation factor
 */
function isMultiplicativeApproximation(
  epsilon: number,
  optimalValue: number,
  approximateValue: number
): boolean {
  // Allow solutions within (1+ε) of optimal
  const lowerBound = optimalValue / (1 + epsilon);
  const upperBound = optimalValue * (1 + epsilon);

  return approximateValue >= lowerBound && approximateValue <= upperBound;
}

/**
 * Two-sided multiplicative approximation check
 */
function isMultiplicativeApproximationTwoSided(
  epsilon: number,
  targetValue: number,
  testValue: number
): boolean {
  const ratio = Math.max(testValue / targetValue, targetValue / testValue);
  return ratio <= (1 + epsilon);
}
```

### Real-World Application: Revenue Management

```typescript
// Dynamic pricing with approximation guarantees
function optimizeHotelPricing(
  baseRate: number,
  demandMultiplier: number,
  competitorRates: number[]
): number {
  const adjustedRate = baseRate * demandMultiplier;
  const averageCompetitorRate = competitorRates.reduce((sum, rate) => sum + rate, 0) / competitorRates.length;

  // Ensure pricing is competitive (within 10% of market)
  if (isMultiplicativeApproximationTwoSided(0.1, averageCompetitorRate, adjustedRate)) {
    return adjustedRate;
  }

  // Fallback to market rate
  return averageCompetitorRate;
}
```

## 🤖 State Machines

### What are State Machines?

State machines are mathematical models of computation that can be in exactly one of a finite number of states at any given time. They process inputs and transition between states according to defined rules.

### Types of State Machines

1. **Finite State Machines (FSM)**: Basic state machines with finite states
2. **Deterministic Finite Automata (DFA)**: Each state has exactly one transition for each input
3. **Turing Machines**: Theoretical computing machines with infinite tape

### Example: Palindrome Recognizer

```typescript
class PalindromeRecognizer {
  private state: string = 'start';
  private stack: string[] = [];

  process(input: string): boolean {
    for (const char of input.toLowerCase()) {
      if (char >= 'a' && char <= 'z') {
        this.transition(char);
      }
    }

    // Check if we're in an accepting state
    return this.state === 'accept' && this.stack.length === 0;
  }

  private transition(char: string): void {
    switch (this.state) {
      case 'start':
        this.stack.push(char);
        this.state = 'reading';
        break;

      case 'reading':
        if (this.stack.length > 0 && this.stack[this.stack.length - 1] === char) {
          this.stack.pop();
          if (this.stack.length === 0) {
            this.state = 'accept';
          }
        } else {
          this.stack.push(char);
        }
        break;

      case 'accept':
        // Already accepted, but more characters? Not a palindrome
        this.state = 'reject';
        break;
    }
  }
}

// Usage
const recognizer = new PalindromeRecognizer();
console.log(recognizer.process("racecar")); // true
console.log(recognizer.process("hello"));   // false
```

### Real-World Application: Lexical Analysis

```typescript
class LexicalAnalyzer {
  private state: string = 'start';
  private tokens: string[] = [];
  private currentToken = '';

  analyze(input: string): string[] {
    for (const char of input) {
      this.transition(char);
    }

    // Handle end of input
    this.transition(' ');

    return this.tokens;
  }

  private transition(char: string): void {
    switch (this.state) {
      case 'start':
        if (this.isLetter(char)) {
          this.currentToken = char;
          this.state = 'identifier';
        } else if (this.isDigit(char)) {
          this.currentToken = char;
          this.state = 'number';
        } else if (char === ' ') {
          // Skip whitespace
        } else {
          this.addToken(char);
        }
        break;

      case 'identifier':
        if (this.isLetter(char) || this.isDigit(char)) {
          this.currentToken += char;
        } else {
          this.addToken(this.currentToken);
          this.currentToken = '';
          this.state = 'start';
          this.transition(char); // Reprocess current character
        }
        break;

      case 'number':
        if (this.isDigit(char)) {
          this.currentToken += char;
        } else {
          this.addToken(this.currentToken);
          this.currentToken = '';
          this.state = 'start';
          this.transition(char);
        }
        break;
    }
  }

  private addToken(token: string): void {
    if (token.trim()) {
      this.tokens.push(token);
    }
  }

  private isLetter(char: string): boolean {
    return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z';
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }
}
```

## 🌊 Streaming Algorithms

### What are Streaming Algorithms?

Streaming algorithms process data that arrives continuously, using limited memory. They make one pass through the data and provide approximate answers to queries.

### Key Characteristics

- **Single Pass**: Process each data item only once
- **Limited Memory**: Use space much smaller than input size
- **Approximate Results**: Provide probabilistic guarantees
- **Real-time Processing**: Handle continuous data streams

### Example: Frequency Estimation

```typescript
interface StreamUpdate {
  itemIndex: number;
  delta: number;
}

/**
 * Oblivious streaming algorithm for frequency estimation
 */
function obliviousStreamingAlgorithm(
  updateFunction: (updates: StreamUpdate[]) => number,
  epsilon: number,
  delta: number,
  timeHorizon: number,
  updates: StreamUpdate[]
): number {
  // This is a simplified version of streaming algorithms
  // In practice, these use sophisticated techniques like Count-Min Sketch

  let currentEstimate = 0;
  const processedItems = new Set<number>();

  for (const update of updates) {
    if (!processedItems.has(update.itemIndex)) {
      processedItems.add(update.itemIndex);
      currentEstimate += update.delta;
    }
  }

  // Apply approximation bounds
  const approximationFactor = Math.max(1, Math.log(timeHorizon) / Math.log(1 + epsilon));

  return Math.round(currentEstimate / approximationFactor);
}
```

### Real-World Application: Real-time Analytics

```typescript
class RealTimeAnalytics {
  private frequencyMap = new Map<string, number>();
  private totalCount = 0;
  private sampleSize = 1000;

  processEvent(eventType: string): void {
    this.totalCount++;

    // Reservoir sampling for frequent items
    if (this.frequencyMap.has(eventType)) {
      this.frequencyMap.set(eventType, this.frequencyMap.get(eventType)! + 1);
    } else if (this.frequencyMap.size < this.sampleSize) {
      this.frequencyMap.set(eventType, 1);
    } else {
      // Replace random item with small probability
      if (Math.random() < this.sampleSize / this.totalCount) {
        const items = Array.from(this.frequencyMap.keys());
        const randomIndex = Math.floor(Math.random() * items.length);
        const itemToRemove = items[randomIndex];
        this.frequencyMap.delete(itemToRemove);
        this.frequencyMap.set(eventType, 1);
      }
    }
  }

  getTopEvents(limit: number = 10): Array<{ event: string; count: number }> {
    return Array.from(this.frequencyMap.entries())
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getTotalEvents(): number {
    return this.totalCount;
  }
}
```

## 🔗 Correlation Clustering

### What is Correlation Clustering?

Correlation clustering is a method for partitioning a set of objects into clusters based on pairwise similarities or dissimilarities. It's particularly useful for community detection and data segmentation.

### Example Implementation

```typescript
interface Clustering {
  clusterCount: number;
  mistakes: number;
}

class CorrelationClustering {
  constructor(
    private vertices: number[],
    private positiveEdges: [number, number][],
    private negativeEdges: [number, number][]
  ) {}

  greedyCorrelationClustering(): Clustering {
    const clusters: number[][] = [];
    const vertexToCluster = new Map<number, number>();

    for (const vertex of this.vertices) {
      // Try to add to existing cluster
      let added = false;

      for (let i = 0; i < clusters.length; i++) {
        if (this.canAddToCluster(vertex, clusters[i])) {
          clusters[i].push(vertex);
          vertexToCluster.set(vertex, i);
          added = true;
          break;
        }
      }

      // Create new cluster if couldn't add to existing
      if (!added) {
        clusters.push([vertex]);
        vertexToCluster.set(vertex, clusters.length - 1);
      }
    }

    // Calculate mistakes (violated constraints)
    let mistakes = 0;
    for (const [u, v] of this.positiveEdges) {
      if (vertexToCluster.get(u) !== vertexToCluster.get(v)) {
        mistakes++;
      }
    }

    for (const [u, v] of this.negativeEdges) {
      if (vertexToCluster.get(u) === vertexToCluster.get(v)) {
        mistakes++;
      }
    }

    return {
      clusterCount: clusters.length,
      mistakes
    };
  }

  private canAddToCluster(vertex: number, cluster: number[]): boolean {
    for (const existingVertex of cluster) {
      // Check if there's a negative edge (dissimilarity)
      const hasNegativeEdge = this.negativeEdges.some(
        ([u, v]) => (u === vertex && v === existingVertex) ||
                   (u === existingVertex && v === vertex)
      );

      if (hasNegativeEdge) {
        return false;
      }
    }
    return true;
  }
}
```

## 🏨 Real-World Application: Hotel Management System

### Integrating All Concepts

```typescript
class AdvancedHotelManagementSystem {
  private roomAvailability = new Map<string, boolean>();
  private pricingEngine = new ApproximationPricingEngine();
  private guestProfiler = new StateMachineGuestProfiler();
  private analyticsEngine = new StreamingAnalyticsProcessor();

  // Room booking with approximation algorithms
  bookRoomOptimally(guestPreferences: GuestPreference[]): BookingResult {
    // Use approximation algorithms to find best room match
    const optimalRoom = this.pricingEngine.findOptimalRoom(guestPreferences);

    // Update availability using streaming algorithms
    this.analyticsEngine.updateRoomAvailability(optimalRoom.id, false);

    return {
      roomId: optimalRoom.id,
      price: optimalRoom.price,
      confidence: optimalRoom.confidence // Approximation guarantee
    };
  }

  // Guest service personalization with state machines
  processGuestRequest(request: GuestRequest): ServiceResponse {
    const guestState = this.guestProfiler.getGuestState(request.guestId);

    // Use state machine to determine appropriate response
    const response = this.guestProfiler.processRequest(guestState, request);

    // Update analytics
    this.analyticsEngine.processServiceRequest(request);

    return response;
  }

  // Dynamic pricing with correlation clustering
  optimizePricing(seasonalData: SeasonalData[]): PricingStrategy {
    // Cluster similar time periods
    const clusters = this.analyzeSeasonalPatterns(seasonalData);

    // Generate pricing strategy based on clusters
    return this.generatePricingStrategy(clusters);
  }

  private analyzeSeasonalPatterns(data: SeasonalData[]): ClusteringResult {
    // Use correlation clustering to group similar demand patterns
    const clustering = new CorrelationClustering(
      data.map(d => d.period),
      this.findPositiveCorrelations(data),
      this.findNegativeCorrelations(data)
    );

    return clustering.greedyCorrelationClustering();
  }
}

// Supporting classes (simplified)
class ApproximationPricingEngine {
  findOptimalRoom(preferences: GuestPreference[]) {
    // Implementation using approximation algorithms
    return { id: "101", price: 250, confidence: 0.95 };
  }
}

class StateMachineGuestProfiler {
  getGuestState(guestId: string) { return "vip"; }
  processRequest(state: string, request: GuestRequest) {
    return { action: "upgrade_room", priority: "high" };
  }
}

class StreamingAnalyticsProcessor {
  updateRoomAvailability(roomId: string, available: boolean) {}
  processServiceRequest(request: GuestRequest) {}
}

interface GuestPreference { /* ... */ }
interface BookingResult { /* ... */ }
interface GuestRequest { /* ... */ }
interface ServiceResponse { /* ... */ }
interface SeasonalData { /* ... */ }
interface ClusteringResult { /* ... */ }
```

## 🎯 Key Takeaways

### Approximation Algorithms
- **Trade-off**: Quality vs. Speed
- **Guarantees**: Provable approximation bounds
- **Applications**: Optimization problems in real systems

### State Machines
- **Modeling**: Complex system behaviors
- **Processing**: Sequential data and protocols
- **Validation**: Input processing and format checking

### Streaming Algorithms
- **Efficiency**: Constant memory for large datasets
- **Real-time**: Continuous data processing
- **Approximation**: Probabilistic guarantees

### Integration
- **Systems**: Combine multiple algorithm types
- **Optimization**: Choose right algorithm for each problem
- **Scalability**: Handle real-world data volumes

## 🚀 Next Steps

1. **Explore Advanced Topics**:
   - Machine Learning integration
   - Distributed algorithms
   - Quantum computing algorithms

2. **Build Real Systems**:
   - Implement the hotel management system
   - Create your own streaming analytics
   - Develop state machine-based parsers

3. **Research Current Trends**:
   - Approximation algorithms for NP-hard problems
   - Streaming algorithms for big data
   - State machines in modern computing

## 📚 Additional Resources

- **Books**:
  - "Approximation Algorithms" by Vijay Vazirani
  - "Introduction to Automata Theory" by Hopcroft & Ullman
  - "Streaming Algorithms" research papers

- **Online Courses**:
  - Coursera: Approximation Algorithms
  - edX: Automata and Computability
  - Research papers on streaming algorithms

---

**Congratulations!** You now understand advanced algorithms that power modern systems. These concepts form the foundation of complex software systems and cutting-edge research in computer science.
