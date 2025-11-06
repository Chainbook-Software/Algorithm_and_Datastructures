# Chapter 6: Advanced Topics

## 🎯 Learning Objectives

By the end of this chapter, you will:
- Understand approximation algorithms and their real-world applications
- Implement finite state machines for complex state management
- Learn streaming algorithms for processing continuous data
- See how these concepts are used in our comprehensive codebase
- Apply advanced concepts to solve sophisticated problems

## 🔄 Approximation Algorithms

Approximation algorithms find near-optimal solutions when exact solutions are too expensive or impossible.

### Simple Knapsack Approximation

```typescript
interface Item {
  weight: number;
  value: number;
}

function greedyKnapsack(items: Item[], capacity: number): Item[] {
  // Sort by value-to-weight ratio (greedy approach)
  const sortedItems = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));

  const selected: Item[] = [];
  let remainingCapacity = capacity;

  for (const item of sortedItems) {
    if (item.weight <= remainingCapacity) {
      selected.push(item);
      remainingCapacity -= item.weight;
    }
  }

  return selected;
}

// Test the approximation
function testGreedyKnapsack() {
  const items: Item[] = [
    { weight: 10, value: 60 }, // ratio = 6
    { weight: 20, value: 100 }, // ratio = 5
    { weight: 30, value: 120 }  // ratio = 4
  ];

  const selected = greedyKnapsack(items, 50);
  const totalValue = selected.reduce((sum, item) => sum + item.value, 0);
  const totalWeight = selected.reduce((sum, item) => sum + item.weight, 0);

  console.assert(totalWeight <= 50, "Should not exceed capacity");
  console.assert(selected.length >= 1, "Should select at least one item");
  // Greedy should select highest ratio items first
  console.assert(selected.some(item => item.weight === 10), "Should select high-ratio item");

  console.log(`Selected ${selected.length} items with total value ${totalValue}`);
  console.log("✅ Greedy knapsack test passed!");
}

testGreedyKnapsack();
```

**Learning from Our Codebase:**
Our [`approximations.ts`](../../../typescript/algorithms/approximations.ts) includes sophisticated approximation algorithms for complex optimization problems.

## 🤖 State Machines

State machines model systems with defined states and transitions.

### Traffic Light Controller

```typescript
type LightState = 'red' | 'yellow' | 'green';

class TrafficLight {
  private state: LightState = 'red';

  next(): LightState {
    switch (this.state) {
      case 'red':
        this.state = 'green';
        break;
      case 'green':
        this.state = 'yellow';
        break;
      case 'yellow':
        this.state = 'red';
        break;
    }
    return this.state;
  }

  getState(): LightState {
    return this.state;
  }

  // Handle emergency override
  emergency(): LightState {
    if (this.state === 'green') {
      this.state = 'yellow';
    }
    return this.state;
  }
}

// Test the traffic light
function testTrafficLight() {
  const light = new TrafficLight();

  console.assert(light.getState() === 'red', "Should start red");

  console.assert(light.next() === 'green', "Red -> Green");
  console.assert(light.next() === 'yellow', "Green -> Yellow");
  console.assert(light.next() === 'red', "Yellow -> Red");

  // Test emergency
  light.next(); // to green
  light.emergency();
  console.assert(light.getState() === 'yellow', "Emergency should change green to yellow");

  console.log("✅ Traffic light tests passed!");
}

testTrafficLight();
```

### Complex State Machine: Vending Machine

```typescript
type VendingState = 'waiting' | 'has_quarter' | 'has_dollar' | 'dispensing' | 'out_of_order';

class VendingMachine {
  private state: VendingState = 'waiting';
  private quarters = 0;

  insertQuarter(): string {
    switch (this.state) {
      case 'waiting':
        this.quarters = 1;
        this.state = 'has_quarter';
        return "Quarter inserted. Total: $0.25";

      case 'has_quarter':
        this.quarters = 2;
        this.state = 'has_dollar';
        return "Quarter inserted. Total: $0.50";

      case 'has_dollar':
        return "Machine full. Please select item or get refund.";

      case 'out_of_order':
        return "Machine out of order. Quarters returned.";

      default:
        return "Unexpected state";
    }
  }

  selectItem(): string {
    switch (this.state) {
      case 'has_dollar':
        this.state = 'dispensing';
        this.quarters = 0;
        return "Dispensing item...";

      case 'dispensing':
        this.state = 'waiting';
        return "Item dispensed. Thank you!";

      default:
        return "Please insert $0.50 first.";
    }
  }

  getRefund(): string {
    const refund = this.quarters * 0.25;
    this.quarters = 0;
    this.state = 'waiting';
    return `Refunded $${refund.toFixed(2)}`;
  }
}
```

**Learning from Our Codebase:**
Our [`stateMachine.ts`](../../../typescript/datastructures/stateMachine.ts) implements sophisticated state machines including Finite State Machines, Deterministic Finite Automata, and Turing Machines.

## 🌊 Streaming Algorithms

Streaming algorithms process continuous data streams efficiently.

### Streaming Average Calculator

```typescript
class StreamingAverage {
  private sum = 0;
  private count = 0;

  add(value: number): void {
    this.sum += value;
    this.count++;
  }

  getAverage(): number {
    return this.count > 0 ? this.sum / this.count : 0;
  }

  reset(): void {
    this.sum = 0;
    this.count = 0;
  }
}

// Test streaming average
function testStreamingAverage() {
  const avg = new StreamingAverage();

  console.assert(avg.getAverage() === 0, "Empty average should be 0");

  avg.add(10);
  console.assert(avg.getAverage() === 10, "Single value average");

  avg.add(20);
  console.assert(avg.getAverage() === 15, "Two value average");

  avg.add(30);
  console.assert(avg.getAverage() === 20, "Three value average");

  avg.reset();
  console.assert(avg.getAverage() === 0, "Reset should clear average");

  console.log("✅ Streaming average tests passed!");
}

testStreamingAverage();
```

