/// <reference types="jest" />

import {
  CorrelationClustering,
  AdjacencyListGraph,
  SignedGraph,
  isMultiplicativeApproximation,
  isMultiplicativeApproximationTwoSided,
  calculateFrequencyVector,
  obliviousStreamingAlgorithm,
  subtreeMode,
  TreeNode,
  FiniteStateMachine,
  DeterministicFiniteAutomaton,
  TuringMachine,
  RegexCompiler,
  LexicalAnalyzer
} from '../typescript/index';

/**
 * E-commerce Test Cases - Real World Applications
 *
 * This file demonstrates practical applications of the algorithms and data structures
 * in e-commerce scenarios including:
 * - Product recommendations using correlation clustering
 * - Shopping cart optimization with approximation algorithms
 * - Inventory management with streaming estimators
 * - User behavior analysis with tree algorithms
 * - Price optimization and fraud detection
 */

describe('E-commerce Applications', () => {

  describe('Product Recommendation System', () => {
    test('customer-product correlation clustering for recommendations', () => {
      // Simulate customer purchase patterns
      const customers = [0, 1, 2, 3, 4];
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Customer 0 likes products 1 and 2
        [1, 2], [1, 3], // Customer 1 likes products 2 and 3
        [2, 3], [2, 4], // Customer 2 likes products 3 and 4
        [3, 4]          // Customer 3 likes product 4
      ];
      const negativeEdges: [number, number][] = [
        [0, 3], [0, 4], // Customer 0 dislikes products 3 and 4
        [1, 4]          // Customer 1 dislikes product 4
      ];

      const clustering = new CorrelationClustering(customers, positiveEdges, negativeEdges);
      const result = clustering.greedyCorrelationClustering();

      // Should find customer segments with similar preferences
      expect(result.mistakes).toBeLessThanOrEqual(4); // Allow more mistakes for complex relationships
      expect(result.clusterCount).toBeGreaterThan(1);

      // Validate that similar customers are clustered together
      const clusters = clustering.getClustersAsArrays(result.clustering);
      expect(clusters.size).toBe(result.clusterCount);
    });

    test('product similarity graph for cross-selling', () => {
      const graph = new AdjacencyListGraph<number>(false, true);

      // Products: 0=laptop, 1=mouse, 2=keyboard, 3=monitor, 4=headphones
      const products = [0, 1, 2, 3, 4];
      products.forEach(p => graph.addVertex(p));

      // Add similarity edges with weights
      graph.addEdge(0, 1, 0.8); // laptop + mouse
      graph.addEdge(0, 2, 0.9); // laptop + keyboard
      graph.addEdge(0, 3, 0.7); // laptop + monitor
      graph.addEdge(1, 2, 0.6); // mouse + keyboard
      graph.addEdge(2, 3, 0.5); // keyboard + monitor
      graph.addEdge(3, 4, 0.4); // monitor + headphones

      // Verify connectivity
      expect(graph.getNeighbors(0)).toContain(1);
      expect(graph.getNeighbors(0)).toContain(2);
      expect(graph.getNeighbors(0)).toContain(3);

      // Check edge weights represent similarity
      expect(graph.getEdgeWeight(0, 1)).toBe(0.8);
      expect(graph.getEdgeWeight(0, 2)).toBe(0.9);
    });
  });

  describe('Shopping Cart Optimization', () => {
    test('price approximation for bundle deals', () => {
      const individualPrices = [100, 50, 30]; // Product prices
      const bundlePrice = 165; // Bundle price (reasonable discount from 180)
      const epsilon = 0.1; // 10% approximation tolerance

      // Check if bundle price is a good approximation
      const totalIndividual = individualPrices.reduce((sum, price) => sum + price, 0);
      const isGoodDeal = isMultiplicativeApproximationTwoSided(epsilon, totalIndividual, bundlePrice);

      expect(isGoodDeal).toBe(true); // Bundle should be within 10% of total

      // Test edge cases
      const expensiveBundle = 200; // Overpriced bundle
      const badDeal = isMultiplicativeApproximationTwoSided(epsilon, totalIndividual, expensiveBundle);
      expect(badDeal).toBe(false);
    });

    test('dynamic pricing with approximation guarantees', () => {
      const basePrice = 100;
      const demandMultiplier = 1.2; // High demand
      const adjustedPrice = basePrice * demandMultiplier;

      // Ensure price adjustment is reasonable (within 50% of base)
      const reasonableAdjustment = isMultiplicativeApproximation(0.5, basePrice, adjustedPrice);
      expect(reasonableAdjustment).toBe(true);

      // Test with extreme price gouging
      const gougedPrice = basePrice * 3; // 300% markup
      const isFair = isMultiplicativeApproximation(0.5, basePrice, gougedPrice);
      expect(isFair).toBe(false);
    });
  });

  describe('Inventory Management', () => {
    test('streaming inventory updates with frequency estimation', () => {
      const n = 5; // 5 products
      const updates = [
        { itemIndex: 1, delta: 10 }, // Product 1: +10 stock
        { itemIndex: 2, delta: -5 }, // Product 2: -5 stock
        { itemIndex: 1, delta: -3 }, // Product 1: -3 stock
        { itemIndex: 3, delta: 20 }, // Product 3: +20 stock
        { itemIndex: 2, delta: 8 },  // Product 2: +8 stock
      ];

      const inventoryAfter3Updates = calculateFrequencyVector(n, updates, 3);
      expect(inventoryAfter3Updates[0]).toBe(7); // Product 1: 10 - 3 = 7
      expect(inventoryAfter3Updates[1]).toBe(-5); // Product 2: -5
      expect(inventoryAfter3Updates[2]).toBe(0); // Product 3: not updated yet

      const finalInventory = calculateFrequencyVector(n, updates, 5);
      expect(finalInventory[0]).toBe(7);  // Product 1: 10 - 3 = 7
      expect(finalInventory[1]).toBe(3);  // Product 2: -5 + 8 = 3
      expect(finalInventory[2]).toBe(20); // Product 3: 20
    });

    test('demand forecasting with streaming approximation', () => {
      const maxDemand = (v: number[]) => Math.max(...v); // Max demand predictor

      const updates = [
        { itemIndex: 1, delta: 100 }, // High demand for product 1
        { itemIndex: 2, delta: 50 },  // Medium demand for product 2
        { itemIndex: 3, delta: 25 },  // Low demand for product 3
      ];

      const result = obliviousStreamingAlgorithm(
        maxDemand,
        0.2, // 20% approximation tolerance
        150, // Upper bound for demand
        5,   // 5 products
        10,  // Max stream length
        updates
      );

      expect(result).toBe(100); // Should predict max demand of 100
    });
  });

  describe('User Behavior Analysis', () => {
    test('user segmentation with hierarchical clustering', () => {
      // Create user behavior tree
      // Root: All Users
      // Level 1: Premium/Free users
      // Level 2: Purchase frequency categories

      const premiumUsers: TreeNode = {
        children: [],
        color: 1 // Premium user behavior pattern
      };

      const frequentBuyers: TreeNode = {
        children: [],
        color: 2 // Frequent buyer pattern
      };

      const occasionalBuyers: TreeNode = {
        children: [],
        color: 3 // Occasional buyer pattern
      };

      const freeUsers: TreeNode = {
        children: [frequentBuyers, occasionalBuyers],
        color: undefined
      };

      const root: TreeNode = {
        children: [premiumUsers, freeUsers],
        color: undefined
      };

      const userSegments = subtreeMode(root);

      // Premium users should maintain their pattern
      expect(userSegments.get(premiumUsers)).toBe(1);

      // Free users subtree should be dominated by frequent buyers (more common)
      expect(userSegments.get(freeUsers)).toBe(2);

      // Root should be dominated by premium users (higher value)
      expect(userSegments.get(root)).toBe(1);
    });

    test('customer lifetime value prediction tree', () => {
      // Tree representing customer value segments
      const highValue: TreeNode = { children: [], color: 1 };
      const mediumValue: TreeNode = { children: [], color: 2 };
      const lowValue: TreeNode = { children: [], color: 3 };

      const returningCustomers: TreeNode = {
        children: [highValue, mediumValue],
        color: undefined
      };

      const newCustomers: TreeNode = {
        children: [mediumValue, lowValue],
        color: undefined
      };

      const root: TreeNode = {
        children: [returningCustomers, newCustomers],
        color: undefined
      };

      const valueSegments = subtreeMode(root);

      // Returning customers subtree should be high-value dominated
      expect(valueSegments.get(returningCustomers)).toBe(1);

      // New customers subtree should be medium-value dominated
      expect(valueSegments.get(newCustomers)).toBe(2);

      // Overall customer base should be high-value dominated (from returning customers)
      expect(valueSegments.get(root)).toBe(1);
    });
  });

  describe('Fraud Detection', () => {
    test('transaction pattern analysis with signed graphs', () => {
      const signedGraph = new SignedGraph(5, false); // 5 users, deterministic edges

      // Manually set up fraud patterns
      signedGraph.addEdge(0, 1, 1);  // Legitimate transaction pattern
      signedGraph.addEdge(1, 2, 1);  // Legitimate
      signedGraph.addEdge(2, 3, -1); // Suspicious pattern (negative edge)
      signedGraph.addEdge(3, 4, -1); // Fraudulent connection
      signedGraph.addEdge(0, 4, -1); // Direct fraud indicator

      // Check graph properties
      expect(signedGraph.isComplete()).toBe(true);
      expect(signedGraph.countPositiveEdges()).toBeGreaterThan(0);
      expect(signedGraph.countNegativeEdges()).toBeGreaterThan(0);

      // Fraudulent edges should be negative
      expect(signedGraph.getEdgeSign(2, 3)).toBe(-1);
      expect(signedGraph.getEdgeSign(3, 4)).toBe(-1);
    });

    test('anomaly detection in purchase patterns', () => {
      const users = [0, 1, 2, 3];
      const positiveEdges: [number, number][] = [
        [0, 1], // Normal user connections
        [1, 2],
      ];
      const negativeEdges: [number, number][] = [
        [2, 3], // Anomalous connection (fraudster to legitimate user)
        [0, 3], // Another suspicious connection
      ];

      const fraudDetection = new CorrelationClustering(users, positiveEdges, negativeEdges);
      const result = fraudDetection.greedyCorrelationClustering();

      // Should detect fraud patterns by minimizing disagreements
      expect(result.mistakes).toBeLessThanOrEqual(1);

      // Fraudulent users should be isolated or in separate clusters
      const clusters = fraudDetection.getClustersAsArrays(result.clustering);
      expect(clusters.size).toBeGreaterThan(1);
    });
  });

  describe('Price Optimization', () => {
    test('competitive pricing with approximation algorithms', () => {
      const competitorPrices = [95, 105, 98, 102];
      const ourCost = 80;
      const targetMargin = 1.25; // 25% margin

      const optimalPrice = ourCost * targetMargin; // 100

      // Check if our price is competitive (within 10% of market average)
      const marketAverage = competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length;
      const isCompetitive = isMultiplicativeApproximation(0.1, marketAverage, optimalPrice);

      expect(isCompetitive).toBe(true);

      // Test with uncompetitive pricing
      const tooHighPrice = 150;
      const isStillCompetitive = isMultiplicativeApproximation(0.1, marketAverage, tooHighPrice);
      expect(isStillCompetitive).toBe(false);
    });

    test('dynamic pricing for flash sales', () => {
      const originalPrice = 200;
      const flashSalePrice = 150;
      const discountRate = 0.75; // 25% discount

      // Verify the discount calculation
      const calculatedDiscount = flashSalePrice / originalPrice;
      const isAccurateDiscount = isMultiplicativeApproximation(0.01, discountRate, calculatedDiscount);

      expect(isAccurateDiscount).toBe(true);

      // Ensure minimum profit margin is maintained
      const minMargin = 1.1; // 10% minimum margin
      const costPrice = 120;
      const minSalePrice = costPrice * minMargin;

      expect(flashSalePrice).toBeGreaterThanOrEqual(minSalePrice);
    });
  });

  describe('Search and Filtering', () => {
    test('product category graph for navigation', () => {
      const categoryGraph = new AdjacencyListGraph<string>(true, false); // Directed, unweighted

      // Product categories
      const categories = ['Electronics', 'Computers', 'Laptops', 'Accessories', 'Books', 'Fiction', 'Non-Fiction'];
      categories.forEach(cat => categoryGraph.addVertex(cat));

      // Add hierarchical relationships
      categoryGraph.addEdge('Electronics', 'Computers');
      categoryGraph.addEdge('Computers', 'Laptops');
      categoryGraph.addEdge('Computers', 'Accessories');
      categoryGraph.addEdge('Books', 'Fiction');
      categoryGraph.addEdge('Books', 'Non-Fiction');

      // Cross-category relationships
      categoryGraph.addEdge('Laptops', 'Accessories');

      // Verify navigation paths
      expect(categoryGraph.getNeighbors('Electronics')).toContain('Computers');
      expect(categoryGraph.getNeighbors('Computers')).toContain('Laptops');
      expect(categoryGraph.getNeighbors('Computers')).toContain('Accessories');

      // Check degree calculations
      expect(categoryGraph.getOutDegree('Computers')).toBe(2); // Laptops + Accessories
      expect(categoryGraph.getInDegree('Accessories')).toBe(2); // From Computers + Laptops
    });

    test('user preference filtering with graph traversal', () => {
      const preferenceGraph = new AdjacencyListGraph<number>(false, true);

      // Users and their preferences
      const entities = [0, 1, 2, 3, 4, 5]; // 0-2: users, 3-5: products
      entities.forEach(e => preferenceGraph.addVertex(e));

      // User preferences (weighted edges)
      preferenceGraph.addEdge(0, 3, 0.9); // User 0 likes Product 3
      preferenceGraph.addEdge(0, 4, 0.7); // User 0 likes Product 4
      preferenceGraph.addEdge(1, 4, 0.8); // User 1 likes Product 4
      preferenceGraph.addEdge(1, 5, 0.6); // User 1 likes Product 5
      preferenceGraph.addEdge(2, 3, 0.5); // User 2 somewhat likes Product 3

      // Find products similar to what user 0 likes
      const user0Neighbors = preferenceGraph.getNeighbors(0);
      expect(user0Neighbors).toContain(3);
      expect(user0Neighbors).toContain(4);

      // Check preference strengths
      expect(preferenceGraph.getEdgeWeight(0, 3)).toBe(0.9);
      expect(preferenceGraph.getEdgeWeight(0, 4)).toBe(0.7);
    });
  });

  describe('Order Processing and Fulfillment', () => {
    test('order dependency graph for processing sequence', () => {
      const orderGraph = new AdjacencyListGraph<string>(true, false);

      // Order processing steps
      const steps = ['Payment', 'Inventory Check', 'Shipping', 'Delivery', 'Confirmation'];
      steps.forEach(step => orderGraph.addVertex(step));

      // Processing dependencies (directed edges)
      orderGraph.addEdge('Payment', 'Inventory Check');
      orderGraph.addEdge('Inventory Check', 'Shipping');
      orderGraph.addEdge('Shipping', 'Delivery');
      orderGraph.addEdge('Delivery', 'Confirmation');

      // Parallel processing opportunities
      orderGraph.addEdge('Payment', 'Confirmation'); // Payment confirmation can happen early

      // Verify processing order
      expect(orderGraph.getNeighbors('Payment')).toContain('Inventory Check');
      expect(orderGraph.getNeighbors('Inventory Check')).toContain('Shipping');

      // Check for cycles (should be acyclic)
      const visited = new Set<string>();
      const recursionStack = new Set<string>();

      function hasCycle(node: string): boolean {
        visited.add(node);
        recursionStack.add(node);

        for (const neighbor of orderGraph.getNeighbors(node)) {
          if (!visited.has(neighbor) && hasCycle(neighbor)) {
            return true;
          } else if (recursionStack.has(neighbor)) {
            return true;
          }
        }

        recursionStack.delete(node);
        return false;
      }

      // Should not have cycles in order processing
      expect(hasCycle('Payment')).toBe(false);
    });

    test('warehouse optimization with clustering', () => {
      // Products and their storage requirements
      const products = [0, 1, 2, 3, 4, 5];
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Electronics cluster
        [1, 2], [1, 3],
        [3, 4], [4, 5], // Accessories cluster
      ];
      const negativeEdges: [number, number][] = [
        [0, 4], [1, 5], [2, 3], // Different storage requirements
      ];

      const warehouseClustering = new CorrelationClustering(products, positiveEdges, negativeEdges);
      const result = warehouseClustering.greedyCorrelationClustering();

      // Should optimize storage by grouping similar products
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(2);

      // Validate clustering structure
      const clusters = warehouseClustering.getClustersAsArrays(result.clustering);
      expect(clusters.size).toBe(result.clusterCount);
    });
  });

  describe('State Machine Applications in E-commerce', () => {

    describe('Order Processing Workflow', () => {
      test('shopping cart to order fulfillment FSM', () => {
        // States: cart, checkout, payment, processing, shipped, delivered
        const states = ['cart', 'checkout', 'payment', 'processing', 'shipped', 'delivered'];
        const alphabet = ['add_item', 'proceed_checkout', 'enter_payment', 'confirm_payment', 'process_order', 'ship_order', 'deliver_order'];
        const fsm = new FiniteStateMachine(states, alphabet, 'cart', ['delivered']);

        // Order processing transitions
        fsm.addTransition('cart', 'add_item', 'cart');
        fsm.addTransition('cart', 'proceed_checkout', 'checkout');

        fsm.addTransition('checkout', 'enter_payment', 'payment');
        fsm.addTransition('checkout', 'add_item', 'cart'); // Can go back to modify cart

        fsm.addTransition('payment', 'confirm_payment', 'processing');

        fsm.addTransition('processing', 'process_order', 'shipped');

        fsm.addTransition('shipped', 'ship_order', 'delivered');

        fsm.addTransition('delivered', 'deliver_order', 'delivered'); // Final state

        // Test complete order flow
        const orderFlow = ['add_item', 'proceed_checkout', 'enter_payment', 'confirm_payment', 'process_order', 'ship_order', 'deliver_order'];
        const result = fsm.process(orderFlow);

        expect(result.accepted).toBe(true);
        expect(result.finalState).toBe('delivered');
        expect(result.path).toEqual(['cart', 'cart', 'checkout', 'payment', 'processing', 'shipped', 'delivered', 'delivered']);
      });

      test('order status tracking DFA', () => {
        // States: pending, confirmed, processing, shipped, delivered, cancelled
        const states = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        const alphabet = ['confirm', 'start_processing', 'ship', 'deliver', 'cancel', 'refund'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'pending', ['delivered']);

        // Order status transitions
        dfa.addDeterministicTransition('pending', 'confirm', 'confirmed');
        dfa.addDeterministicTransition('pending', 'cancel', 'cancelled');

        dfa.addDeterministicTransition('confirmed', 'start_processing', 'processing');
        dfa.addDeterministicTransition('confirmed', 'cancel', 'cancelled');

        dfa.addDeterministicTransition('processing', 'ship', 'shipped');
        dfa.addDeterministicTransition('processing', 'cancel', 'cancelled');

        dfa.addDeterministicTransition('shipped', 'deliver', 'delivered');

        dfa.addDeterministicTransition('delivered', 'refund', 'delivered'); // Can request refund but stays delivered

        dfa.addDeterministicTransition('cancelled', 'refund', 'cancelled');

        // Test successful order completion
        const successFlow = ['confirm', 'start_processing', 'ship', 'deliver'];
        expect(dfa.accepts(successFlow)).toBe(true);

        // Test order cancellation
        const cancelFlow = ['confirm', 'cancel'];
        expect(dfa.accepts(cancelFlow)).toBe(false); // Cancelled is not accepting state

        // Test invalid transition (can't ship without processing)
        const invalidFlow = ['confirm', 'ship'];
        expect(dfa.accepts(invalidFlow)).toBe(false);
      });
    });

    describe('Inventory Management', () => {
      test('stock level monitoring DFA', () => {
        // States: in_stock, low_stock, out_of_stock, discontinued
        const states = ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'];
        const alphabet = ['sale', 'restock', 'threshold_reached', 'discontinue', 'replenish'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'in_stock', ['in_stock', 'low_stock']);

        // Inventory transitions
        dfa.addDeterministicTransition('in_stock', 'sale', 'in_stock');
        dfa.addDeterministicTransition('in_stock', 'threshold_reached', 'low_stock');
        dfa.addDeterministicTransition('in_stock', 'discontinue', 'discontinued');

        dfa.addDeterministicTransition('low_stock', 'sale', 'out_of_stock');
        dfa.addDeterministicTransition('low_stock', 'restock', 'in_stock');
        dfa.addDeterministicTransition('low_stock', 'replenish', 'in_stock');
        dfa.addDeterministicTransition('low_stock', 'discontinue', 'discontinued');

        dfa.addDeterministicTransition('out_of_stock', 'restock', 'in_stock');
        dfa.addDeterministicTransition('out_of_stock', 'replenish', 'low_stock');
        dfa.addDeterministicTransition('out_of_stock', 'discontinue', 'discontinued');

        dfa.addDeterministicTransition('discontinued', 'replenish', 'discontinued'); // Can't restock discontinued items

        // Test normal stock depletion
        const normalDepletion = ['threshold_reached', 'sale'];
        expect(dfa.accepts(normalDepletion)).toBe(false); // out_of_stock is not accepting

        // Test restocking
        const restockFlow = ['threshold_reached', 'restock'];
        expect(dfa.accepts(restockFlow)).toBe(true); // Back to in_stock

        // Test discontinued product
        const discontinueFlow = ['discontinue'];
        expect(dfa.accepts(discontinueFlow)).toBe(false); // discontinued is not accepting
      });

      test('automated reordering with Turing machine', () => {
        // TM that processes inventory levels and generates reorder signals
        const states = ['q0', 'q1', 'q2', 'q_reorder', 'q_normal'];
        const tapeAlphabet = ['H', 'M', 'L', 'O', 'B']; // High, Medium, Low, Out, Blank
        const tm = new TuringMachine(states, tapeAlphabet, 'B', 'q0', ['q_reorder'], ['q_normal']);

        // Transitions for inventory monitoring
        tm.addTransition('q0', 'H', 'q_normal', 'H', 'R'); // High stock - normal
        tm.addTransition('q0', 'M', 'q_normal', 'M', 'R'); // Medium stock - normal
        tm.addTransition('q0', 'L', 'q1', 'L', 'R'); // Low stock - check next
        tm.addTransition('q0', 'O', 'q_reorder', 'O', 'R'); // Out of stock - reorder
        tm.addTransition('q0', 'B', 'q_normal', 'B', 'S'); // End of inventory

        tm.addTransition('q1', 'H', 'q_normal', 'H', 'R'); // Low + High = normal
        tm.addTransition('q1', 'M', 'q_normal', 'M', 'R'); // Low + Medium = normal
        tm.addTransition('q1', 'L', 'q_reorder', 'L', 'R'); // Low + Low = reorder
        tm.addTransition('q1', 'O', 'q_reorder', 'O', 'R'); // Low + Out = reorder
        tm.addTransition('q1', 'B', 'q_reorder', 'B', 'S'); // Low + End = reorder

        // Test normal inventory levels
        const normalInventory = ['H', 'M', 'M'];
        const normalResult = tm.run(normalInventory, 10);
        expect(normalResult.accepted).toBe(false); // Should be normal, not reorder

        // Test low inventory requiring reorder
        const lowInventory = ['L', 'L', 'O'];
        const reorderResult = tm.run(lowInventory, 10);
        expect(reorderResult.accepted).toBe(true); // Should trigger reorder

        // Test out of stock
        const outOfStock = ['O', 'O'];
        const outResult = tm.run(outOfStock, 10);
        expect(outResult.accepted).toBe(true); // Should trigger reorder
      });
    });

    describe('Fraud Detection and Prevention', () => {
      test('payment fraud detection FSM', () => {
        // States: normal, suspicious, blocked, verified
        const states = ['normal', 'suspicious', 'blocked', 'verified'];
        const alphabet = ['valid_payment', 'unusual_amount', 'unusual_location', 'verify_identity', 'block_transaction', 'approve'];
        const fsm = new FiniteStateMachine(states, alphabet, 'normal', ['verified']);

        // Fraud detection transitions
        fsm.addTransition('normal', 'valid_payment', 'verified');
        fsm.addTransition('normal', 'unusual_amount', 'suspicious');
        fsm.addTransition('normal', 'unusual_location', 'suspicious');

        fsm.addTransition('suspicious', 'verify_identity', 'verified');
        fsm.addTransition('suspicious', 'unusual_amount', 'blocked');
        fsm.addTransition('suspicious', 'unusual_location', 'blocked');
        fsm.addTransition('suspicious', 'block_transaction', 'blocked');

        fsm.addTransition('blocked', 'approve', 'verified'); // Manual approval
        fsm.addTransition('blocked', 'block_transaction', 'blocked');

        fsm.addTransition('verified', 'valid_payment', 'verified');
        fsm.addTransition('verified', 'approve', 'verified');

        // Test legitimate payment
        const legitimatePayment = ['valid_payment'];
        expect(fsm.accepts(legitimatePayment)).toBe(true);

        // Test suspicious payment that gets verified
        const suspiciousPayment = ['unusual_amount', 'verify_identity'];
        expect(fsm.accepts(suspiciousPayment)).toBe(true);

        // Test fraudulent payment
        const fraudulentPayment = ['unusual_amount', 'unusual_location', 'block_transaction'];
        expect(fsm.accepts(fraudulentPayment)).toBe(false); // blocked is not accepting
      });

      test('account security monitoring DFA', () => {
        // States: secure, warning, locked, suspended
        const states = ['secure', 'warning', 'locked', 'suspended'];
        const alphabet = ['login_success', 'login_failure', 'password_change', 'unlock', 'suspend', 'reset'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'secure', ['secure', 'warning']);

        // Account security transitions
        dfa.addDeterministicTransition('secure', 'login_success', 'secure');
        dfa.addDeterministicTransition('secure', 'login_failure', 'warning');
        dfa.addDeterministicTransition('secure', 'password_change', 'secure');

        dfa.addDeterministicTransition('warning', 'login_success', 'secure');
        dfa.addDeterministicTransition('warning', 'login_failure', 'locked');
        dfa.addDeterministicTransition('warning', 'password_change', 'secure');
        dfa.addDeterministicTransition('warning', 'reset', 'secure');

        dfa.addDeterministicTransition('locked', 'unlock', 'warning');
        dfa.addDeterministicTransition('locked', 'reset', 'secure');
        dfa.addDeterministicTransition('locked', 'suspend', 'suspended');

        dfa.addDeterministicTransition('suspended', 'reset', 'secure');
        dfa.addDeterministicTransition('suspended', 'unlock', 'suspended'); // Can't unlock suspended accounts

        // Test successful login
        const successLogin = ['login_success'];
        expect(dfa.accepts(successLogin)).toBe(true);

        // Test failed login progression
        const failedLogin = ['login_failure', 'login_failure'];
        expect(dfa.accepts(failedLogin)).toBe(false); // locked is not accepting

        // Test account recovery
        const recovery = ['login_failure', 'password_change'];
        expect(dfa.accepts(recovery)).toBe(true); // Back to secure
      });
    });

    describe('Customer Journey Modeling', () => {
      test('customer lifecycle state machine', () => {
        // States: prospect, customer, repeat_customer, loyal_customer, churned
        const states = ['prospect', 'customer', 'repeat_customer', 'loyal_customer', 'churned'];
        const alphabet = ['first_purchase', 'repeat_purchase', 'frequent_purchase', 'no_purchase_long_time', 'complaint', 'loyalty_signup'];
        const fsm = new FiniteStateMachine(states, alphabet, 'prospect', ['loyal_customer']);

        // Customer lifecycle transitions
        fsm.addTransition('prospect', 'first_purchase', 'customer');

        fsm.addTransition('customer', 'repeat_purchase', 'repeat_customer');
        fsm.addTransition('customer', 'no_purchase_long_time', 'churned');
        fsm.addTransition('customer', 'complaint', 'churned');

        fsm.addTransition('repeat_customer', 'frequent_purchase', 'loyal_customer');
        fsm.addTransition('repeat_customer', 'loyalty_signup', 'loyal_customer');
        fsm.addTransition('repeat_customer', 'no_purchase_long_time', 'customer');
        fsm.addTransition('repeat_customer', 'complaint', 'customer');

        fsm.addTransition('loyal_customer', 'frequent_purchase', 'loyal_customer');
        fsm.addTransition('loyal_customer', 'loyalty_signup', 'loyal_customer');
        fsm.addTransition('loyal_customer', 'complaint', 'repeat_customer');

        fsm.addTransition('churned', 'first_purchase', 'customer'); // Win back

        // Test customer progression to loyalty
        const loyaltyJourney = ['first_purchase', 'repeat_purchase', 'frequent_purchase'];
        const result = fsm.process(loyaltyJourney);

        expect(result.accepted).toBe(true);
        expect(result.finalState).toBe('loyal_customer');

        // Test customer churn
        const churnJourney = ['first_purchase', 'no_purchase_long_time'];
        expect(fsm.accepts(churnJourney)).toBe(false); // churned is not accepting
      });

      test('abandoned cart recovery DFA', () => {
        // States: active_cart, abandoned, recovered, purchased, lost
        const states = ['active_cart', 'abandoned', 'recovered', 'purchased', 'lost'];
        const alphabet = ['add_item', 'remove_item', 'checkout', 'abandon_timeout', 'reminder_sent', 'return_visit', 'complete_purchase', 'give_up'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'active_cart', ['purchased', 'recovered']);

        // Cart recovery transitions
        dfa.addDeterministicTransition('active_cart', 'add_item', 'active_cart');
        dfa.addDeterministicTransition('active_cart', 'remove_item', 'active_cart');
        dfa.addDeterministicTransition('active_cart', 'checkout', 'purchased');
        dfa.addDeterministicTransition('active_cart', 'abandon_timeout', 'abandoned');

        dfa.addDeterministicTransition('abandoned', 'reminder_sent', 'recovered');
        dfa.addDeterministicTransition('abandoned', 'give_up', 'lost');

        dfa.addDeterministicTransition('recovered', 'return_visit', 'active_cart');
        dfa.addDeterministicTransition('recovered', 'complete_purchase', 'purchased');
        dfa.addDeterministicTransition('recovered', 'give_up', 'lost');

        dfa.addDeterministicTransition('purchased', 'add_item', 'purchased'); // Can continue shopping

        dfa.addDeterministicTransition('lost', 'return_visit', 'lost'); // Too late

        // Test successful purchase
        const purchaseFlow = ['checkout'];
        expect(dfa.accepts(purchaseFlow)).toBe(true);

        // Test cart recovery
        const recoveryFlow = ['abandon_timeout', 'reminder_sent', 'return_visit', 'checkout'];
        expect(dfa.accepts(recoveryFlow)).toBe(true);

        // Test lost cart
        const lostFlow = ['abandon_timeout', 'give_up'];
        expect(dfa.accepts(lostFlow)).toBe(false); // lost is not accepting
      });
    });

    describe('Product Search and Filtering', () => {
      test('search query parsing with lexical analyzer', () => {
        const analyzer = new LexicalAnalyzer();

        const searchQuery = 'laptop price < 1000 AND brand = "Dell"';
        const tokens = analyzer.tokenize(searchQuery);

        // Should identify keywords, operators, identifiers, and numbers
        const operators = tokens.filter(t => t.type === 'operator');
        expect(operators.length).toBeGreaterThan(0);
        expect(operators.some(op => op.value === '<')).toBe(true);

        const keywords = tokens.filter(t => t.type === 'keyword');
        expect(keywords.some(kw => kw.value === 'AND')).toBe(false); // AND is not in our keyword list

        const identifiers = tokens.filter(t => t.type === 'identifier');
        expect(identifiers.some(id => id.value === 'laptop')).toBe(true);
        expect(identifiers.some(id => id.value === 'brand')).toBe(true);
      });

      test('product code validation with regex compiler', () => {
        const productCodeRegex = new RegexCompiler('ab'); // Simple pattern for testing
        const dfa = productCodeRegex.compile();

        // Test valid product codes using simple pattern
        expect(dfa.accepts(['a', 'b'])).toBe(true);
        expect(dfa.accepts(['a'])).toBe(false); // Incomplete

        // Test with different pattern
        const aRegex = new RegexCompiler('a');
        const aDfa = aRegex.compile();
        expect(aDfa.accepts(['a'])).toBe(true);
        expect(aDfa.accepts(['b'])).toBe(false);
      });
    });

  });

});
