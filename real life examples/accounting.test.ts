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
  TreeNode
} from '../typescript/index';

/**
 * Accounting Software Applications - Real World Test Cases
 *
 * This file demonstrates practical applications of algorithms in accounting software:
 * - Financial transaction analysis and fraud detection
 * - Budget optimization and forecasting
 * - Tax calculation and compliance checking
 * - Audit trail analysis
 * - Expense categorization and reporting
 * - Financial ratio analysis
 */

describe('Accounting Software Applications', () => {

  describe('Financial Transaction Analysis', () => {
    test('transaction pattern analysis for fraud detection', () => {
      const transactions = [0, 1, 2, 3, 4];
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Legitimate transaction patterns
        [1, 2], [1, 3],
      ];
      const negativeEdges: [number, number][] = [
        [2, 3], [3, 4], // Suspicious patterns
        [0, 4], // Anomalous connections
      ];

      const fraudClustering = new CorrelationClustering(transactions, positiveEdges, negativeEdges);
      const result = fraudClustering.greedyCorrelationClustering();

      // Should identify legitimate vs fraudulent transaction clusters
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(3);
    });

    test('transaction amount validation with approximation', () => {
      const expectedAmounts = [1000, 500, 750]; // Expected transaction amounts
      const actualAmounts = [995, 502, 748]; // Actual processed amounts
      const tolerance = 0.01; // 1% tolerance for rounding/processing errors

      // Check if actual amounts are within tolerance of expected
      for (let i = 0; i < expectedAmounts.length; i++) {
        const isValid = isMultiplicativeApproximationTwoSided(tolerance, expectedAmounts[i], actualAmounts[i]);
        expect(isValid).toBe(true);
      }

      // Test invalid transaction (too far from expected)
      const invalidAmount = 850; // 13% difference from expected 750
      const isInvalid = isMultiplicativeApproximationTwoSided(tolerance, 750, invalidAmount);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Budget Optimization and Forecasting', () => {
    test('departmental budget allocation with graph optimization', () => {
      const budgetGraph = new AdjacencyListGraph<string>(true, true);

      // Departments and budget categories
      const entities = ['Sales', 'Marketing', 'IT', 'HR', 'Operations', 'Travel', 'Equipment', 'Software'];
      entities.forEach(entity => budgetGraph.addVertex(entity));

      // Budget allocation relationships with priority weights
      budgetGraph.addEdge('Sales', 'Travel', 0.9); // High priority
      budgetGraph.addEdge('Sales', 'Equipment', 0.8);
      budgetGraph.addEdge('IT', 'Software', 0.9);
      budgetGraph.addEdge('IT', 'Equipment', 0.7);
      budgetGraph.addEdge('Marketing', 'Travel', 0.6);
      budgetGraph.addEdge('HR', 'Software', 0.4);

      // Check department budget priorities
      const salesPriorities = budgetGraph.getNeighbors('Sales');
      expect(salesPriorities).toContain('Travel');
      expect(salesPriorities).toContain('Equipment');

      // Verify priority weights
      expect(budgetGraph.getEdgeWeight('Sales', 'Travel')).toBe(0.9);
      expect(budgetGraph.getEdgeWeight('HR', 'Software')).toBe(0.4);
    });

    test('expense forecasting with streaming data', () => {
      const monthlyExpenses = [
        { itemIndex: 1, delta: 5000 }, // Office supplies
        { itemIndex: 2, delta: 8000 }, // Salaries
        { itemIndex: 1, delta: 3000 }, // Additional supplies
        { itemIndex: 3, delta: 2000 }, // Utilities
        { itemIndex: 2, delta: 8500 }, // Salary adjustments
      ];

      const expenseTotals = calculateFrequencyVector(5, monthlyExpenses, 5);
      expect(expenseTotals[0]).toBe(8000); // Office supplies: 5000 + 3000
      expect(expenseTotals[1]).toBe(16500); // Salaries: 8000 + 8500
      expect(expenseTotals[2]).toBe(2000); // Utilities
    });
  });

  describe('Tax Calculation and Compliance', () => {
    test('tax bracket optimization with approximation algorithms', () => {
      const incomeLevels = [50000, 75000, 100000, 150000];
      const taxBrackets = [0.1, 0.15, 0.2, 0.25]; // Tax rates
      const calculatedTaxes = [5000, 11250, 20000, 37500]; // Calculated tax amounts

      // Verify tax calculations are accurate within 1%
      for (let i = 0; i < incomeLevels.length; i++) {
        const expectedTax = incomeLevels[i] * taxBrackets[i];
        const isAccurate = isMultiplicativeApproximationTwoSided(0.01, expectedTax, calculatedTaxes[i]);
        expect(isAccurate).toBe(true);
      }

      // Test tax optimization scenario
      const preTaxIncome = 100000;
      const postTaxIncome = 80000; // After deductions
      const taxSavings = 20000;
      const isOptimal = isMultiplicativeApproximationTwoSided(0.25, 20000, taxSavings); // Expected savings of 20000
      expect(isOptimal).toBe(true);
    });

    test('compliance rule checking with signed graphs', () => {
      const complianceGraph = new SignedGraph(6, false); // 6 compliance rules/transactions

      // Set up compliance relationships
      complianceGraph.addEdge(0, 1, 1);  // Compliant combinations
      complianceGraph.addEdge(1, 2, 1);
      complianceGraph.addEdge(2, 3, -1); // Non-compliant combinations
      complianceGraph.addEdge(3, 4, -1);
      complianceGraph.addEdge(0, 5, -1); // Regulatory violations

      expect(complianceGraph.countPositiveEdges()).toBeGreaterThan(0);
      expect(complianceGraph.countNegativeEdges()).toBeGreaterThan(0);

      // Non-compliant connections should be negative
      expect(complianceGraph.getEdgeSign(2, 3)).toBe(-1);
      expect(complianceGraph.getEdgeSign(0, 5)).toBe(-1);
    });
  });

  describe('Audit Trail Analysis', () => {
    test('transaction sequence validation with graph traversal', () => {
      const auditGraph = new AdjacencyListGraph<string>(true, false);

      // Audit events in sequence
      const events = ['Login', 'Transaction_Init', 'Approval', 'Processing', 'Completion', 'Logout'];
      events.forEach(event => auditGraph.addVertex(event));

      // Required audit sequence
      auditGraph.addEdge('Login', 'Transaction_Init');
      auditGraph.addEdge('Transaction_Init', 'Approval');
      auditGraph.addEdge('Approval', 'Processing');
      auditGraph.addEdge('Processing', 'Completion');
      auditGraph.addEdge('Completion', 'Logout');

      // Verify audit trail integrity
      expect(auditGraph.getNeighbors('Login')).toContain('Transaction_Init');
      expect(auditGraph.getNeighbors('Processing')).toContain('Completion');

      // Check for proper sequencing (no cycles in valid audit trails)
      const hasCycle = (node: string, visited: Set<string>, recursionStack: Set<string>): boolean => {
        visited.add(node);
        recursionStack.add(node);

        for (const neighbor of auditGraph.getNeighbors(node)) {
          if (!visited.has(neighbor) && hasCycle(neighbor, visited, recursionStack)) {
            return true;
          } else if (recursionStack.has(neighbor)) {
            return true;
          }
        }

        recursionStack.delete(node);
        return false;
      };

      expect(hasCycle('Login', new Set(), new Set())).toBe(false);
    });

    test('anomaly detection in audit logs', () => {
      const auditEvents = [0, 1, 2, 3, 4];
      const positiveEdges: [number, number][] = [
        [0, 1], // Normal audit sequence
        [1, 2],
      ];
      const negativeEdges: [number, number][] = [
        [2, 3], // Anomalous patterns
        [3, 4],
        [0, 4], // Irregular connections
      ];

      const anomalyClustering = new CorrelationClustering(auditEvents, positiveEdges, negativeEdges);
      const result = anomalyClustering.greedyCorrelationClustering();

      // Should identify normal vs anomalous audit patterns
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(2);
    });
  });

  describe('Expense Categorization and Reporting', () => {
    test('automatic expense classification with tree structures', () => {
      // Expense category hierarchy
      const travel: TreeNode = { children: [], color: 1 }; // Travel expenses
      const office: TreeNode = { children: [], color: 2 }; // Office supplies
      const meals: TreeNode = { children: [], color: 3 }; // Business meals

      const businessExpenses: TreeNode = {
        children: [travel, office],
        color: undefined
      };

      const personalExpenses: TreeNode = {
        children: [meals],
        color: undefined
      };

      const allExpenses: TreeNode = {
        children: [businessExpenses, personalExpenses],
        color: undefined
      };

      const expenseCategories = subtreeMode(allExpenses);

      // Business expenses should be travel-dominated
      expect(expenseCategories.get(businessExpenses)).toBe(1);

      // Personal expenses should be meals-dominated
      expect(expenseCategories.get(personalExpenses)).toBe(3);

      // Overall expenses should be business-dominated
      expect(expenseCategories.get(allExpenses)).toBe(1);
    });

    test('expense pattern analysis for budget planning', () => {
      const expensePredictor = (expenses: number[]) => {
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp, 0);
        return totalExpenses > 10000 ? 1 : 0; // High expense flag
      };

      const monthlyData = [
        { itemIndex: 1, delta: 5000 }, // Travel
        { itemIndex: 2, delta: 6000 }, // Supplies
      ];

      const expenseAnalysis = obliviousStreamingAlgorithm(
        expensePredictor,
        0.1, // 10% tolerance
        5,   // Max expense category
        5,   // Expense types
        10,  // Analysis period
        monthlyData
      );

      expect(expenseAnalysis).toBe(1); // High expense period detected
    });
  });

  describe('Financial Ratio Analysis', () => {
    test('liquidity ratio monitoring with approximation', () => {
      const currentAssets = [50000, 30000, 20000]; // Cash, inventory, receivables
      const currentLiabilities = [25000, 15000, 10000]; // Accounts payable, short-term debt

      const totalAssets = currentAssets.reduce((sum, asset) => sum + asset, 0);
      const totalLiabilities = currentLiabilities.reduce((sum, liability) => sum + liability, 0);

      const currentRatio = totalAssets / totalLiabilities; // Should be > 1.5 for healthy liquidity
      const targetRatio = 2.0; // Target liquidity ratio

      const isHealthy = isMultiplicativeApproximationTwoSided(0.2, targetRatio, currentRatio);
      expect(isHealthy).toBe(true);

      // Test unhealthy liquidity
      const lowAssets = [20000, 10000, 5000];
      const lowAssetTotal = lowAssets.reduce((sum, asset) => sum + asset, 0);
      const unhealthyRatio = lowAssetTotal / totalLiabilities;
      const isUnhealthy = isMultiplicativeApproximationTwoSided(0.2, targetRatio, unhealthyRatio);
      expect(isUnhealthy).toBe(false);
    });

    test('profitability analysis with correlation clustering', () => {
      const businessUnits = [0, 1, 2, 3, 4];
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Profitable unit clusters
        [1, 2], [1, 3],
      ];
      const negativeEdges: [number, number][] = [
        [2, 3], [3, 4], // Underperforming connections
        [0, 4], // Performance disparities
      ];

      const profitabilityClustering = new CorrelationClustering(businessUnits, positiveEdges, negativeEdges);
      const result = profitabilityClustering.greedyCorrelationClustering();

      // Should identify high vs low performing business units
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(3);

      const performanceClusters = profitabilityClustering.getClustersAsArrays(result.clustering);
      expect(performanceClusters.size).toBe(result.clusterCount);
    });
  });

});
