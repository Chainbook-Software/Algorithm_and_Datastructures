/// <reference types="jest" />

import {
  FiniteStateMachine,
  DeterministicFiniteAutomaton,
  TuringMachine,
  Transition,
  ProcessingResult
} from '../../datastructures/stateMachine';
import {
  RegexCompiler,
  LexicalAnalyzer,
  BinaryAdder,
  PalindromeRecognizer
} from '../../algorithms/stateMachineAlgorithms';

describe('State Machines', () => {
  describe('FiniteStateMachine', () => {
    test('basic FSM construction and transitions', () => {
      const states = ['q0', 'q1', 'q2'];
      const alphabet = ['a', 'b'];
      const fsm = new FiniteStateMachine(states, alphabet, 'q0', ['q2']);

      fsm.addTransition('q0', 'a', 'q1');
      fsm.addTransition('q1', 'b', 'q2');
      fsm.addTransition('q0', 'b', 'q0');

      expect(fsm.getStates()).toEqual(states);
      expect(fsm.getAlphabet()).toEqual(alphabet);
    });

    test('processes input correctly', () => {
      const states = ['q0', 'q1', 'q2'];
      const alphabet = ['a', 'b'];
      const fsm = new FiniteStateMachine(states, alphabet, 'q0', ['q2']);

      fsm.addTransition('q0', 'a', 'q1');
      fsm.addTransition('q1', 'b', 'q2');

      const result = fsm.process(['a', 'b']);
      expect(result.accepted).toBe(true);
      expect(result.finalState).toBe('q2');
      expect(result.path).toEqual(['q0', 'q1', 'q2']);
    });

    test('rejects invalid input', () => {
      const states = ['q0', 'q1'];
      const alphabet = ['a'];
      const fsm = new FiniteStateMachine(states, alphabet, 'q0', ['q1']);

      fsm.addTransition('q0', 'a', 'q1');

      const result = fsm.process(['b']); // 'b' not in alphabet
      expect(result.accepted).toBe(false);
    });

    test('handles non-deterministic transitions', () => {
      const states = ['q0', 'q1', 'q2'];
      const alphabet = ['a'];
      const fsm = new FiniteStateMachine(states, alphabet, 'q0', ['q2']);

      fsm.addTransition('q0', 'a', 'q1');
      fsm.addTransition('q0', 'a', 'q2'); // Non-deterministic

      const result = fsm.process(['a']);
      expect(result.accepted).toBe(true); // Should accept since q2 is accepting
    });
  });

  describe('DeterministicFiniteAutomaton', () => {
    test('enforces deterministic transitions', () => {
      const states = [0, 1, 2];
      const alphabet = ['a', 'b'];
      const dfa = new DeterministicFiniteAutomaton(states, alphabet, 0, [2]);

      dfa.addDeterministicTransition(0, 'a', 1);
      dfa.addDeterministicTransition(1, 'b', 2);

      expect(() => {
        dfa.addDeterministicTransition(0, 'a', 2); // Should fail - already exists
      }).toThrow();
    });

    test('processes input deterministically', () => {
      const states = [0, 1, 2];
      const alphabet = ['a', 'b'];
      const dfa = new DeterministicFiniteAutomaton(states, alphabet, 0, [2]);

      dfa.addDeterministicTransition(0, 'a', 1);
      dfa.addDeterministicTransition(1, 'b', 2);
      dfa.addDeterministicTransition(0, 'b', 0);
      dfa.addDeterministicTransition(1, 'a', 1);

      const result = dfa.processDeterministic(['a', 'b']);
      expect(result.accepted).toBe(true);
      expect(result.path).toEqual([0, 1, 2]);
    });

    test('rejects input that leads to non-accepting state', () => {
      const states = [0, 1, 2];
      const alphabet = ['a'];
      const dfa = new DeterministicFiniteAutomaton(states, alphabet, 0, [2]);

      dfa.addDeterministicTransition(0, 'a', 1);

      const result = dfa.processDeterministic(['a']);
      expect(result.accepted).toBe(false);
      expect(result.finalState).toBe(1);
    });
  });

  describe('TuringMachine', () => {
    test('basic Turing Machine construction', () => {
      const states = ['q0', 'q1', 'q2'];
      const tapeAlphabet = ['0', '1', ' '];
      const tm = new TuringMachine(states, tapeAlphabet, ' ', 'q0', ['q2'], ['q1']);

      expect(tm.getStates()).toEqual(states);
      expect(tm.getTapeAlphabet()).toEqual(tapeAlphabet);
    });

    test('executes simple computation', () => {
      const states = ['q0', 'q1', 'q2'];
      const tapeAlphabet = ['0', '1', ' '];
      const tm = new TuringMachine(states, tapeAlphabet, ' ', 'q0', ['q2'], []);

      // Simple machine: write 1 and accept
      tm.addTransition('q0', ' ', 'q2', '1', 'S');

      const result = tm.run([' '], 10);
      expect(result.accepted).toBe(true);
      expect(result.finalTape).toEqual(['1']);
      expect(result.steps).toBe(1);
    });

    test('handles tape extension', () => {
      const states = ['q0', 'q1', 'q2'];
      const tapeAlphabet = ['0', '1', ' '];
      const tm = new TuringMachine(states, tapeAlphabet, ' ', 'q0', ['q2'], []);

      tm.addTransition('q0', '0', 'q1', '1', 'R');
      tm.addTransition('q1', ' ', 'q2', '1', 'S');

      const result = tm.run(['0'], 10);
      expect(result.accepted).toBe(true);
      expect(result.finalTape).toEqual(['1', '1']);
    });

    test('handles missing transitions (halts and rejects)', () => {
      const states = ['q0', 'q1'];
      const tapeAlphabet = ['0', ' '];
      const tm = new TuringMachine(states, tapeAlphabet, ' ', 'q0', ['q1'], []);

      // No transition for '0' in q0
      const result = tm.run(['0'], 10);
      expect(result.accepted).toBe(false);
      expect(result.halted).toBe(true);
    });
  });

  describe('RegexCompiler', () => {
    test('compiles simple literal pattern', () => {
      const compiler = new RegexCompiler('a');
      const dfa = compiler.compile();

      expect(dfa.accepts(['a'])).toBe(true);
      expect(dfa.accepts(['b'])).toBe(false);
    });

    test('handles alternation', () => {
      const compiler = new RegexCompiler('a|b');
      const dfa = compiler.compile();

      expect(dfa.accepts(['a'])).toBe(true);
      expect(dfa.accepts(['b'])).toBe(true);
      expect(dfa.accepts(['c'])).toBe(false);
    });

    test('handles concatenation', () => {
      const compiler = new RegexCompiler('ab');
      const dfa = compiler.compile();

      expect(dfa.accepts(['a', 'b'])).toBe(true);
      expect(dfa.accepts(['a'])).toBe(false);
      expect(dfa.accepts(['b'])).toBe(false);
    });
  });

  describe('LexicalAnalyzer', () => {
    test('tokenizes simple identifiers', () => {
      const lexer = new LexicalAnalyzer();
      const tokens = lexer.tokenize('hello world');

      expect(tokens).toEqual([
        { type: 'identifier', value: 'hello', position: 0 },
        { type: 'identifier', value: 'world', position: 6 }
      ]);
    });

    test('tokenizes keywords', () => {
      const lexer = new LexicalAnalyzer();
      const tokens = lexer.tokenize('if then else');

      expect(tokens).toEqual([
        { type: 'keyword', value: 'if', position: 0 },
        { type: 'keyword', value: 'then', position: 3 },
        { type: 'keyword', value: 'else', position: 8 }
      ]);
    });

    test('tokenizes numbers', () => {
      const lexer = new LexicalAnalyzer();
      const tokens = lexer.tokenize('123 45.67');

      expect(tokens).toEqual([
        { type: 'number', value: '123', position: 0 },
        { type: 'number', value: '45.67', position: 4 }
      ]);
    });

    test('tokenizes operators and punctuation', () => {
      const lexer = new LexicalAnalyzer();
      const tokens = lexer.tokenize('a + b = 10;');

      expect(tokens).toContainEqual({ type: 'operator', value: '+', position: 2 });
      expect(tokens).toContainEqual({ type: 'operator', value: '=', position: 6 });
      expect(tokens).toContainEqual({ type: 'operator', value: ';', position: 10 });
    });

    test('handles complex expressions', () => {
      const lexer = new LexicalAnalyzer();
      const tokens = lexer.tokenize('if (x > 5) return true;');

      expect(tokens.some(t => t.type === 'keyword' && t.value === 'if')).toBe(true);
      expect(tokens.some(t => t.type === 'keyword' && t.value === 'return')).toBe(true);
      expect(tokens.some(t => t.type === 'identifier' && t.value === 'true')).toBe(true);
    });
  });

  describe('BinaryAdder', () => {
    test('adds simple binary numbers', () => {
      const adder = new BinaryAdder();

      expect(adder.add('0', '0')).toBe('0');
      expect(adder.add('0', '1')).toBe('1');
      expect(adder.add('1', '0')).toBe('1');
      expect(adder.add('1', '1')).toBe('10');
    });

    test('adds larger binary numbers', () => {
      const adder = new BinaryAdder();

      expect(adder.add('101', '010')).toBe('111');
      expect(adder.add('111', '001')).toBe('1000');
    });

    test('handles different length numbers', () => {
      const adder = new BinaryAdder();

      expect(adder.add('1', '111')).toBe('1000');
      expect(adder.add('1010', '1')).toBe('1011');
    });
  });

  describe('PalindromeRecognizer', () => {
    test('recognizes simple palindromes', () => {
      const recognizer = new PalindromeRecognizer();

      expect(recognizer.isPalindrome('')).toBe(true); // Empty string
      expect(recognizer.isPalindrome('a')).toBe(true);
      expect(recognizer.isPalindrome('aa')).toBe(true);
      expect(recognizer.isPalindrome('aba')).toBe(true);
      expect(recognizer.isPalindrome('abba')).toBe(true);
    });

    test('rejects non-palindromes', () => {
      const recognizer = new PalindromeRecognizer();

      expect(recognizer.isPalindrome('ab')).toBe(false);
      expect(recognizer.isPalindrome('abc')).toBe(false);
      expect(recognizer.isPalindrome('abab')).toBe(false);
    });

    test('handles longer strings', () => {
      const recognizer = new PalindromeRecognizer();

      expect(recognizer.isPalindrome('racecar')).toBe(true);
      expect(recognizer.isPalindrome('hello')).toBe(false);
    });
  });
});
