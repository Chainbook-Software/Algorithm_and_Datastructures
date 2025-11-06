/// <reference types="jest" />

import {
  CorrelationClustering,
  CorrelationClusteringLP,
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
 * Hotel Management Software Applications - Real World Test Cases
 *
 * This file demonstrates practical applications of algorithms in hotel management software:
 * - Room booking optimization and availability management
 * - Revenue management and dynamic pricing
 * - Guest preference analysis and personalization
 * - Staff scheduling and shift optimization
 * - Inventory management for amenities and supplies
 * - Occupancy forecasting and demand prediction
 * - Customer segmentation and loyalty programs
 */

describe('Hotel Management Software Applications', () => {

  describe('Room Booking Optimization', () => {
    test('room availability and conflict resolution with graph coloring', () => {
      const bookingGraph = new AdjacencyListGraph<string>(false, false);

      // Rooms and booking requests
      const entities = ['Room_101', 'Room_102', 'Room_201', 'Room_202', 'Booking_A', 'Booking_B', 'Booking_C'];
      entities.forEach(entity => bookingGraph.addVertex(entity));

      // Room-booking conflicts (same time slot)
      bookingGraph.addEdge('Room_101', 'Booking_A');
      bookingGraph.addEdge('Room_101', 'Booking_B'); // Conflict!
      bookingGraph.addEdge('Room_102', 'Booking_B');
      bookingGraph.addEdge('Room_201', 'Booking_C');
      bookingGraph.addEdge('Room_202', 'Booking_A'); // Alternative for Booking_A

      // Check room booking conflicts
      const room101Bookings = bookingGraph.getNeighbors('Room_101');
      expect(room101Bookings.length).toBe(2); // Double-booked!

      const room102Bookings = bookingGraph.getNeighbors('Room_102');
      expect(room102Bookings.length).toBe(1); // Properly booked
    });

    test('booking pattern analysis for demand forecasting', () => {
      const bookingPredictor = (bookings: number[]) => {
        const totalBookings = bookings.reduce((sum, b) => sum + b, 0);
        return totalBookings > 50 ? 1 : 0; // High demand indicator
      };

      const weeklyBookings = [
        { itemIndex: 1, delta: 25 }, // Weekday bookings
        { itemIndex: 2, delta: 30 }, // Weekend bookings
      ];

      const demandForecast = obliviousStreamingAlgorithm(
        bookingPredictor,
        0.1, // 10% tolerance
        5,   // Max demand category
        5,   // Booking types
        10,  // Forecast period
        weeklyBookings
      );

      expect(demandForecast).toBe(1); // High demand period detected
    });
  });

  describe('Revenue Management and Pricing', () => {
    test('dynamic pricing optimization with approximation', () => {
      const baseRoomRate = 200;
      const demandMultiplier = 1.5; // High season
      const adjustedRate = baseRoomRate * demandMultiplier;

      const competitorRates = [280, 290, 275];
      const averageCompetitorRate = competitorRates.reduce((sum, rate) => sum + rate, 0) / competitorRates.length;

      // Check if adjusted rate is competitive (within 10% of market)
      const isCompetitive = isMultiplicativeApproximationTwoSided(0.1, averageCompetitorRate, adjustedRate);
      expect(isCompetitive).toBe(true);

      // Test overpricing scenario
      const excessiveRate = 350;
      const isOverpriced = isMultiplicativeApproximationTwoSided(0.1, averageCompetitorRate, excessiveRate);
      expect(isOverpriced).toBe(false);
    });

    test('package deal optimization with correlation clustering', () => {
      const services = [0, 1, 2, 3, 4]; // Room, Dining, Spa, Transport, Entertainment
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Common package combinations
        [1, 2], [1, 3],
      ];
      const negativeEdges: [number, number][] = [
        [2, 3], [3, 4], // Less common combinations
        [0, 4], // Unusual pairings
      ];

      const packageClustering = new CorrelationClustering(services, positiveEdges, negativeEdges);
      const result = packageClustering.greedyCorrelationClustering();

      // Should identify popular service combinations for packages
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(3);
    });
  });

  describe('Guest Preference Analysis', () => {
    test('personalized service recommendations with tree structures', () => {
      // Guest preference hierarchy
      const luxury: TreeNode = { children: [], color: 1 }; // Luxury preferences
      const standard: TreeNode = { children: [], color: 2 }; // Standard preferences
      const budget: TreeNode = { children: [], color: 3 }; // Budget preferences

      const vipGuests: TreeNode = {
        children: [luxury, standard],
        color: undefined
      };

      const regularGuests: TreeNode = {
        children: [standard, budget],
        color: undefined
      };

      const allGuests: TreeNode = {
        children: [vipGuests, regularGuests],
        color: undefined
      };

      const guestPreferences = subtreeMode(allGuests);

      // VIP guests should be luxury-dominated
      expect(guestPreferences.get(vipGuests)).toBe(1);

      // Regular guests should be standard-dominated
      expect(guestPreferences.get(regularGuests)).toBe(2);

      // Overall guest base should be luxury-dominated (from VIP guests)
      expect(guestPreferences.get(allGuests)).toBe(1);
    });

    test('amenity preference correlation with graph analysis', () => {
      const preferenceGraph = new AdjacencyListGraph<string>(false, true);

      // Amenities and guest preferences
      const entities = ['Spa', 'Gym', 'Pool', 'Restaurant', 'Business_Center', 'Guest_A', 'Guest_B', 'Guest_C'];
      entities.forEach(entity => preferenceGraph.addVertex(entity));

      // Guest amenity preferences with satisfaction scores
      preferenceGraph.addEdge('Guest_A', 'Spa', 0.9);
      preferenceGraph.addEdge('Guest_A', 'Pool', 0.8);
      preferenceGraph.addEdge('Guest_B', 'Gym', 0.7);
      preferenceGraph.addEdge('Guest_B', 'Business_Center', 0.8);
      preferenceGraph.addEdge('Guest_C', 'Restaurant', 0.9);
      preferenceGraph.addEdge('Guest_C', 'Spa', 0.6);

      // Check guest preferences
      const guestAPreferences = preferenceGraph.getNeighbors('Guest_A');
      expect(guestAPreferences).toContain('Spa');
      expect(guestAPreferences).toContain('Pool');

      // Verify satisfaction scores
      expect(preferenceGraph.getEdgeWeight('Guest_A', 'Spa')).toBe(0.9);
      expect(preferenceGraph.getEdgeWeight('Guest_C', 'Spa')).toBe(0.6);
    });
  });

  describe('Staff Scheduling Optimization', () => {
    test('shift assignment optimization with correlation clustering', () => {
      const staffMembers = [0, 1, 2, 3, 4, 5];
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Morning shift team
        [1, 2], [1, 3],
        [3, 4], [4, 5], // Evening shift team
      ];
      const negativeEdges: [number, number][] = [
        [0, 4], [1, 5], [2, 3], // Scheduling conflicts
      ];

      const schedulingClustering = new CorrelationClustering(staffMembers, positiveEdges, negativeEdges);
      const result = schedulingClustering.greedyCorrelationClustering();

      // Should optimize shift assignments
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(3);
    });

    test('workload balancing with graph optimization', () => {
      const staffGraph = new AdjacencyListGraph<string>(false, true);

      // Staff members and task assignments
      const entities = ['John', 'Jane', 'Bob', 'Alice', 'Task_CheckIn', 'Task_Cleaning', 'Task_Concierge'];
      entities.forEach(entity => staffGraph.addVertex(entity));

      // Staff task assignments with efficiency ratings
      staffGraph.addEdge('John', 'Task_CheckIn', 0.9);
      staffGraph.addEdge('John', 'Task_Concierge', 0.8);
      staffGraph.addEdge('Jane', 'Task_Cleaning', 0.9);
      staffGraph.addEdge('Jane', 'Task_CheckIn', 0.7);
      staffGraph.addEdge('Bob', 'Task_Concierge', 0.8);
      staffGraph.addEdge('Alice', 'Task_Cleaning', 0.8);

      // Check staff assignments
      const johnTasks = staffGraph.getNeighbors('John');
      expect(johnTasks.length).toBe(2);

      const janeTasks = staffGraph.getNeighbors('Jane');
      expect(janeTasks.length).toBe(2);

      // Verify efficiency ratings
      expect(staffGraph.getEdgeWeight('John', 'Task_CheckIn')).toBe(0.9);
      expect(staffGraph.getEdgeWeight('Jane', 'Task_Cleaning')).toBe(0.9);
    });
  });

  describe('Inventory Management for Amenities', () => {
    test('amenity stock level monitoring with streaming data', () => {
      const inventoryUpdates = [
        { itemIndex: 1, delta: 100 }, // Toiletries
        { itemIndex: 2, delta: 50 },  // Minibar items
        { itemIndex: 1, delta: -20 }, // Toiletries used
        { itemIndex: 3, delta: 75 },  // Linens
        { itemIndex: 2, delta: -10 }, // Minibar items consumed
      ];

      const currentStock = calculateFrequencyVector(5, inventoryUpdates, 5);
      expect(currentStock[0]).toBe(80);  // Toiletries: 100 - 20
      expect(currentStock[1]).toBe(40);  // Minibar: 50 - 10
      expect(currentStock[2]).toBe(75);  // Linens: 75
    });

    test('reorder point calculation with approximation', () => {
      const currentStock = 35; // Current stock level
      const reorderPoint = 30; // Minimum stock level
      const safetyBuffer = 0.2; // 20% safety buffer

      // Check if current stock is above reorder point
      const isAboveReorder = isMultiplicativeApproximationTwoSided(safetyBuffer, reorderPoint, currentStock);
      expect(isAboveReorder).toBe(true);

      // Test critical stock level
      const criticalStock = 15;
      const needsReorder = isMultiplicativeApproximationTwoSided(safetyBuffer, reorderPoint, criticalStock);
      expect(needsReorder).toBe(false);
    });
  });

  describe('Occupancy Forecasting', () => {
    test('seasonal demand prediction with correlation analysis', () => {
      const timePeriods = [0, 1, 2, 3, 4, 5]; // Months/weeks
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Peak season periods
        [1, 2], [1, 3],
      ];
      const negativeEdges: [number, number][] = [
        [2, 3], [3, 4], // Off-peak transitions
        [0, 5], // Seasonal variations
      ];

      const demandClustering = new CorrelationClustering(timePeriods, positiveEdges, negativeEdges);
      const result = demandClustering.greedyCorrelationClustering();

      // Should identify peak vs off-peak demand periods
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(3);
    });

    test('occupancy rate optimization with graph constraints', () => {
      const occupancyGraph = new AdjacencyListGraph<string>(false, true);

      // Room types and booking constraints
      const entities = ['Deluxe_Room', 'Standard_Room', 'Suite', 'Peak_Season', 'Off_Season', 'Business_Travel', 'Leisure_Travel'];
      entities.forEach(entity => occupancyGraph.addVertex(entity));

      // Occupancy constraints and preferences
      occupancyGraph.addEdge('Deluxe_Room', 'Peak_Season', 0.9);
      occupancyGraph.addEdge('Deluxe_Room', 'Business_Travel', 0.8);
      occupancyGraph.addEdge('Standard_Room', 'Off_Season', 0.7);
      occupancyGraph.addEdge('Standard_Room', 'Leisure_Travel', 0.8);
      occupancyGraph.addEdge('Suite', 'Peak_Season', 0.9);
      occupancyGraph.addEdge('Suite', 'Business_Travel', 0.7);

      // Check room type preferences
      const deluxeConstraints = occupancyGraph.getNeighbors('Deluxe_Room');
      expect(deluxeConstraints).toContain('Peak_Season');
      expect(deluxeConstraints).toContain('Business_Travel');

      // Verify preference weights
      expect(occupancyGraph.getEdgeWeight('Deluxe_Room', 'Peak_Season')).toBe(0.9);
      expect(occupancyGraph.getEdgeWeight('Standard_Room', 'Off_Season')).toBe(0.7);
    });
  });

  describe('Customer Segmentation and Loyalty', () => {
    test('guest loyalty tier classification with tree structures', () => {
      // Loyalty tier hierarchy
      const platinum: TreeNode = { children: [], color: 1 }; // Platinum members
      const gold: TreeNode = { children: [], color: 2 }; // Gold members
      const silver: TreeNode = { children: [], color: 3 }; // Silver members

      const frequentGuests: TreeNode = {
        children: [platinum, gold],
        color: undefined
      };

      const occasionalGuests: TreeNode = {
        children: [gold, silver],
        color: undefined
      };

      const guestBase: TreeNode = {
        children: [frequentGuests, occasionalGuests],
        color: undefined
      };

      const loyaltyTiers = subtreeMode(guestBase);

      // Frequent guests should be platinum-dominated
      expect(loyaltyTiers.get(frequentGuests)).toBe(1);

      // Occasional guests should be gold-dominated
      expect(loyaltyTiers.get(occasionalGuests)).toBe(2);

      // Overall guest base should be platinum-dominated (from frequent guests)
      expect(loyaltyTiers.get(guestBase)).toBe(1);
    });

    test('loyalty program optimization with signed graphs', () => {
      const loyaltyGraph = new SignedGraph(6, false); // 6 loyalty program elements

      // Set up loyalty relationships
      loyaltyGraph.addEdge(0, 1, 1);  // Positive loyalty interactions
      loyaltyGraph.addEdge(1, 2, 1);
      loyaltyGraph.addEdge(2, 3, -1); // Negative program elements
      loyaltyGraph.addEdge(3, 4, -1);
      loyaltyGraph.addEdge(0, 5, -1); // Program conflicts

      expect(loyaltyGraph.countPositiveEdges()).toBeGreaterThan(0);
      expect(loyaltyGraph.countNegativeEdges()).toBeGreaterThan(0);

      // Negative program elements should be marked
      expect(loyaltyGraph.getEdgeSign(2, 3)).toBe(-1);
      expect(loyaltyGraph.getEdgeSign(0, 5)).toBe(-1);
    });

    test('LP relaxation for staff scheduling optimization', () => {
      // Staff scheduling as correlation clustering problem
      // Positive edges: staff members who work well together
      // Negative edges: conflicting schedules or preferences
      const staffMembers = [1, 2, 3, 4];
      const positivePairs: [number, number][] = [[1, 2], [2, 3]]; // Compatible staff pairs
      const negativePairs: [number, number][] = [[1, 4], [3, 4]]; // Conflicting schedules

      const lpModel = new CorrelationClusteringLP(staffMembers, positivePairs, negativePairs);

      // Formulate the LP
      const formulation = lpModel.formulateLP();

      // Should have variables for each edge
      expect(formulation.variableNames).toContain('z_1_2');
      expect(formulation.variableNames).toContain('z_2_3');
      expect(formulation.variableNames).toContain('z_1_4');
      expect(formulation.variableNames).toContain('z_3_4');

      // Objective coefficients: +1 for positive edges, -1 for negative edges
      expect(formulation.objectiveCoefficients).toEqual([1, 1, -1, -1]);

      // All variables should be bounded [0,1]
      expect(formulation.variableBounds.every(bound => bound.min === 0 && bound.max === 1)).toBe(true);

      // Get dummy solution (would be replaced with real LP solver)
      const solution = lpModel.solveLP(formulation);

      // Interpret solution to get clustering
      const clustering = lpModel.interpretSolution(solution);

      // Should produce a valid clustering of staff members
      expect(Array.from(clustering.keys())).toEqual(expect.arrayContaining([1, 2, 3, 4]));
      expect(new Set(clustering.values()).size).toBeGreaterThan(0); // At least one cluster
    });
  });

  describe('State Machine Applications in Hotel Management', () => {

    describe('Room Booking and Guest Lifecycle', () => {
      test('room reservation to checkout FSM', () => {
        // States: available, reserved, checked_in, occupied, checked_out, maintenance
        const states = ['available', 'reserved', 'checked_in', 'occupied', 'checked_out', 'maintenance'];
        const alphabet = ['book_room', 'check_in', 'guest_arrives', 'guest_departs', 'check_out', 'schedule_maintenance', 'maintenance_complete'];
        const fsm = new FiniteStateMachine(states, alphabet, 'available', ['checked_out', 'available']);

        // Room lifecycle transitions
        fsm.addTransition('available', 'book_room', 'reserved');
        fsm.addTransition('available', 'schedule_maintenance', 'maintenance');

        fsm.addTransition('reserved', 'check_in', 'checked_in');
        fsm.addTransition('reserved', 'schedule_maintenance', 'maintenance');

        fsm.addTransition('checked_in', 'guest_arrives', 'occupied');

        fsm.addTransition('occupied', 'guest_departs', 'checked_out');

        fsm.addTransition('checked_out', 'check_out', 'available');

        fsm.addTransition('maintenance', 'maintenance_complete', 'available');

        // Test complete guest cycle
        const guestCycle = ['book_room', 'check_in', 'guest_arrives', 'guest_departs', 'check_out'];
        const result = fsm.process(guestCycle);

        expect(result.accepted).toBe(true);
        expect(result.finalState).toBe('available');

        // Test maintenance workflow
        const maintenanceCycle = ['schedule_maintenance', 'maintenance_complete'];
        expect(fsm.accepts(maintenanceCycle)).toBe(true);
      });

      test('booking status tracking DFA', () => {
        // States: tentative, confirmed, guaranteed, cancelled, no_show, completed
        const states = ['tentative', 'confirmed', 'guaranteed', 'cancelled', 'no_show', 'completed'];
        const alphabet = ['deposit_paid', 'full_payment', '24hr_cancel', 'check_in', 'no_show_guest', 'complete_stay'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'tentative', ['completed', 'confirmed', 'guaranteed']);

        // Booking status transitions
        dfa.addDeterministicTransition('tentative', 'deposit_paid', 'confirmed');
        dfa.addDeterministicTransition('tentative', '24hr_cancel', 'cancelled');

        dfa.addDeterministicTransition('confirmed', 'full_payment', 'guaranteed');
        dfa.addDeterministicTransition('confirmed', '24hr_cancel', 'cancelled');
        dfa.addDeterministicTransition('confirmed', 'no_show_guest', 'no_show');

        dfa.addDeterministicTransition('guaranteed', 'check_in', 'completed');
        dfa.addDeterministicTransition('guaranteed', 'no_show_guest', 'no_show');

        dfa.addDeterministicTransition('completed', 'complete_stay', 'completed');

        dfa.addDeterministicTransition('cancelled', 'deposit_paid', 'cancelled'); // Can't recover
        dfa.addDeterministicTransition('no_show', 'check_in', 'no_show'); // Too late

        // Test successful booking completion
        const successfulBooking = ['deposit_paid', 'full_payment', 'check_in', 'complete_stay'];
        expect(dfa.accepts(successfulBooking)).toBe(true);

        // Test booking cancellation
        const cancelledBooking = ['24hr_cancel'];
        expect(dfa.accepts(cancelledBooking)).toBe(false); // cancelled is not accepting

        // Test no-show scenario
        const noShowBooking = ['deposit_paid', 'no_show_guest'];
        expect(dfa.accepts(noShowBooking)).toBe(false); // no_show is not accepting
      });
    });

    describe('Guest Service Request Processing', () => {
      test('service request fulfillment FSM', () => {
        // States: requested, acknowledged, assigned, in_progress, completed, escalated
        const states = ['requested', 'acknowledged', 'assigned', 'in_progress', 'completed', 'escalated'];
        const alphabet = ['acknowledge', 'assign_staff', 'start_work', 'complete_work', 'escalate_issue', 'resolve_escalation'];
        const fsm = new FiniteStateMachine(states, alphabet, 'requested', ['completed']);

        // Service request transitions
        fsm.addTransition('requested', 'acknowledge', 'acknowledged');

        fsm.addTransition('acknowledged', 'assign_staff', 'assigned');
        fsm.addTransition('acknowledged', 'escalate_issue', 'escalated');

        fsm.addTransition('assigned', 'start_work', 'in_progress');

        fsm.addTransition('in_progress', 'complete_work', 'completed');
        fsm.addTransition('in_progress', 'escalate_issue', 'escalated');

        fsm.addTransition('escalated', 'assign_staff', 'assigned');
        fsm.addTransition('escalated', 'resolve_escalation', 'completed');

        fsm.addTransition('completed', 'complete_work', 'completed');

        // Test normal service completion
        const normalService = ['acknowledge', 'assign_staff', 'start_work', 'complete_work'];
        const result = fsm.process(normalService);

        expect(result.accepted).toBe(true);
        expect(result.finalState).toBe('completed');

        // Test escalated service
        const escalatedService = ['acknowledge', 'escalate_issue', 'resolve_escalation'];
        expect(fsm.accepts(escalatedService)).toBe(true);
      });

      test('housekeeping task automation DFA', () => {
        // States: scheduled, in_progress, quality_check, completed, needs_redo
        const states = ['scheduled', 'in_progress', 'quality_check', 'completed', 'needs_redo'];
        const alphabet = ['start_cleaning', 'finish_cleaning', 'pass_inspection', 'fail_inspection', 'redo_cleaning'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'scheduled', ['completed']);

        // Housekeeping transitions
        dfa.addDeterministicTransition('scheduled', 'start_cleaning', 'in_progress');

        dfa.addDeterministicTransition('in_progress', 'finish_cleaning', 'quality_check');

        dfa.addDeterministicTransition('quality_check', 'pass_inspection', 'completed');
        dfa.addDeterministicTransition('quality_check', 'fail_inspection', 'needs_redo');

        dfa.addDeterministicTransition('needs_redo', 'redo_cleaning', 'in_progress');

        dfa.addDeterministicTransition('completed', 'start_cleaning', 'completed'); // Can be reassigned

        // Test successful cleaning
        const successfulCleaning = ['start_cleaning', 'finish_cleaning', 'pass_inspection'];
        expect(dfa.accepts(successfulCleaning)).toBe(true);

        // Test cleaning that needs redo
        const needsRedo = ['start_cleaning', 'finish_cleaning', 'fail_inspection', 'redo_cleaning', 'finish_cleaning', 'pass_inspection'];
        expect(dfa.accepts(needsRedo)).toBe(true);

        // Test failed cleaning
        const failedCleaning = ['start_cleaning', 'finish_cleaning', 'fail_inspection'];
        expect(dfa.accepts(failedCleaning)).toBe(false); // needs_redo is not accepting
      });
    });

    describe('Maintenance and Facilities Management', () => {
      test('maintenance request processing with Turing machine', () => {
        // TM that processes maintenance requests and prioritizes them
        const states = ['q0', 'q1', 'q2', 'q_assign', 'q_complete'];
        const tapeAlphabet = ['U', 'N', 'E', 'P', 'B']; // Urgent, Normal, Electrical, Plumbing, Blank
        const tm = new TuringMachine(states, tapeAlphabet, 'B', 'q0', ['q_assign', 'q_complete'], []);

        // Transitions for maintenance prioritization
        tm.addTransition('q0', 'U', 'q_assign', 'U', 'R'); // Urgent requests go directly to assignment
        tm.addTransition('q0', 'N', 'q1', 'N', 'R'); // Normal requests need evaluation
        tm.addTransition('q0', 'E', 'q2', 'E', 'R'); // Electrical issues
        tm.addTransition('q0', 'P', 'q2', 'P', 'R'); // Plumbing issues
        tm.addTransition('q0', 'B', 'q_complete', 'B', 'S'); // End of requests

        tm.addTransition('q1', 'U', 'q_assign', 'U', 'R'); // Upgrade to urgent
        tm.addTransition('q1', 'N', 'q1', 'N', 'R'); // Keep as normal
        tm.addTransition('q1', 'E', 'q_assign', 'E', 'R'); // Electrical is urgent
        tm.addTransition('q1', 'P', 'q_assign', 'P', 'R'); // Plumbing is urgent
        tm.addTransition('q1', 'B', 'q_assign', 'B', 'S'); // Assign normal requests

        tm.addTransition('q2', 'U', 'q_assign', 'U', 'S'); // Any urgent overrides
        tm.addTransition('q2', 'N', 'q_assign', 'N', 'S'); // Assign specialized work
        tm.addTransition('q2', 'E', 'q_assign', 'E', 'S');
        tm.addTransition('q2', 'P', 'q_assign', 'P', 'S');
        tm.addTransition('q2', 'B', 'q_assign', 'B', 'S');

        // Test urgent maintenance
        const urgentRequest = ['U', 'E'];
        const urgentResult = tm.run(urgentRequest, 10);
        expect(urgentResult.accepted).toBe(true); // Should assign immediately

        // Test normal maintenance
        const normalRequest = ['N', 'P'];
        const normalResult = tm.run(normalRequest, 10);
        expect(normalResult.accepted).toBe(true); // Should assign

        // Test specialized electrical work
        const electricalWork = ['E'];
        const electricalResult = tm.run(electricalWork, 10);
        expect(electricalResult.accepted).toBe(true); // Should assign
      });

      test('facility inspection automation DFA', () => {
        // States: scheduled, in_progress, passed, failed, needs_repair
        const states = ['scheduled', 'in_progress', 'passed', 'failed', 'needs_repair'];
        const alphabet = ['start_inspection', 'check_item', 'item_pass', 'item_fail', 'schedule_repair', 'repair_complete'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'scheduled', ['passed', 'repair_complete']);

        // Facility inspection transitions
        dfa.addDeterministicTransition('scheduled', 'start_inspection', 'in_progress');

        dfa.addDeterministicTransition('in_progress', 'item_pass', 'passed');
        dfa.addDeterministicTransition('in_progress', 'item_fail', 'failed');

        dfa.addDeterministicTransition('failed', 'schedule_repair', 'needs_repair');

        dfa.addDeterministicTransition('needs_repair', 'repair_complete', 'passed');

        dfa.addDeterministicTransition('passed', 'check_item', 'passed'); // Continue checking

        // Test passed inspection
        const passedInspection = ['start_inspection', 'item_pass', 'item_pass'];
        expect(dfa.accepts(passedInspection)).toBe(true);

        // Test failed inspection with repair
        const failedWithRepair = ['start_inspection', 'item_fail', 'schedule_repair', 'repair_complete'];
        expect(dfa.accepts(failedWithRepair)).toBe(true);

        // Test failed inspection without repair
        const failedNoRepair = ['start_inspection', 'item_fail'];
        expect(dfa.accepts(failedNoRepair)).toBe(false); // failed is not accepting
      });
    });

    describe('Guest Profile and Preference Management', () => {
      test('guest preference learning FSM', () => {
        // States: new_guest, learning, personalized, vip_status
        const states = ['new_guest', 'learning', 'personalized', 'vip_status'];
        const alphabet = ['check_in', 'request_service', 'repeat_preference', 'high_spending', 'complaint', 'compliment'];
        const fsm = new FiniteStateMachine(states, alphabet, 'new_guest', ['personalized', 'vip_status']);

        // Guest preference learning transitions
        fsm.addTransition('new_guest', 'check_in', 'learning');

        fsm.addTransition('learning', 'request_service', 'learning');
        fsm.addTransition('learning', 'repeat_preference', 'personalized');
        fsm.addTransition('learning', 'high_spending', 'personalized');
        fsm.addTransition('learning', 'complaint', 'learning'); // Complaints don't help learning

        fsm.addTransition('personalized', 'repeat_preference', 'personalized');
        fsm.addTransition('personalized', 'high_spending', 'vip_status');
        fsm.addTransition('personalized', 'compliment', 'vip_status');

        fsm.addTransition('vip_status', 'request_service', 'vip_status');
        fsm.addTransition('vip_status', 'high_spending', 'vip_status');
        fsm.addTransition('vip_status', 'compliment', 'vip_status');

        // Test guest progression to VIP
        const vipJourney = ['check_in', 'repeat_preference', 'high_spending', 'compliment'];
        const result = fsm.process(vipJourney);

        expect(result.accepted).toBe(true);
        expect(result.finalState).toBe('vip_status');

        // Test guest staying personalized
        const personalizedGuest = ['check_in', 'repeat_preference'];
        expect(fsm.accepts(personalizedGuest)).toBe(true);
      });

      test('loyalty points calculation with lexical analyzer', () => {
        const analyzer = new LexicalAnalyzer();

        const bookingRecord = "Guest John Doe: 3 nights at $200/night, spa treatment $150, restaurant $75.";
        const tokens = analyzer.tokenize(bookingRecord);

        // Should identify monetary values and services
        const numbers = tokens.filter(t => t.type === 'number');
        expect(numbers.some(n => n.value === '3')).toBe(true); // Nights
        expect(numbers.some(n => n.value === '200')).toBe(true); // Room rate
        expect(numbers.some(n => n.value === '150')).toBe(true); // Spa

        const identifiers = tokens.filter(t => t.type === 'identifier');
        expect(identifiers.some(id => id.value === 'spa')).toBe(true);
        expect(identifiers.some(id => id.value === 'restaurant')).toBe(true);
      });
    });

    describe('Hotel Operations Automation', () => {
      test('check-in process validation with regex compiler', () => {
        const reservationCodeRegex = new RegexCompiler('ab'); // Simple pattern for testing
        const dfa = reservationCodeRegex.compile();

        // Test valid reservation codes using simple pattern
        expect(dfa.accepts(['a', 'b'])).toBe(true);
        expect(dfa.accepts(['a'])).toBe(false); // Incomplete

        // Test with hello pattern
        const helloRegex = new RegexCompiler('hello');
        const helloDfa = helloRegex.compile();
        expect(helloDfa.accepts(['h', 'e', 'l', 'l', 'o'])).toBe(true);
      });

      test('energy management system DFA', () => {
        // States: occupied, vacant, standby, maintenance
        const states = ['occupied', 'vacant', 'standby', 'maintenance'];
        const alphabet = ['guest_present', 'guest_departs', 'timeout_15min', 'timeout_2hr', 'schedule_maintenance', 'maintenance_complete', 'override'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'vacant', ['occupied', 'vacant', 'standby']);

        // Energy management transitions
        dfa.addDeterministicTransition('vacant', 'guest_present', 'occupied');
        dfa.addDeterministicTransition('vacant', 'schedule_maintenance', 'maintenance');

        dfa.addDeterministicTransition('occupied', 'guest_departs', 'standby');
        dfa.addDeterministicTransition('occupied', 'override', 'occupied');

        dfa.addDeterministicTransition('standby', 'guest_present', 'occupied');
        dfa.addDeterministicTransition('standby', 'timeout_2hr', 'vacant');
        dfa.addDeterministicTransition('standby', 'override', 'occupied');

        dfa.addDeterministicTransition('maintenance', 'maintenance_complete', 'vacant');
        dfa.addDeterministicTransition('maintenance', 'override', 'occupied');

        // Test normal occupancy cycle
        const normalCycle = ['guest_present', 'guest_departs', 'timeout_2hr'];
        expect(dfa.accepts(normalCycle)).toBe(true);

        // Test quick return
        const quickReturn = ['guest_present', 'guest_departs', 'guest_present'];
        expect(dfa.accepts(quickReturn)).toBe(true);

        // Test maintenance mode
        const maintenanceMode = ['schedule_maintenance', 'maintenance_complete'];
        expect(dfa.accepts(maintenanceMode)).toBe(true);
      });
    });

  });

});
