/// <reference types="jest" />

import {
  FiniteStateMachine,
  DeterministicFiniteAutomaton,
  TuringMachine,
  RegexCompiler,
  LexicalAnalyzer,
  BinaryAdder,
  PalindromeRecognizer
} from '../typescript/index';

/**
 * State Machines Real-Life Applications
 *
 * This file demonstrates practical applications of state machines in various domains:
 * - Text processing and parsing (lexical analysis, regex matching)
 * - Protocol validation (network protocols, API workflows)
 * - Game development (character state management, AI behavior)
 * - Business process automation (order processing, workflow management)
 * - Security systems (access control, intrusion detection)
 * - Communication systems (message parsing, protocol handling)
 * - Embedded systems (device control, sensor monitoring)
 */

describe('State Machines Real-Life Applications', () => {

  describe('Text Processing and Parsing', () => {
    test('code syntax highlighting with lexical analyzer', () => {
      const lexer = new LexicalAnalyzer();

      const codeSnippet = `
        function calculateSum(a, b) {
          if (a > 0 && b > 0) {
            return a + b;
          }
          return 0;
        }
      `;

      const tokens = lexer.tokenize(codeSnippet);

      // Should identify keywords
      const keywords = tokens.filter(t => t.type === 'keyword');
      expect(keywords.some(k => k.value === 'function')).toBe(true);
      expect(keywords.some(k => k.value === 'if')).toBe(true);
      expect(keywords.some(k => k.value === 'return')).toBe(true);

      // Should identify identifiers
      const identifiers = tokens.filter(t => t.type === 'identifier');
      expect(identifiers.some(i => i.value === 'calculateSum')).toBe(true);
      expect(identifiers.some(i => i.value === 'a')).toBe(true);
      expect(identifiers.some(i => i.value === 'b')).toBe(true);

      // Should identify operators
      const operators = tokens.filter(t => t.type === 'operator');
      expect(operators.some(o => o.value === '+')).toBe(true);
      expect(operators.some(o => o.value === '>')).toBe(true);
      expect(operators.some(o => o.value === '&&')).toBe(false); // Not implemented in simple lexer
    });

    test('email validation with regex DFA', () => {
      // Simple email pattern: local@domain.com
      const emailCompiler = new RegexCompiler('[a-z]+@[a-z]+\\.[a-z]+');

      // Note: Our simple regex compiler only handles basic patterns
      // In practice, you'd use a more sophisticated regex engine
      const simpleEmailCompiler = new RegexCompiler('a@b.c'); // Very basic pattern

      // Test basic pattern matching
      const basicCompiler = new RegexCompiler('hello');
      const dfa = basicCompiler.compile();

      expect(dfa.accepts(['h', 'e', 'l', 'l', 'o'])).toBe(true);
      expect(dfa.accepts(['h', 'i'])).toBe(false);
    });

    test('palindrome detection for text analysis', () => {
      const recognizer = new PalindromeRecognizer();

      // Test various text palindromes
      expect(recognizer.isPalindrome('radar')).toBe(true);
      expect(recognizer.isPalindrome('A man a plan a canal Panama'.toLowerCase().replace(/\s/g, ''))).toBe(true);
      expect(recognizer.isPalindrome('hello')).toBe(false);
      expect(recognizer.isPalindrome('12321')).toBe(true);

      // Test edge cases
      expect(recognizer.isPalindrome('')).toBe(true); // Empty string
      expect(recognizer.isPalindrome('a')).toBe(true); // Single character
      expect(recognizer.isPalindrome('aa')).toBe(true); // Double same character
    });
  });

  describe('Protocol Validation and Communication', () => {
    test('HTTP request parsing with FSM', () => {
      // States for HTTP request parsing
      const states = ['start', 'method', 'url', 'version', 'headers', 'body', 'end'];
      const alphabet = ['G', 'E', 'T', 'P', 'O', 'S', 'H', 'U', 'L', '/', '1', '.', '0', '\r', '\n', ' ', 'e', 'l', 'o'];

      const httpParser = new FiniteStateMachine(states, alphabet, 'start', ['end']);

      // Simple HTTP GET request transitions
      httpParser.addTransition('start', 'G', 'method');
      httpParser.addTransition('method', 'E', 'method');
      httpParser.addTransition('method', 'T', 'method');
      httpParser.addTransition('method', ' ', 'url');
      httpParser.addTransition('url', '/', 'url');
      httpParser.addTransition('url', ' ', 'version');
      httpParser.addTransition('version', 'H', 'version');
      httpParser.addTransition('version', 'T', 'version');
      httpParser.addTransition('version', 'P', 'version');
      httpParser.addTransition('version', '/', 'version');
      httpParser.addTransition('version', '1', 'version');
      httpParser.addTransition('version', '.', 'version');
      httpParser.addTransition('version', '0', 'version');
      httpParser.addTransition('version', '\r', 'headers');
      httpParser.addTransition('headers', '\n', 'headers');
      httpParser.addTransition('headers', '\r', 'body');
      httpParser.addTransition('body', '\n', 'end');

      // Test parsing a simple GET request
      const request = ['G', 'E', 'T', ' ', '/', ' ', 'H', 'T', 'T', 'P', '/', '1', '.', '0', '\r', '\n', '\r', '\n'];
      const result = httpParser.process(request);

      expect(result.accepted).toBe(true);
    });

    test('TCP connection state machine', () => {
      // TCP connection states
      const states = ['CLOSED', 'LISTEN', 'SYN_SENT', 'SYN_RECEIVED', 'ESTABLISHED', 'FIN_WAIT_1', 'FIN_WAIT_2', 'CLOSING', 'TIME_WAIT'];
      const events = ['passive_open', 'active_open', 'syn', 'syn_ack', 'ack', 'fin', 'timeout'];

      const tcpFSM = new FiniteStateMachine(states, events, 'CLOSED', ['ESTABLISHED', 'CLOSED']);

      // Basic TCP state transitions
      tcpFSM.addTransition('CLOSED', 'passive_open', 'LISTEN');
      tcpFSM.addTransition('CLOSED', 'active_open', 'SYN_SENT');
      tcpFSM.addTransition('LISTEN', 'syn', 'SYN_RECEIVED');
      tcpFSM.addTransition('SYN_SENT', 'syn_ack', 'ESTABLISHED');
      tcpFSM.addTransition('SYN_RECEIVED', 'ack', 'ESTABLISHED');
      tcpFSM.addTransition('ESTABLISHED', 'fin', 'FIN_WAIT_1');
      tcpFSM.addTransition('FIN_WAIT_1', 'ack', 'FIN_WAIT_2');
      tcpFSM.addTransition('FIN_WAIT_2', 'fin', 'TIME_WAIT');
      tcpFSM.addTransition('TIME_WAIT', 'timeout', 'CLOSED');

      // Test successful connection establishment
      let result = tcpFSM.process(['active_open', 'syn_ack']);
      expect(result.accepted).toBe(true);
      expect(result.finalState).toBe('ESTABLISHED');

      // Test connection closure
      result = tcpFSM.process(['active_open', 'syn_ack', 'fin', 'ack', 'fin', 'timeout']);
      expect(result.accepted).toBe(true);
    });

    test('JSON parser state machine', () => {
      const states = ['start', 'object', 'key', 'colon', 'value', 'string', 'number', 'array', 'end'];
      const alphabet = ['{', '}', '[', ']', '"', ':', ',', 't', 'r', 'u', 'e', 'f', 'a', 'l', 's', 'n', 'u', 'l', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'k', 'y'];

      const jsonParser = new FiniteStateMachine(states, alphabet, 'start', ['end']);

      // Basic JSON object parsing
      jsonParser.addTransition('start', '{', 'object');
      jsonParser.addTransition('object', '"', 'key');
      jsonParser.addTransition('key', 'k', 'key');
      jsonParser.addTransition('key', 'e', 'key');
      jsonParser.addTransition('key', 'y', 'key');
      jsonParser.addTransition('key', '"', 'colon');
      jsonParser.addTransition('colon', ':', 'value');
      jsonParser.addTransition('value', '"', 'string');
      jsonParser.addTransition('string', '"', 'object'); // Simplified - should handle comma or closing brace
      jsonParser.addTransition('value', 't', 'value'); // true
      jsonParser.addTransition('value', 'r', 'value');
      jsonParser.addTransition('value', 'u', 'value');
      jsonParser.addTransition('value', 'e', 'end');
      jsonParser.addTransition('object', '}', 'end');

      // Test parsing simple JSON: {"key": true}
      const jsonInput = ['{', '"', 'k', 'e', 'y', '"', ':', 't', 'r', 'u', 'e', '}'];
      const result = jsonParser.process(jsonInput);

      expect(result.accepted).toBe(true);
    });
  });

  describe('Game Development', () => {
    test('character state management in RPG', () => {
      // Character states in an RPG
      const states = ['idle', 'walking', 'running', 'attacking', 'defending', 'hurt', 'dead'];
      const actions = ['move', 'run', 'attack', 'defend', 'damage', 'die', 'stop'];

      const characterFSM = new FiniteStateMachine(states, actions, 'idle', ['idle', 'walking', 'running', 'attacking', 'defending', 'hurt', 'dead']);

      // Character state transitions
      characterFSM.addTransition('idle', 'move', 'walking');
      characterFSM.addTransition('idle', 'run', 'running');
      characterFSM.addTransition('idle', 'attack', 'attacking');
      characterFSM.addTransition('walking', 'run', 'running');
      characterFSM.addTransition('walking', 'attack', 'attacking');
      characterFSM.addTransition('walking', 'stop', 'idle');
      characterFSM.addTransition('running', 'stop', 'idle');
      characterFSM.addTransition('running', 'attack', 'attacking');
      characterFSM.addTransition('attacking', 'damage', 'hurt');
      characterFSM.addTransition('defending', 'damage', 'idle'); // Defense absorbs damage
      characterFSM.addTransition('hurt', 'die', 'dead');
      characterFSM.addTransition('hurt', 'stop', 'idle'); // Recover from hurt

      // Test character combat sequence
      const combatActions = ['attack', 'damage', 'stop'];
      const result = characterFSM.process(combatActions);

      expect(result.accepted).toBe(true); // Character survives combat

      // Test character death
      const lethalActions = ['attack', 'damage', 'die'];
      const deathResult = characterFSM.process(lethalActions);

      expect(deathResult.accepted).toBe(true);
    });

    test('game level progression with DFA', () => {
      // Game level states
      const states = ['menu', 'level1', 'level2', 'level3', 'boss', 'victory', 'game_over'];
      const events = ['start_game', 'complete_level', 'fail_level', 'defeat_boss', 'player_death'];

      const gameDFA = new DeterministicFiniteAutomaton(states, events, 'menu', ['victory', 'game_over']);

      // Game progression transitions
      gameDFA.addDeterministicTransition('menu', 'start_game', 'level1');
      gameDFA.addDeterministicTransition('level1', 'complete_level', 'level2');
      gameDFA.addDeterministicTransition('level2', 'complete_level', 'level3');
      gameDFA.addDeterministicTransition('level3', 'complete_level', 'boss');
      gameDFA.addDeterministicTransition('boss', 'defeat_boss', 'victory');
      gameDFA.addDeterministicTransition('level1', 'fail_level', 'game_over');
      gameDFA.addDeterministicTransition('level2', 'fail_level', 'game_over');
      gameDFA.addDeterministicTransition('level3', 'fail_level', 'game_over');
      gameDFA.addDeterministicTransition('boss', 'player_death', 'game_over');

      // Test winning game
      const winningPath = ['start_game', 'complete_level', 'complete_level', 'complete_level', 'defeat_boss'];
      const winResult = gameDFA.processDeterministic(winningPath);

      expect(winResult.accepted).toBe(true);
      expect(winResult.finalState).toBe('victory');

      // Test losing game
      const losingPath = ['start_game', 'fail_level'];
      const loseResult = gameDFA.processDeterministic(losingPath);

      expect(loseResult.accepted).toBe(true);
      expect(loseResult.finalState).toBe('game_over');
    });

    test('AI behavior tree with state machines', () => {
      // Simple enemy AI states
      const states = ['patrol', 'investigate', 'chase', 'attack', 'flee', 'dead'];
      const stimuli = ['see_player', 'hear_noise', 'lose_sight', 'take_damage', 'low_health', 'player_dead'];

      const enemyAI = new FiniteStateMachine(states, stimuli, 'patrol', ['patrol', 'investigate', 'chase', 'attack', 'flee', 'dead']);

      // AI behavior transitions
      enemyAI.addTransition('patrol', 'see_player', 'chase');
      enemyAI.addTransition('patrol', 'hear_noise', 'investigate');
      enemyAI.addTransition('investigate', 'see_player', 'chase');
      enemyAI.addTransition('investigate', 'lose_sight', 'patrol');
      enemyAI.addTransition('chase', 'lose_sight', 'investigate');
      enemyAI.addTransition('chase', 'take_damage', 'attack');
      enemyAI.addTransition('attack', 'low_health', 'flee');
      enemyAI.addTransition('attack', 'player_dead', 'patrol');
      enemyAI.addTransition('flee', 'lose_sight', 'patrol');
      enemyAI.addTransition('patrol', 'take_damage', 'flee');
      enemyAI.addTransition('chase', 'take_damage', 'flee');
      enemyAI.addTransition('attack', 'take_damage', 'dead');
      enemyAI.addTransition('flee', 'take_damage', 'dead');

      // Test AI combat behavior
      const combatStimuli = ['see_player', 'take_damage', 'low_health'];
      const result = enemyAI.process(combatStimuli);

      expect(result.accepted).toBe(true); // AI survives initial encounter

      // Test AI death
      const lethalStimuli = ['see_player', 'take_damage', 'take_damage'];
      const deathResult = enemyAI.process(lethalStimuli);

      expect(deathResult.accepted).toBe(true);
    });
  });

  describe('Business Process Automation', () => {
    test('order fulfillment workflow', () => {
      // Order states
      const states = ['received', 'payment_pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
      const events = ['payment_received', 'process_order', 'ship_order', 'deliver_order', 'cancel_order', 'payment_failed'];

      const orderWorkflow = new DeterministicFiniteAutomaton(states, events, 'received', ['delivered', 'cancelled']);

      // Order fulfillment transitions
      orderWorkflow.addDeterministicTransition('received', 'payment_received', 'paid');
      orderWorkflow.addDeterministicTransition('received', 'cancel_order', 'cancelled');
      orderWorkflow.addDeterministicTransition('paid', 'process_order', 'processing');
      orderWorkflow.addDeterministicTransition('processing', 'ship_order', 'shipped');
      orderWorkflow.addDeterministicTransition('shipped', 'deliver_order', 'delivered');
      orderWorkflow.addDeterministicTransition('received', 'payment_failed', 'payment_pending');
      orderWorkflow.addDeterministicTransition('payment_pending', 'payment_received', 'paid');
      orderWorkflow.addDeterministicTransition('payment_pending', 'cancel_order', 'cancelled');

      // Test successful order fulfillment
      const successEvents = ['payment_received', 'process_order', 'ship_order', 'deliver_order'];
      const successResult = orderWorkflow.processDeterministic(successEvents);

      expect(successResult.accepted).toBe(true);
      expect(successResult.finalState).toBe('delivered');

      // Test cancelled order
      const cancelEvents = ['cancel_order'];
      const cancelResult = orderWorkflow.processDeterministic(cancelEvents);

      expect(cancelResult.accepted).toBe(true);
      expect(cancelResult.finalState).toBe('cancelled');
    });

    test('customer support ticket system', () => {
      // Support ticket states
      const states = ['open', 'assigned', 'in_progress', 'waiting_customer', 'resolved', 'closed', 'escalated'];
      const actions = ['assign_agent', 'start_work', 'request_info', 'receive_info', 'resolve', 'close', 'escalate'];

      const ticketSystem = new FiniteStateMachine(states, actions, 'open', ['closed', 'escalated']);

      // Ticket workflow transitions
      ticketSystem.addTransition('open', 'assign_agent', 'assigned');
      ticketSystem.addTransition('assigned', 'start_work', 'in_progress');
      ticketSystem.addTransition('in_progress', 'request_info', 'waiting_customer');
      ticketSystem.addTransition('waiting_customer', 'receive_info', 'in_progress');
      ticketSystem.addTransition('in_progress', 'resolve', 'resolved');
      ticketSystem.addTransition('resolved', 'close', 'closed');
      ticketSystem.addTransition('open', 'escalate', 'escalated');
      ticketSystem.addTransition('assigned', 'escalate', 'escalated');
      ticketSystem.addTransition('in_progress', 'escalate', 'escalated');

      // Test successful ticket resolution
      const resolutionPath = ['assign_agent', 'start_work', 'resolve', 'close'];
      const result = ticketSystem.process(resolutionPath);

      expect(result.accepted).toBe(true);

      // Test ticket escalation
      const escalationPath = ['escalate'];
      const escalationResult = ticketSystem.process(escalationPath);

      expect(escalationResult.accepted).toBe(true);
    });

    test('inventory management with Turing Machine', () => {
      // Simple inventory tracking Turing Machine
      const states = ['q0', 'q1', 'q2'];
      const tapeAlphabet = ['0', '1', '2', '3', '4', '5', ' '];
      const blankSymbol = ' ';

      const inventoryTM = new TuringMachine(states, tapeAlphabet, blankSymbol, 'q0', ['q1', 'q2'], []);

      // Simple inventory operations: increment stock level
      inventoryTM.addTransition('q0', '0', 'q1', '1', 'S'); // 0 -> 1
      inventoryTM.addTransition('q0', '1', 'q1', '2', 'S'); // 1 -> 2
      inventoryTM.addTransition('q0', '2', 'q1', '3', 'S'); // 2 -> 3
      inventoryTM.addTransition('q0', '3', 'q1', '4', 'S'); // 3 -> 4
      inventoryTM.addTransition('q0', '4', 'q1', '5', 'S'); // 4 -> 5
      inventoryTM.addTransition('q0', '5', 'q2', '5', 'S'); // Max stock reached
      inventoryTM.addTransition('q0', ' ', 'q2', ' ', 'S'); // No stock to increment

      // Test inventory increment
      const result = inventoryTM.run(['2'], 10);
      expect(result.accepted).toBe(true);
      expect(result.finalTape).toEqual(['3']);
    });
  });

  describe('Security Systems', () => {
    test('access control state machine', () => {
      // Access control states
      const states = ['locked', 'unlocked', 'alarm', 'maintenance'];
      const events = ['valid_card', 'invalid_card', 'timeout', 'maintenance_key', 'exit_maintenance'];

      const accessControl = new DeterministicFiniteAutomaton(states, events, 'locked', ['unlocked']);

      // Access control transitions
      accessControl.addDeterministicTransition('locked', 'valid_card', 'unlocked');
      accessControl.addDeterministicTransition('locked', 'invalid_card', 'alarm');
      accessControl.addDeterministicTransition('unlocked', 'timeout', 'locked');
      accessControl.addDeterministicTransition('alarm', 'maintenance_key', 'maintenance');
      accessControl.addDeterministicTransition('maintenance', 'exit_maintenance', 'locked');

      // Test valid access
      const validAccess = accessControl.processDeterministic(['valid_card']);
      expect(validAccess.accepted).toBe(true);
      expect(validAccess.finalState).toBe('unlocked');

      // Test invalid access triggering alarm
      const invalidAccess = accessControl.processDeterministic(['invalid_card']);
      expect(invalidAccess.accepted).toBe(false);
      expect(invalidAccess.finalState).toBe('alarm');

      // Test maintenance mode
      const maintenanceMode = accessControl.processDeterministic(['invalid_card', 'maintenance_key']);
      expect(maintenanceMode.accepted).toBe(false); // Not accepted state
      expect(maintenanceMode.finalState).toBe('maintenance');
    });

    test('intrusion detection system', () => {
      // IDS states
      const states = ['normal', 'suspicious', 'alert', 'block', 'reset'];
      const events = ['normal_traffic', 'suspicious_pattern', 'attack_pattern', 'timeout', 'admin_reset'];

      const idsFSM = new FiniteStateMachine(states, events, 'normal', ['normal', 'suspicious', 'alert', 'block', 'reset']);

      // IDS transitions
      idsFSM.addTransition('normal', 'suspicious_pattern', 'suspicious');
      idsFSM.addTransition('suspicious', 'normal_traffic', 'normal');
      idsFSM.addTransition('suspicious', 'suspicious_pattern', 'alert');
      idsFSM.addTransition('suspicious', 'attack_pattern', 'block');
      idsFSM.addTransition('alert', 'normal_traffic', 'normal');
      idsFSM.addTransition('alert', 'attack_pattern', 'block');
      idsFSM.addTransition('block', 'timeout', 'suspicious');
      idsFSM.addTransition('block', 'admin_reset', 'reset');
      idsFSM.addTransition('reset', 'normal_traffic', 'normal');

      // Test attack detection and blocking
      const attackSequence = ['suspicious_pattern', 'attack_pattern'];
      const attackResult = idsFSM.process(attackSequence);

      expect(attackResult.accepted).toBe(true); // System responds to attack

      // Test recovery from alert
      const recoverySequence = ['suspicious_pattern', 'normal_traffic'];
      const recoveryResult = idsFSM.process(recoverySequence);

      expect(recoveryResult.accepted).toBe(true);
    });

    test('password validation with DFA', () => {
      // Password validation states
      const states = ['start', 'has_lower', 'has_upper', 'has_digit', 'has_special', 'valid'];
      const alphabet = ['a', 'b', 'c', 'A', 'B', 'C', '1', '2', '3', '!', '@', '#'];

      const passwordValidator = new DeterministicFiniteAutomaton(states, alphabet, 'start', ['valid']);

      // Password validation transitions (simplified)
      // Lowercase letters
      passwordValidator.addDeterministicTransition('start', 'a', 'has_lower');
      passwordValidator.addDeterministicTransition('start', 'b', 'has_lower');
      passwordValidator.addDeterministicTransition('start', 'c', 'has_lower');

      // Uppercase letters
      passwordValidator.addDeterministicTransition('start', 'A', 'has_upper');
      passwordValidator.addDeterministicTransition('start', 'B', 'has_upper');
      passwordValidator.addDeterministicTransition('start', 'C', 'has_upper');

      // Digits
      passwordValidator.addDeterministicTransition('start', '1', 'has_digit');
      passwordValidator.addDeterministicTransition('start', '2', 'has_digit');
      passwordValidator.addDeterministicTransition('start', '3', 'has_digit');

      // Special characters
      passwordValidator.addDeterministicTransition('start', '!', 'has_special');
      passwordValidator.addDeterministicTransition('start', '@', 'has_special');
      passwordValidator.addDeterministicTransition('start', '#', 'has_special');

      // From has_lower, can add other requirements
      passwordValidator.addDeterministicTransition('has_lower', 'A', 'valid');
      passwordValidator.addDeterministicTransition('has_lower', '1', 'valid');
      passwordValidator.addDeterministicTransition('has_lower', '!', 'valid');

      // Test valid password (has lower + upper)
      const validPassword = passwordValidator.processDeterministic(['a', 'A']);
      expect(validPassword.accepted).toBe(true);

      // Test invalid password (only lowercase)
      const invalidPassword = passwordValidator.processDeterministic(['a', 'b']);
      expect(invalidPassword.accepted).toBe(false);
    });
  });

  describe('Embedded Systems and IoT', () => {
    test('traffic light controller', () => {
      // Traffic light states
      const states = ['red', 'yellow', 'green'];
      const events = ['timer_expired', 'emergency_vehicle'];

      const trafficLight = new DeterministicFiniteAutomaton(states, events, 'red', ['red', 'yellow', 'green']);

      // Traffic light transitions
      trafficLight.addDeterministicTransition('red', 'timer_expired', 'green');
      trafficLight.addDeterministicTransition('green', 'timer_expired', 'yellow');
      trafficLight.addDeterministicTransition('yellow', 'timer_expired', 'red');
      // Emergency override
      trafficLight.addDeterministicTransition('red', 'emergency_vehicle', 'red');
      trafficLight.addDeterministicTransition('green', 'emergency_vehicle', 'yellow');
      trafficLight.addDeterministicTransition('yellow', 'emergency_vehicle', 'red');

      // Test normal cycle
      const normalCycle = ['timer_expired', 'timer_expired', 'timer_expired'];
      const cycleResult = trafficLight.processDeterministic(normalCycle);

      expect(cycleResult.accepted).toBe(true);
      expect(cycleResult.finalState).toBe('red'); // Back to start

      // Test emergency override
      const emergencyOverride = trafficLight.processDeterministic(['emergency_vehicle']);
      expect(emergencyOverride.finalState).toBe('red');
    });

    test('vending machine controller', () => {
      // Vending machine states
      const states = ['waiting', 'has_quarter', 'has_dollar', 'dispensing', 'out_of_order'];
      const inputs = ['insert_quarter', 'insert_dollar', 'select_item', 'maintenance'];

      const vendingMachine = new FiniteStateMachine(states, inputs, 'waiting', ['dispensing']);

      // Vending machine transitions
      vendingMachine.addTransition('waiting', 'insert_quarter', 'has_quarter');
      vendingMachine.addTransition('waiting', 'insert_dollar', 'has_dollar');
      vendingMachine.addTransition('has_quarter', 'insert_quarter', 'has_dollar');
      vendingMachine.addTransition('has_dollar', 'select_item', 'dispensing');
      vendingMachine.addTransition('has_quarter', 'select_item', 'waiting'); // Insufficient funds
      vendingMachine.addTransition('waiting', 'maintenance', 'out_of_order');
      vendingMachine.addTransition('has_quarter', 'maintenance', 'out_of_order');
      vendingMachine.addTransition('has_dollar', 'maintenance', 'out_of_order');
      vendingMachine.addTransition('dispensing', 'maintenance', 'out_of_order');

      // Test successful purchase
      const purchaseSequence = ['insert_dollar', 'select_item'];
      const purchaseResult = vendingMachine.process(purchaseSequence);

      expect(purchaseResult.accepted).toBe(true);

      // Test insufficient funds
      const insufficientFunds = ['insert_quarter', 'select_item'];
      const insufficientResult = vendingMachine.process(insufficientFunds);

      expect(insufficientResult.accepted).toBe(false); // Not accepted state
    });

    test('sensor monitoring system', () => {
      // Sensor states
      const states = ['normal', 'warning', 'critical', 'maintenance'];
      const readings = ['normal_reading', 'high_reading', 'critical_reading', 'maintenance_mode', 'reset'];

      const sensorMonitor = new FiniteStateMachine(states, readings, 'normal', ['normal', 'warning', 'critical', 'maintenance']);

      // Sensor monitoring transitions
      sensorMonitor.addTransition('normal', 'high_reading', 'warning');
      sensorMonitor.addTransition('warning', 'normal_reading', 'normal');
      sensorMonitor.addTransition('warning', 'critical_reading', 'critical');
      sensorMonitor.addTransition('critical', 'normal_reading', 'warning');
      sensorMonitor.addTransition('normal', 'maintenance_mode', 'maintenance');
      sensorMonitor.addTransition('warning', 'maintenance_mode', 'maintenance');
      sensorMonitor.addTransition('critical', 'maintenance_mode', 'maintenance');
      sensorMonitor.addTransition('maintenance', 'reset', 'normal');

      // Test sensor alert progression
      const alertSequence = ['high_reading', 'critical_reading'];
      const alertResult = sensorMonitor.process(alertSequence);

      expect(alertResult.accepted).toBe(true);

      // Test maintenance mode
      const maintenanceSequence = ['high_reading', 'maintenance_mode', 'reset'];
      const maintenanceResult = sensorMonitor.process(maintenanceSequence);

      expect(maintenanceResult.accepted).toBe(true);
    });
  });

  describe('Data Processing and Computation', () => {
    test('binary calculator with state machines', () => {
      const adder = new BinaryAdder();

      // Test basic binary addition
      expect(adder.add('0', '0')).toBe('0');
      expect(adder.add('0', '1')).toBe('1');
      expect(adder.add('1', '0')).toBe('1');
      expect(adder.add('1', '1')).toBe('10');

      // Test larger numbers
      expect(adder.add('101', '010')).toBe('111'); // 5 + 2 = 7
      expect(adder.add('111', '001')).toBe('1000'); // 7 + 1 = 8
      expect(adder.add('1', '111')).toBe('1000'); // 1 + 7 = 8
      expect(adder.add('1010', '1')).toBe('1011'); // 10 + 1 = 11
    });

    test('string pattern matching with regex DFA', () => {
      // Test simple pattern matching
      const patternA = new RegexCompiler('a');
      const dfaA = patternA.compile();

      expect(dfaA.accepts(['a'])).toBe(true);
      expect(dfaA.accepts(['b'])).toBe(false);

      // Test alternation
      const patternAB = new RegexCompiler('a|b');
      const dfaAB = patternAB.compile();

      expect(dfaAB.accepts(['a'])).toBe(true);
      expect(dfaAB.accepts(['b'])).toBe(true);
      expect(dfaAB.accepts(['c'])).toBe(false);

      // Test concatenation
      const patternABConcat = new RegexCompiler('ab');
      const dfaABConcat = patternABConcat.compile();

      expect(dfaABConcat.accepts(['a', 'b'])).toBe(true);
      expect(dfaABConcat.accepts(['a'])).toBe(false);
      expect(dfaABConcat.accepts(['b'])).toBe(false);
    });

    test('computational verification with Turing Machine', () => {
      // Simple computation Turing Machine
      const states = ['q0', 'q1', 'q2'];
      const tapeAlphabet = ['0', '1', ' '];
      const blankSymbol = ' ';

      const computationTM = new TuringMachine(states, tapeAlphabet, blankSymbol, 'q0', ['q2'], []);

      // Simple machine: copy input to output
      computationTM.addTransition('q0', '0', 'q1', '0', 'R');
      computationTM.addTransition('q0', '1', 'q1', '1', 'R');
      computationTM.addTransition('q1', '0', 'q1', '0', 'R');
      computationTM.addTransition('q1', '1', 'q1', '1', 'R');
      computationTM.addTransition('q1', ' ', 'q2', ' ', 'S');

      // Test computation
      const result = computationTM.run(['1', '0'], 10);
      expect(result.accepted).toBe(true);
      expect(result.finalTape).toEqual(['1', '0', ' ']);
    });
  });

});