### Streaming Frequency Counter

```typescript
class StreamingFrequency {
  private frequencies: Map<string, number> = new Map();

  add(item: string): void {
    const count = this.frequencies.get(item) || 0;
    this.frequencies.set(item, count + 1);
  }

  getFrequency(item: string): number {
    return this.frequencies.get(item) || 0;
  }

  getMostFrequent(): { item: string; count: number } | null {
    let maxItem: string | null = null;
    let maxCount = 0;

    for (const [item, count] of this.frequencies) {
      if (count > maxCount) {
        maxItem = item;
        maxCount = count;
      }
    }

    return maxItem ? { item: maxItem, count: maxCount } : null;
  }

  getTotalItems(): number {
    let total = 0;
    for (const count of this.frequencies.values()) {
      total += count;
    }
    return total;
  }
}
```

**Learning from Our Codebase:**
Our [`estimator.ts`](../../../typescript/algorithms/estimator.ts) includes sophisticated streaming algorithms for frequency estimation and data summarization.

## 🔬 Advanced Example: Simple Recommendation Engine

Combining multiple advanced concepts:

```typescript
interface User {
  id: string;
  preferences: Map<string, number>; // item -> rating
}

class RecommendationEngine {
  private userPreferences: Map<string, Map<string, number>> = new Map();
  private itemSimilarities: Map<string, Map<string, number>> = new Map();

  addUserRating(userId: string, itemId: string, rating: number): void {
    if (!this.userPreferences.has(userId)) {
      this.userPreferences.set(userId, new Map());
    }
    this.userPreferences.get(userId)!.set(itemId, rating);
  }

  // Collaborative filtering: find similar users
  getSimilarUsers(userId: string, limit = 5): Array<{ userId: string; similarity: number }> {
    const userPrefs = this.userPreferences.get(userId);
    if (!userPrefs) return [];

    const similarities: Array<{ userId: string; similarity: number }> = [];

    for (const [otherUserId, otherPrefs] of this.userPreferences) {
      if (otherUserId === userId) continue;

      const similarity = this.cosineSimilarity(userPrefs, otherPrefs);
      similarities.push({ userId: otherUserId, similarity });
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  private cosineSimilarity(prefs1: Map<string, number>, prefs2: Map<string, number>): number {
    const commonItems = new Set([...prefs1.keys(), ...prefs2.keys()]);
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (const item of commonItems) {
      const rating1 = prefs1.get(item) || 0;
      const rating2 = prefs2.get(item) || 0;

      dotProduct += rating1 * rating2;
      norm1 += rating1 * rating1;
      norm2 += rating2 * rating2;
    }

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Generate recommendations using collaborative filtering
  getRecommendations(userId: string, limit = 5): Array<{ itemId: string; predictedRating: number }> {
    const similarUsers = this.getSimilarUsers(userId, 10);
    const userPrefs = this.userPreferences.get(userId) || new Map();
    const recommendations: Map<string, { totalWeighted: number; totalWeight: number }> = new Map();

    for (const { userId: similarUserId, similarity } of similarUsers) {
      const similarPrefs = this.userPreferences.get(similarUserId);
      if (!similarPrefs) continue;

      for (const [itemId, rating] of similarPrefs) {
        if (!userPrefs.has(itemId)) { // Only recommend unseen items
          const current = recommendations.get(itemId) || { totalWeighted: 0, totalWeight: 0 };
          current.totalWeighted += rating * similarity;
          current.totalWeight += similarity;
          recommendations.set(itemId, current);
        }
      }
    }

    return Array.from(recommendations.entries())
      .map(([itemId, { totalWeighted, totalWeight }]) => ({
        itemId,
        predictedRating: totalWeighted / totalWeight
      }))
      .sort((a, b) => b.predictedRating - a.predictedRating)
      .slice(0, limit);
  }
}
```

## 🎯 Chapter Summary

In this chapter, you explored:

1. **Approximation Algorithms**: Greedy approaches for complex optimization
2. **State Machines**: Traffic lights and vending machines with defined states
3. **Streaming Algorithms**: Processing continuous data efficiently
4. **Advanced Integration**: Recommendation engine combining multiple concepts

## 🔗 Key Concepts Review

- **Approximation**: Near-optimal solutions when exact is too expensive
- **State Machines**: Systems with defined states and transitions
- **Streaming**: Process data as it arrives, not all at once
- **Collaborative Filtering**: Recommendations based on user similarities

## 🚀 Next Steps

You've now learned comprehensive algorithms and data structures! In **Chapter 7**, we'll conclude with a final project and resources for continued learning.

## 📚 Additional Resources

- **Research Papers**: Search for "approximation algorithms survey"
- **Our Codebase**: Study the state machine implementations deeply
- **Machine Learning**: Streaming algorithms are crucial for ML systems

---

**Explored advanced topics?** Now head to [Chapter 7: Conclusion and Next Steps](./07-conclusion.md) to complete your learning journey with a final project!</content>
<parameter name="filePath">/Users/macbookpro/GUSKI/Algorithms_and_Datastructures/algorithms-tutorial/chapters/06-advanced-topics.md
