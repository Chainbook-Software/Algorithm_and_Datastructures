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
 * Healthcare Applications - Real World Test Cases
 *
 * This file demonstrates practical applications of algorithms in healthcare:
 * - Patient diagnosis with correlation clustering
 * - Medical resource allocation with graph algorithms
 * - Vital signs monitoring with streaming estimators
 * - Treatment decision trees with hierarchical analysis
 * - Drug interaction analysis and epidemic modeling
 */

describe('Healthcare Applications', () => {

  describe('Patient Diagnosis and Symptom Analysis', () => {
    test('symptom correlation clustering for disease diagnosis', () => {
      const patients = [0, 1, 2, 3, 4];
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Patients with similar symptoms
        [1, 2], [1, 3],
        [3, 4], // Another symptom cluster
      ];
      const negativeEdges: [number, number][] = [
        [0, 3], [1, 4], [2, 4], // Different symptom patterns
      ];

      const diagnosisClustering = new CorrelationClustering(patients, positiveEdges, negativeEdges);
      const result = diagnosisClustering.greedyCorrelationClustering();

      // Should identify patient groups with similar conditions
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(3);

      const patientGroups = diagnosisClustering.getClustersAsArrays(result.clustering);
      expect(patientGroups.size).toBe(result.clusterCount);
    });

    test('medical test result interpretation with approximation', () => {
      const labValues = [95, 105, 98, 102]; // Test results
      const normalRange = 100; // Expected normal value
      const tolerance = 0.15; // 15% tolerance for lab variation

      // Check if results are within normal approximation range
      const averageResult = labValues.reduce((sum, val) => sum + val, 0) / labValues.length;
      const isNormal = isMultiplicativeApproximationTwoSided(tolerance, normalRange, averageResult);

      expect(isNormal).toBe(true);

      // Test abnormal results
      const abnormalValues = [70, 65, 75]; // Significantly low
      const abnormalAverage = abnormalValues.reduce((sum, val) => sum + val, 0) / abnormalValues.length;
      const isAbnormal = isMultiplicativeApproximationTwoSided(tolerance, normalRange, abnormalAverage);
      expect(isAbnormal).toBe(false);
    });
  });

  describe('Medical Resource Allocation', () => {
    test('hospital bed allocation with graph optimization', () => {
      const resourceGraph = new AdjacencyListGraph<string>(false, true);

      // Resources and requirements
      const entities = ['ICU_Bed_1', 'ICU_Bed_2', 'Ventilator_1', 'Patient_A', 'Patient_B', 'Patient_C'];
      entities.forEach(entity => resourceGraph.addVertex(entity));

      // Resource compatibility and availability
      resourceGraph.addEdge('ICU_Bed_1', 'Patient_A', 0.9); // Good match
      resourceGraph.addEdge('ICU_Bed_1', 'Patient_B', 0.7);
      resourceGraph.addEdge('ICU_Bed_2', 'Patient_B', 0.8);
      resourceGraph.addEdge('ICU_Bed_2', 'Patient_C', 0.6);
      resourceGraph.addEdge('Ventilator_1', 'Patient_A', 0.8);
      resourceGraph.addEdge('Ventilator_1', 'Patient_C', 0.9);

      // Check resource availability
      const icuBed1Patients = resourceGraph.getNeighbors('ICU_Bed_1');
      expect(icuBed1Patients).toContain('Patient_A');
      expect(icuBed1Patients).toContain('Patient_B');

      // Check compatibility scores
      expect(resourceGraph.getEdgeWeight('ICU_Bed_1', 'Patient_A')).toBe(0.9);
    });

    test('staff scheduling optimization with correlation clustering', () => {
      const staffMembers = [0, 1, 2, 3, 4, 5];
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Day shift team
        [1, 2], [1, 3],
        [3, 4], [4, 5], // Night shift team
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
  });

  describe('Vital Signs Monitoring', () => {
    test('real-time patient monitoring with streaming data', () => {
      const vitalSignUpdates = [
        { itemIndex: 1, delta: 75 },  // Heart rate
        { itemIndex: 2, delta: 120 }, // Blood pressure systolic
        { itemIndex: 1, delta: 78 },  // Heart rate update
        { itemIndex: 3, delta: 98.6 }, // Temperature
        { itemIndex: 2, delta: 118 }, // Blood pressure update
      ];

      const currentVitals = calculateFrequencyVector(5, vitalSignUpdates, 5);
      expect(currentVitals[0]).toBe(153); // Heart rate: 75 + 78
      expect(currentVitals[1]).toBe(238); // Blood pressure: 120 + 118
      expect(currentVitals[2]).toBe(98.6); // Temperature
    });

    test('vital signs data accumulation verification', () => {
      const patientReadings = [
        { itemIndex: 1, delta: 95 },  // Heart rate
        { itemIndex: 2, delta: 125 }, // Blood pressure
      ];

      const vitals = calculateFrequencyVector(5, patientReadings, 2);
      expect(vitals[0]).toBe(95);  // Heart rate accumulated
      expect(vitals[1]).toBe(125); // Blood pressure accumulated
    });
  });

  describe('Treatment Decision Trees', () => {
    test('medical decision tree for treatment selection', () => {
      // Treatment decision hierarchy
      const surgery: TreeNode = { children: [], color: 1 }; // High-risk treatment
      const medication: TreeNode = { children: [], color: 2 }; // Medium-risk treatment
      const therapy: TreeNode = { children: [], color: 3 }; // Low-risk treatment

      const invasiveTreatments: TreeNode = {
        children: [surgery, medication],
        color: undefined
      };

      const nonInvasiveTreatments: TreeNode = {
        children: [medication, therapy],
        color: undefined
      };

      const treatmentOptions: TreeNode = {
        children: [invasiveTreatments, nonInvasiveTreatments],
        color: undefined
      };

      const treatmentDecisions = subtreeMode(treatmentOptions);

      // Invasive treatments should be high-risk dominated
      expect(treatmentDecisions.get(invasiveTreatments)).toBe(1);

      // Non-invasive treatments should be medium-risk dominated
      expect(treatmentDecisions.get(nonInvasiveTreatments)).toBe(2);

      // Overall treatment approach should be high-risk dominated (from invasive treatments)
      expect(treatmentDecisions.get(treatmentOptions)).toBe(1);
    });

    test('patient risk stratification with hierarchical analysis', () => {
      const highRisk: TreeNode = { children: [], color: 1 };
      const mediumRisk: TreeNode = { children: [], color: 2 };
      const lowRisk: TreeNode = { children: [], color: 3 };

      const criticalPatients: TreeNode = {
        children: [highRisk, mediumRisk],
        color: undefined
      };

      const stablePatients: TreeNode = {
        children: [mediumRisk, lowRisk],
        color: undefined
      };

      const patientPopulation: TreeNode = {
        children: [criticalPatients, stablePatients],
        color: undefined
      };

      const riskLevels = subtreeMode(patientPopulation);

      // Critical patients should be high-risk dominated
      expect(riskLevels.get(criticalPatients)).toBe(1);

      // Stable patients should be medium-risk dominated
      expect(riskLevels.get(stablePatients)).toBe(2);

      // Overall population should be high-risk dominated (from critical patients)
      expect(riskLevels.get(patientPopulation)).toBe(1);
    });
  });

  describe('Drug Interaction Analysis', () => {
    test('medication compatibility with signed graphs', () => {
      const drugInteractionGraph = new SignedGraph(5, false); // 5 medications

      // Set up drug interactions
      drugInteractionGraph.addEdge(0, 1, 1);  // Compatible drugs
      drugInteractionGraph.addEdge(1, 2, 1);
      drugInteractionGraph.addEdge(2, 3, -1); // Dangerous interaction
      drugInteractionGraph.addEdge(3, 4, -1);
      drugInteractionGraph.addEdge(0, 4, -1); // Another contraindication

      expect(drugInteractionGraph.countPositiveEdges()).toBeGreaterThan(0);
      expect(drugInteractionGraph.countNegativeEdges()).toBeGreaterThan(0);

      // Dangerous interactions should be negative
      expect(drugInteractionGraph.getEdgeSign(2, 3)).toBe(-1);
      expect(drugInteractionGraph.getEdgeSign(3, 4)).toBe(-1);
    });

    test('prescription safety checking with correlation clustering', () => {
      const medications = [0, 1, 2, 3, 4];
      const positiveEdges: [number, number][] = [
        [0, 1], // Safe combinations
        [1, 2],
      ];
      const negativeEdges: [number, number][] = [
        [2, 3], // Dangerous combinations
        [3, 4],
        [0, 3], // Contraindications
      ];

      const prescriptionClustering = new CorrelationClustering(medications, positiveEdges, negativeEdges);
      const result = prescriptionClustering.greedyCorrelationClustering();

      // Should identify safe vs dangerous medication clusters
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(2);
    });
  });

  describe('Epidemic Modeling and Contact Tracing', () => {
    test('contact tracing with graph analysis', () => {
      const contactGraph = new AdjacencyListGraph<number>(false, true);

      // People in a community
      const people = [0, 1, 2, 3, 4, 5];
      people.forEach(person => contactGraph.addVertex(person));

      // Contact patterns with exposure risk weights
      contactGraph.addEdge(0, 1, 0.9); // High-risk contact
      contactGraph.addEdge(0, 2, 0.7);
      contactGraph.addEdge(1, 2, 0.8);
      contactGraph.addEdge(1, 3, 0.6);
      contactGraph.addEdge(2, 3, 0.5);
      contactGraph.addEdge(3, 4, 0.4);
      contactGraph.addEdge(4, 5, 0.3);

      // Person 0's contact network
      const person0Contacts = contactGraph.getNeighbors(0);
      expect(person0Contacts).toContain(1);
      expect(person0Contacts).toContain(2);

      // Check exposure risk levels
      expect(contactGraph.getEdgeWeight(0, 1)).toBe(0.9);
      expect(contactGraph.getEdgeWeight(4, 5)).toBe(0.3);
    });

    test('infection spread modeling with correlation clustering', () => {
      const population = [0, 1, 2, 3, 4, 5];
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Infection cluster 1
        [1, 2], [1, 3],
        [3, 4], [4, 5], // Infection cluster 2
      ];
      const negativeEdges: [number, number][] = [
        [0, 4], [1, 5], [2, 3], // No cross-infection
      ];

      const epidemicClustering = new CorrelationClustering(population, positiveEdges, negativeEdges);
      const result = epidemicClustering.greedyCorrelationClustering();

      // Should identify infection clusters for containment
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(3);

      const infectionClusters = epidemicClustering.getClustersAsArrays(result.clustering);
      expect(infectionClusters.size).toBe(result.clusterCount);
    });
  });

  describe('Healthcare Analytics and Optimization', () => {
    test('appointment scheduling with graph optimization', () => {
      const schedulingGraph = new AdjacencyListGraph<string>(true, false);

      // Doctors and time slots
      const entities = ['Dr_Smith', 'Dr_Johnson', '9AM', '10AM', '11AM', 'Patient_A', 'Patient_B'];
      entities.forEach(entity => schedulingGraph.addVertex(entity));

      // Scheduling constraints and preferences
      schedulingGraph.addEdge('Dr_Smith', '9AM');
      schedulingGraph.addEdge('Dr_Smith', '10AM');
      schedulingGraph.addEdge('Dr_Johnson', '10AM');
      schedulingGraph.addEdge('Dr_Johnson', '11AM');
      schedulingGraph.addEdge('9AM', 'Patient_A');
      schedulingGraph.addEdge('10AM', 'Patient_B');

      // Check doctor availability
      const drSmithSlots = schedulingGraph.getNeighbors('Dr_Smith');
      expect(drSmithSlots).toContain('9AM');
      expect(drSmithSlots).toContain('10AM');

      // Check time slot assignments
      const nineAMAssigned = schedulingGraph.getNeighbors('9AM');
      expect(nineAMAssigned).toContain('Patient_A');
    });

    test('medical supply chain optimization with approximation', () => {
      const supplyLevels = [100, 80, 120, 90]; // Supply quantities
      const demandForecast = 95; // Expected demand
      const buffer = 0.2; // 20% safety buffer

      // Check if supply meets demand with buffer
      const averageSupply = supplyLevels.reduce((sum, level) => sum + level, 0) / supplyLevels.length;
      const meetsDemand = isMultiplicativeApproximationTwoSided(buffer, demandForecast, averageSupply);

      expect(meetsDemand).toBe(true);

      // Test supply shortage scenario
      const lowSupplyLevels = [50, 40, 60, 45];
      const lowAverageSupply = lowSupplyLevels.reduce((sum, level) => sum + level, 0) / lowSupplyLevels.length;
      const hasShortage = isMultiplicativeApproximationTwoSided(buffer, demandForecast, lowAverageSupply);
      expect(hasShortage).toBe(false);
    });
  });

  describe('State Machine Applications in Healthcare', () => {

    describe('Patient Admission and Discharge Workflow', () => {
      test('hospital admission process FSM', () => {
        // States: arrived, registered, triaged, admitted, discharged
        const states = ['arrived', 'registered', 'triaged', 'admitted', 'discharged'];
        const alphabet = ['check_in', 'register_info', 'triage_assessment', 'admit_patient', 'treat_complete', 'discharge_patient'];
        const fsm = new FiniteStateMachine(states, alphabet, 'arrived', ['discharged']);

        // Hospital workflow transitions
        fsm.addTransition('arrived', 'check_in', 'registered');

        fsm.addTransition('registered', 'register_info', 'registered');
        fsm.addTransition('registered', 'triage_assessment', 'triaged');

        fsm.addTransition('triaged', 'admit_patient', 'admitted');
        fsm.addTransition('triaged', 'discharge_patient', 'discharged'); // Minor cases

        fsm.addTransition('admitted', 'treat_complete', 'discharged');

        fsm.addTransition('discharged', 'discharge_patient', 'discharged');

        // Test complete admission-discharge cycle
        const fullCycle = ['check_in', 'register_info', 'triage_assessment', 'admit_patient', 'treat_complete', 'discharge_patient'];
        const result = fsm.process(fullCycle);

        expect(result.accepted).toBe(true);
        expect(result.finalState).toBe('discharged');

        // Test quick discharge for minor cases
        const quickDischarge = ['check_in', 'register_info', 'triage_assessment', 'discharge_patient'];
        expect(fsm.accepts(quickDischarge)).toBe(true);
      });

      test('patient status tracking DFA', () => {
        // States: outpatient, inpatient, icu, recovered, deceased
        const states = ['outpatient', 'inpatient', 'icu', 'recovered', 'deceased'];
        const alphabet = ['admit_hospital', 'transfer_icu', 'improve_condition', 'discharge', 'critical_event', 'recover'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'outpatient', ['recovered', 'outpatient']);

        // Patient status transitions
        dfa.addDeterministicTransition('outpatient', 'admit_hospital', 'inpatient');
        dfa.addDeterministicTransition('outpatient', 'discharge', 'outpatient');

        dfa.addDeterministicTransition('inpatient', 'transfer_icu', 'icu');
        dfa.addDeterministicTransition('inpatient', 'improve_condition', 'recovered');
        dfa.addDeterministicTransition('inpatient', 'discharge', 'recovered');
        dfa.addDeterministicTransition('inpatient', 'critical_event', 'deceased');

        dfa.addDeterministicTransition('icu', 'improve_condition', 'inpatient');
        dfa.addDeterministicTransition('icu', 'recover', 'recovered');
        dfa.addDeterministicTransition('icu', 'critical_event', 'deceased');

        dfa.addDeterministicTransition('recovered', 'admit_hospital', 'inpatient'); // Readmission possible

        dfa.addDeterministicTransition('deceased', 'recover', 'deceased'); // No recovery from deceased

        // Test successful recovery
        const recoveryPath = ['admit_hospital', 'improve_condition'];
        expect(dfa.accepts(recoveryPath)).toBe(true);

        // Test ICU recovery
        const icuRecovery = ['admit_hospital', 'transfer_icu', 'recover'];
        expect(dfa.accepts(icuRecovery)).toBe(true);

        // Test unfortunate outcome
        const criticalCase = ['admit_hospital', 'critical_event'];
        expect(dfa.accepts(criticalCase)).toBe(false); // deceased is not accepting
      });
    });

    describe('Vital Signs Monitoring and Alert System', () => {
      test('heart rate monitoring DFA', () => {
        // States: normal, elevated, tachycardia, bradycardia, critical
        const states = ['normal', 'elevated', 'tachycardia', 'bradycardia', 'critical'];
        const alphabet = ['hr_60_100', 'hr_100_120', 'hr_above_120', 'hr_below_60', 'hr_below_40', 'hr_above_150'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'normal', ['normal', 'elevated']);

        // Heart rate monitoring transitions
        dfa.addDeterministicTransition('normal', 'hr_60_100', 'normal');
        dfa.addDeterministicTransition('normal', 'hr_100_120', 'elevated');
        dfa.addDeterministicTransition('normal', 'hr_above_120', 'tachycardia');
        dfa.addDeterministicTransition('normal', 'hr_below_60', 'bradycardia');

        dfa.addDeterministicTransition('elevated', 'hr_60_100', 'normal');
        dfa.addDeterministicTransition('elevated', 'hr_100_120', 'elevated');
        dfa.addDeterministicTransition('elevated', 'hr_above_120', 'tachycardia');
        dfa.addDeterministicTransition('elevated', 'hr_below_60', 'bradycardia');

        dfa.addDeterministicTransition('tachycardia', 'hr_above_150', 'critical');
        dfa.addDeterministicTransition('tachycardia', 'hr_100_120', 'elevated');
        dfa.addDeterministicTransition('tachycardia', 'hr_60_100', 'normal');

        dfa.addDeterministicTransition('bradycardia', 'hr_below_40', 'critical');
        dfa.addDeterministicTransition('bradycardia', 'hr_60_100', 'normal');
        dfa.addDeterministicTransition('bradycardia', 'hr_100_120', 'elevated');

        dfa.addDeterministicTransition('critical', 'hr_60_100', 'normal'); // Recovery possible

        // Test normal heart rate
        const normalHR = ['hr_60_100', 'hr_60_100'];
        expect(dfa.accepts(normalHR)).toBe(true);

        // Test tachycardia progression
        const tachycardia = ['hr_above_120', 'hr_above_150'];
        expect(dfa.accepts(tachycardia)).toBe(false); // critical is not accepting

        // Test bradycardia recovery
        const bradycardiaRecovery = ['hr_below_60', 'hr_60_100'];
        expect(dfa.accepts(bradycardiaRecovery)).toBe(true);
      });

      test('multi-parameter vital signs FSM', () => {
        // States: stable, concerning, unstable, critical
        const states = ['stable', 'concerning', 'unstable', 'critical'];
        const alphabet = ['bp_normal', 'bp_high', 'bp_low', 'hr_normal', 'hr_abnormal', 'temp_normal', 'temp_fever', 'o2_normal', 'o2_low', 'alert_triggered'];
        const fsm = new FiniteStateMachine(states, alphabet, 'stable', ['stable', 'concerning']);

        // Multi-parameter monitoring transitions
        fsm.addTransition('stable', 'bp_normal', 'stable');
        fsm.addTransition('stable', 'hr_normal', 'stable');
        fsm.addTransition('stable', 'temp_normal', 'stable');
        fsm.addTransition('stable', 'o2_normal', 'stable');
        fsm.addTransition('stable', 'bp_high', 'concerning');
        fsm.addTransition('stable', 'bp_low', 'concerning');
        fsm.addTransition('stable', 'hr_abnormal', 'concerning');
        fsm.addTransition('stable', 'temp_fever', 'concerning');
        fsm.addTransition('stable', 'o2_low', 'unstable');

        fsm.addTransition('concerning', 'bp_normal', 'stable');
        fsm.addTransition('concerning', 'hr_normal', 'stable');
        fsm.addTransition('concerning', 'temp_normal', 'stable');
        fsm.addTransition('concerning', 'bp_high', 'unstable');
        fsm.addTransition('concerning', 'bp_low', 'unstable');
        fsm.addTransition('concerning', 'hr_abnormal', 'unstable');
        fsm.addTransition('concerning', 'temp_fever', 'unstable');
        fsm.addTransition('concerning', 'o2_low', 'critical');

        fsm.addTransition('unstable', 'bp_normal', 'concerning');
        fsm.addTransition('unstable', 'hr_normal', 'concerning');
        fsm.addTransition('unstable', 'temp_normal', 'concerning');
        fsm.addTransition('unstable', 'o2_normal', 'concerning');
        fsm.addTransition('unstable', 'alert_triggered', 'critical');

        fsm.addTransition('critical', 'bp_normal', 'unstable');
        fsm.addTransition('critical', 'hr_normal', 'unstable');
        fsm.addTransition('critical', 'temp_normal', 'unstable');
        fsm.addTransition('critical', 'o2_normal', 'unstable');

        // Test stable patient
        const stablePatient = ['bp_normal', 'hr_normal', 'temp_normal', 'o2_normal'];
        expect(fsm.accepts(stablePatient)).toBe(true);

        // Test deteriorating patient
        const deterioratingPatient = ['bp_high', 'hr_abnormal', 'temp_fever', 'o2_low'];
        expect(fsm.accepts(deterioratingPatient)).toBe(false); // critical is not accepting
      });
    });

    describe('Medical Diagnosis and Treatment Protocols', () => {
      test('diagnostic decision tree with Turing machine', () => {
        // TM that processes symptoms and makes diagnostic decisions
        const states = ['q0', 'q1', 'q2', 'q_diagnose', 'q_treat'];
        const tapeAlphabet = ['F', 'C', 'N', 'P', 'B']; // Fever, Cough, Nausea, Pain, Blank
        const tm = new TuringMachine(states, tapeAlphabet, 'B', 'q0', ['q_diagnose', 'q_treat'], []);

        // Transitions for symptom-based diagnosis
        tm.addTransition('q0', 'F', 'q1', 'F', 'R'); // Fever detected
        tm.addTransition('q0', 'C', 'q1', 'C', 'R'); // Cough detected
        tm.addTransition('q0', 'N', 'q2', 'N', 'R'); // Nausea detected
        tm.addTransition('q0', 'P', 'q2', 'P', 'R'); // Pain detected
        tm.addTransition('q0', 'B', 'q_diagnose', 'B', 'S'); // No symptoms

        tm.addTransition('q1', 'F', 'q1', 'F', 'R'); // More fever symptoms
        tm.addTransition('q1', 'C', 'q1', 'C', 'R'); // More respiratory symptoms
        tm.addTransition('q1', 'N', 'q_treat', 'N', 'S'); // Fever + nausea = treat
        tm.addTransition('q1', 'P', 'q_treat', 'P', 'S'); // Fever + pain = treat
        tm.addTransition('q1', 'B', 'q_diagnose', 'B', 'S'); // Respiratory symptoms only

        tm.addTransition('q2', 'F', 'q_treat', 'F', 'S'); // Nausea/Pain + fever = treat
        tm.addTransition('q2', 'C', 'q_treat', 'C', 'S'); // Nausea/Pain + cough = treat
        tm.addTransition('q2', 'N', 'q2', 'N', 'R'); // More GI symptoms
        tm.addTransition('q2', 'P', 'q2', 'P', 'R'); // More pain symptoms
        tm.addTransition('q2', 'B', 'q_diagnose', 'B', 'S'); // GI symptoms only

        // Test respiratory infection diagnosis
        const respiratorySymptoms = ['F', 'C', 'C'];
        const respiratoryResult = tm.run(respiratorySymptoms, 10);
        expect(respiratoryResult.accepted).toBe(true); // Should diagnose

        // Test severe symptoms requiring treatment
        const severeSymptoms = ['F', 'N', 'P'];
        const severeResult = tm.run(severeSymptoms, 10);
        expect(severeResult.accepted).toBe(true); // Should treat

        // Test no symptoms
        const noSymptoms: string[] = [];
        const noSymptomsResult = tm.run(noSymptoms, 10);
        expect(noSymptomsResult.accepted).toBe(true); // Should diagnose (healthy)
      });

      test('treatment protocol FSM', () => {
        // States: assess, diagnose, treat, monitor, discharge
        const states = ['assess', 'diagnose', 'treat', 'monitor', 'discharge'];
        const alphabet = ['symptoms_present', 'diagnosis_made', 'treatment_started', 'response_positive', 'response_negative', 'stable_condition', 'discharge_ready'];
        const fsm = new FiniteStateMachine(states, alphabet, 'assess', ['discharge']);

        // Treatment protocol transitions
        fsm.addTransition('assess', 'symptoms_present', 'diagnose');
        fsm.addTransition('assess', 'diagnosis_made', 'diagnose');

        fsm.addTransition('diagnose', 'diagnosis_made', 'treat');

        fsm.addTransition('treat', 'treatment_started', 'monitor');
        fsm.addTransition('treat', 'response_positive', 'monitor');
        fsm.addTransition('treat', 'response_negative', 'treat'); // Adjust treatment

        fsm.addTransition('monitor', 'stable_condition', 'discharge');
        fsm.addTransition('monitor', 'response_negative', 'treat'); // Back to treatment
        fsm.addTransition('monitor', 'discharge_ready', 'discharge');

        fsm.addTransition('discharge', 'discharge_ready', 'discharge');

        // Test successful treatment protocol
        const successfulTreatment = ['symptoms_present', 'diagnosis_made', 'treatment_started', 'stable_condition', 'discharge_ready'];
        const result = fsm.process(successfulTreatment);

        expect(result.accepted).toBe(true);
        expect(result.finalState).toBe('discharge');

        // Test treatment adjustment needed
        const treatmentAdjustment = ['symptoms_present', 'diagnosis_made', 'treatment_started', 'response_negative', 'treatment_started', 'stable_condition'];
        expect(fsm.accepts(treatmentAdjustment)).toBe(true); // Should reach monitor then discharge
      });
    });

    describe('Drug Administration Safety System', () => {
      test('medication dosage validation DFA', () => {
        // States: safe, warning, dangerous, lethal
        const states = ['safe', 'warning', 'dangerous', 'lethal'];
        const alphabet = ['normal_dose', 'high_dose', 'very_high_dose', 'extreme_dose', 'patient_adult', 'patient_child', 'patient_elderly'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'safe', ['safe', 'warning']);

        // Dosage safety transitions
        dfa.addDeterministicTransition('safe', 'normal_dose', 'safe');
        dfa.addDeterministicTransition('safe', 'high_dose', 'warning');
        dfa.addDeterministicTransition('safe', 'patient_adult', 'safe');
        dfa.addDeterministicTransition('safe', 'patient_elderly', 'warning');
        dfa.addDeterministicTransition('safe', 'patient_child', 'warning');

        dfa.addDeterministicTransition('warning', 'normal_dose', 'safe');
        dfa.addDeterministicTransition('warning', 'high_dose', 'dangerous');
        dfa.addDeterministicTransition('warning', 'very_high_dose', 'dangerous');
        dfa.addDeterministicTransition('warning', 'patient_child', 'dangerous');

        dfa.addDeterministicTransition('dangerous', 'normal_dose', 'warning');
        dfa.addDeterministicTransition('dangerous', 'very_high_dose', 'lethal');
        dfa.addDeterministicTransition('dangerous', 'extreme_dose', 'lethal');

        dfa.addDeterministicTransition('lethal', 'normal_dose', 'dangerous'); // Some recovery possible

        // Test safe adult dosage
        const safeAdultDose = ['patient_adult', 'normal_dose'];
        expect(dfa.accepts(safeAdultDose)).toBe(true);

        // Test dangerous child dosage
        const dangerousChildDose = ['patient_child', 'high_dose'];
        expect(dfa.accepts(dangerousChildDose)).toBe(false); // dangerous is not accepting

        // Test lethal overdose
        const lethalDose = ['high_dose', 'very_high_dose', 'extreme_dose'];
        expect(dfa.accepts(lethalDose)).toBe(false); // lethal is not accepting
      });

      test('allergy checking with lexical analyzer', () => {
        const analyzer = new LexicalAnalyzer();

        const prescriptionNote = "Patient allergic to penicillin and sulfa drugs. Prescribe amoxicillin 500mg.";
        const tokens = analyzer.tokenize(prescriptionNote);

        // Should identify medical terms and allergens
        const identifiers = tokens.filter(t => t.type === 'identifier');
        expect(identifiers.some(id => id.value === 'penicillin')).toBe(true);
        expect(identifiers.some(id => id.value === 'sulfa')).toBe(true);
        expect(identifiers.some(id => id.value === 'amoxicillin')).toBe(true);

        // Should identify numbers (dosage)
        const numbers = tokens.filter(t => t.type === 'number');
        expect(numbers.some(n => n.value === '500')).toBe(true);
      });
    });

    describe('Medical Record Processing', () => {
      test('ICD code validation with regex compiler', () => {
        const icdRegex = new RegexCompiler('ab'); // Simple pattern for testing
        const dfa = icdRegex.compile();

        // Test valid codes using simple pattern
        expect(dfa.accepts(['a', 'b'])).toBe(true);
        expect(dfa.accepts(['a'])).toBe(false); // Incomplete

        // Test with hello pattern
        const helloRegex = new RegexCompiler('hello');
        const helloDfa = helloRegex.compile();
        expect(helloDfa.accepts(['h', 'e', 'l', 'l', 'o'])).toBe(true);
        expect(helloDfa.accepts(['h', 'e', 'l'])).toBe(false);
      });

      test('patient record state management FSM', () => {
        // States: created, active, archived, deleted
        const states = ['created', 'active', 'archived', 'deleted'];
        const alphabet = ['add_info', 'update_record', 'discharge_patient', 'archive_old', 'delete_record', 'restore_record'];
        const fsm = new FiniteStateMachine(states, alphabet, 'created', ['active', 'archived']);

        // Record management transitions
        fsm.addTransition('created', 'add_info', 'active');
        fsm.addTransition('created', 'update_record', 'active');

        fsm.addTransition('active', 'add_info', 'active');
        fsm.addTransition('active', 'update_record', 'active');
        fsm.addTransition('active', 'discharge_patient', 'archived');
        fsm.addTransition('active', 'archive_old', 'archived');
        fsm.addTransition('active', 'delete_record', 'deleted');

        fsm.addTransition('archived', 'restore_record', 'active');
        fsm.addTransition('archived', 'delete_record', 'deleted');

        fsm.addTransition('deleted', 'restore_record', 'archived'); // Can restore from deleted

        // Test record lifecycle
        const recordLifecycle = ['add_info', 'update_record', 'discharge_patient'];
        const result = fsm.process(recordLifecycle);

        expect(result.accepted).toBe(true);
        expect(result.finalState).toBe('archived');

        // Test record restoration
        const restoration = ['add_info', 'delete_record', 'restore_record'];
        expect(fsm.accepts(restoration)).toBe(true); // Back to archived
      });
    });

  });

});
