/**
 * State Machine Data Structures and Algorithms
 *
 * This module provides implementations of various state machines:
 * - Finite State Machines (FSM)
 * - Deterministic Finite Automata (DFA)
 * - Turing Machines
 */

/**
 * Represents a transition in a state machine.
 */
export interface Transition<TState, TInput> {
  fromState: TState;
  toState: TState;
  input: TInput;
}

/**
 * Represents the result of processing input through a state machine.
 */
export interface ProcessingResult<TState> {
  finalState: TState;
  accepted: boolean;
  path: TState[];
}

/**
 * A basic Finite State Machine implementation.
 * Supports both deterministic and non-deterministic transitions.
 */
export class FiniteStateMachine<TState, TInput> {
  private states: Set<TState>;
  private alphabet: Set<TInput>;
  private transitions: Map<TState, Map<TInput, Set<TState>>>;
  private initialState: TState;
  private acceptingStates: Set<TState>;

  /**
   * Constructs a Finite State Machine.
   * @param states Set of all possible states
   * @param alphabet Set of all possible input symbols
   * @param initialState The starting state
   * @param acceptingStates Set of states that accept the input
   */
  constructor(
    states: TState[],
    alphabet: TInput[],
    initialState: TState,
    acceptingStates: TState[]
  ) {
    this.states = new Set(states);
    this.alphabet = new Set(alphabet);
    this.transitions = new Map();
    this.initialState = initialState;
    this.acceptingStates = new Set(acceptingStates);

    // Initialize transition maps
    for (const state of states) {
      this.transitions.set(state, new Map());
    }
  }

  /**
   * Adds a transition from one state to another on a given input.
   * @param fromState The state to transition from
   * @param input The input symbol
   * @param toState The state to transition to
   */
  addTransition(fromState: TState, input: TInput, toState: TState): void {
    if (!this.states.has(fromState) || !this.states.has(toState)) {
      throw new Error('Invalid state in transition');
    }
    if (!this.alphabet.has(input)) {
      throw new Error('Invalid input symbol');
    }

    const stateTransitions = this.transitions.get(fromState)!;
    if (!stateTransitions.has(input)) {
      stateTransitions.set(input, new Set());
    }
    stateTransitions.get(input)!.add(toState);
  }

  /**
   * Processes a sequence of inputs and returns the result.
   * @param inputs Array of input symbols to process
   * @returns Processing result with final state, acceptance, and path
   */
  process(inputs: TInput[]): ProcessingResult<TState> {
    let currentStates = new Set([this.initialState]);
    const path: TState[] = [this.initialState];

    for (const input of inputs) {
      const nextStates = new Set<TState>();

      for (const currentState of currentStates) {
        const stateTransitions = this.transitions.get(currentState);
        if (stateTransitions && stateTransitions.has(input)) {
          for (const nextState of stateTransitions.get(input)!) {
            nextStates.add(nextState);
          }
        }
      }

      if (nextStates.size === 0) {
        // No valid transitions - stuck
        break;
      }

      currentStates = nextStates;
      // Add one representative state to path (for deterministic-like behavior)
      path.push(Array.from(currentStates)[0]);
    }

    const finalState = Array.from(currentStates)[0];
    // Accept if ANY of the current states is accepting (for non-deterministic FSM)
    const accepted = Array.from(currentStates).some(state => this.acceptingStates.has(state));

    return {
      finalState,
      accepted,
      path
    };
  }

  /**
   * Checks if the FSM accepts a given input sequence.
   * @param inputs Array of input symbols
   * @returns True if the input is accepted
   */
  accepts(inputs: TInput[]): boolean {
    return this.process(inputs).accepted;
  }

  /**
   * Gets all states in the FSM.
   */
  getStates(): TState[] {
    return Array.from(this.states);
  }

  /**
   * Gets the alphabet (input symbols).
   */
  getAlphabet(): TInput[] {
    return Array.from(this.alphabet);
  }

  /**
   * Gets all transitions.
   */
  getTransitions(): Transition<TState, TInput>[] {
    const transitions: Transition<TState, TInput>[] = [];

    for (const [fromState, stateTransitions] of this.transitions) {
      for (const [input, toStates] of stateTransitions) {
        for (const toState of toStates) {
          transitions.push({ fromState, input, toState });
        }
      }
    }

    return transitions;
  }
}

/**
 * A Deterministic Finite Automaton implementation.
 * Each state-input pair has exactly one transition.
 */
export class DeterministicFiniteAutomaton<TState, TInput> extends FiniteStateMachine<TState, TInput> {
  /**
   * Adds a deterministic transition.
   * @param fromState The state to transition from
   * @param input The input symbol
   * @param toState The state to transition to
   */
  addDeterministicTransition(fromState: TState, input: TInput, toState: TState): void {
    // Check if transition already exists
    const stateTransitions = (this as any).transitions.get(fromState);
    if (stateTransitions && stateTransitions.has(input) && stateTransitions.get(input).size > 0) {
      throw new Error('Deterministic transition already exists for this state-input pair');
    }

    this.addTransition(fromState, input, toState);
  }

  /**
   * Processes input deterministically.
   * @param inputs Array of input symbols
   * @returns Processing result
   */
  processDeterministic(inputs: TInput[]): ProcessingResult<TState> {
    let currentState = (this as any).initialState;
    const path: TState[] = [currentState];

    for (const input of inputs) {
      const stateTransitions = (this as any).transitions.get(currentState);
      if (!stateTransitions || !stateTransitions.has(input)) {
        // No transition - reject
        return {
          finalState: currentState,
          accepted: false,
          path
        };
      }

      const nextStates = stateTransitions.get(input);
      if (nextStates.size !== 1) {
        throw new Error('Non-deterministic transition found in DFA');
      }

      currentState = Array.from(nextStates)[0];
      path.push(currentState);
    }

    const accepted = (this as any).acceptingStates.has(currentState);

    return {
      finalState: currentState,
      accepted,
      path
    };
  }
}

/**
 * Represents the configuration of a Turing Machine at a given step.
 */
export interface TuringMachineConfiguration<TState, TSymbol> {
  tape: TSymbol[];
  headPosition: number;
  currentState: TState;
}

/**
 * A Turing Machine implementation.
 * Supports tape operations and state transitions.
 */
export class TuringMachine<TState, TSymbol> {
  private states: Set<TState>;
  private tapeAlphabet: Set<TSymbol>;
  private blankSymbol: TSymbol;
  private transitions: Map<TState, Map<TSymbol, { state: TState; symbol: TSymbol; move: 'L' | 'R' | 'S' }>>;
  private initialState: TState;
  private acceptingStates: Set<TState>;
  private rejectingStates: Set<TState>;

  /**
   * Constructs a Turing Machine.
   * @param states Set of all states
   * @param tapeAlphabet Set of symbols that can appear on tape
   * @param blankSymbol The blank symbol
   * @param initialState The starting state
   * @param acceptingStates States that accept
   * @param rejectingStates States that reject
   */
  constructor(
    states: TState[],
    tapeAlphabet: TSymbol[],
    blankSymbol: TSymbol,
    initialState: TState,
    acceptingStates: TState[],
    rejectingStates: TState[]
  ) {
    this.states = new Set(states);
    this.tapeAlphabet = new Set(tapeAlphabet);
    this.blankSymbol = blankSymbol;
    this.transitions = new Map();
    this.initialState = initialState;
    this.acceptingStates = new Set(acceptingStates);
    this.rejectingStates = new Set(rejectingStates);

    // Initialize transition maps
    for (const state of states) {
      this.transitions.set(state, new Map());
    }
  }

  /**
   * Adds a transition to the Turing Machine.
   * @param fromState Current state
   * @param readSymbol Symbol read from tape
   * @param toState Next state
   * @param writeSymbol Symbol to write to tape
   * @param move Direction to move head ('L', 'R', or 'S')
   */
  addTransition(
    fromState: TState,
    readSymbol: TSymbol,
    toState: TState,
    writeSymbol: TSymbol,
    move: 'L' | 'R' | 'S'
  ): void {
    if (!this.states.has(fromState) || !this.states.has(toState)) {
      throw new Error('Invalid state in transition');
    }
    if (!this.tapeAlphabet.has(readSymbol) || !this.tapeAlphabet.has(writeSymbol)) {
      throw new Error('Invalid symbol in transition');
    }

    const stateTransitions = this.transitions.get(fromState)!;
    stateTransitions.set(readSymbol, { state: toState, symbol: writeSymbol, move });
  }

  /**
   * Runs the Turing Machine on an input string.
   * @param input The input string as an array of symbols
   * @param maxSteps Maximum number of steps to prevent infinite loops
   * @returns Result of computation
   */
  run(input: TSymbol[], maxSteps: number = 1000): {
    accepted: boolean;
    finalState: TState;
    finalTape: TSymbol[];
    steps: number;
    halted: boolean;
  } {
    // Initialize tape with input and extend with blanks as needed
    const tape: TSymbol[] = [...input];
    let headPosition = 0;
    let currentState = this.initialState;
    let steps = 0;

    while (steps < maxSteps) {
      // Check if we've reached an accepting or rejecting state
      if (this.acceptingStates.has(currentState)) {
        return {
          accepted: true,
          finalState: currentState,
          finalTape: tape,
          steps,
          halted: true
        };
      }
      if (this.rejectingStates.has(currentState)) {
        return {
          accepted: false,
          finalState: currentState,
          finalTape: tape,
          steps,
          halted: true
        };
      }

      // Get current symbol, extend tape if necessary
      if (headPosition >= tape.length) {
        tape.push(this.blankSymbol);
      }
      const currentSymbol = tape[headPosition];

      // Find transition
      const stateTransitions = this.transitions.get(currentState);
      if (!stateTransitions || !stateTransitions.has(currentSymbol)) {
        // No transition - halt and reject
        return {
          accepted: false,
          finalState: currentState,
          finalTape: tape,
          steps,
          halted: true
        };
      }

      const transition = stateTransitions.get(currentSymbol)!;

      // Execute transition
      tape[headPosition] = transition.symbol;
      currentState = transition.state;

      // Move head
      if (transition.move === 'L') {
        headPosition = Math.max(0, headPosition - 1);
      } else if (transition.move === 'R') {
        headPosition++;
      }
      // 'S' means stay in place

      steps++;
    }

    // Max steps reached - halt without decision
    return {
      accepted: false,
      finalState: currentState,
      finalTape: tape,
      steps,
      halted: false
    };
  }

  /**
   * Gets all states in the Turing Machine.
   */
  getStates(): TState[] {
    return Array.from(this.states);
  }

  /**
   * Gets the tape alphabet.
   */
  getTapeAlphabet(): TSymbol[] {
    return Array.from(this.tapeAlphabet);
  }
}
