<?php

/**
 * Comprehensive test suite for PHP implementations
 */

require_once 'algorithms/sorting.php';
require_once 'algorithms/approximations.php';
require_once 'algorithms/clustering.php';
require_once 'algorithms/utils.php';
require_once 'algorithms/linearProgramming.php';
require_once 'algorithms/subtreeMode.php';
require_once 'algorithms/estimator.php';
require_once 'algorithms/stateMachineAlgorithms.php';
require_once 'datastructures/LinkedList.php';
require_once 'datastructures/Stack.php';
require_once 'datastructures/Queue.php';
require_once 'datastructures/HashTable.php';
require_once 'datastructures/Tree.php';

class TestSuite {
  private int $passed = 0;
  private int $failed = 0;
  private array $failures = [];

  public function run(): void {
    echo "Running PHP Test Suite...\n\n";

    $this->testSortingAlgorithms();
    $this->testApproximations();
    $this->testDataStructures();
    $this->testClustering();
    $this->testUtils();
    $this->testLinearProgramming();
    $this->testSubtreeMode();
    $this->testEstimator();
    $this->testStateMachineAlgorithms();

    echo "\nTest Results:\n";
    echo "Passed: {$this->passed}\n";
    echo "Failed: {$this->failed}\n";
    echo "Total: " . ($this->passed + $this->failed) . "\n";

    if (!empty($this->failures)) {
      echo "\nFailures:\n";
      foreach ($this->failures as $failure) {
        echo "- {$failure}\n";
      }
    }
  }

  private function assert(bool $condition, string $message): void {
    if ($condition) {
      $this->passed++;
      echo "✓ {$message}\n";
    } else {
      $this->failed++;
      echo "✗ {$message}\n";
      $this->failures[] = $message;
    }
  }

  private function testSortingAlgorithms(): void {
    echo "Testing Sorting Algorithms...\n";

    $arr = [64, 34, 25, 12, 22, 11, 90];
    $expected = [11, 12, 22, 25, 34, 64, 90];

    $this->assert(
      SortingAlgorithms::bubbleSort($arr) === $expected,
      "Bubble sort works correctly"
    );

    $this->assert(
      SortingAlgorithms::selectionSort($arr) === $expected,
      "Selection sort works correctly"
    );

    $this->assert(
      SortingAlgorithms::insertionSort($arr) === $expected,
      "Insertion sort works correctly"
    );

    $this->assert(
      SortingAlgorithms::mergeSort($arr) === $expected,
      "Merge sort works correctly"
    );

    $this->assert(
      SortingAlgorithms::quickSort($arr) === $expected,
      "Quick sort works correctly"
    );

    $this->assert(
      SortingAlgorithms::heapSort($arr) === $expected,
      "Heap sort works correctly"
    );

    $this->assert(
      SortingAlgorithms::isSorted($expected),
      "isSorted correctly identifies sorted array"
    );

    echo "\n";
  }

  private function testApproximations(): void {
    echo "Testing Approximations...\n";

    $this->assert(
      isMultiplicativeApproximation(0.1, 100.0, 105.0),
      "isMultiplicativeApproximation works correctly"
    );

    $sequence = [100, 105, 95, 110, 90];
    $flipNumber = calculateFlipNumber($sequence, 0.1);
    $this->assert(
      $flipNumber >= 0,
      "calculateFlipNumber returns valid result"
    );

    echo "\n";
  }

  private function testDataStructures(): void {
    echo "Testing Data Structures...\n";

    // LinkedList
    $list = new LinkedList();
    $list->append(1);
    $list->append(2);
    $list->prepend(0);
    $this->assert(
      $list->__toString() === "[0 -> 1 -> 2]",
      "LinkedList operations work correctly"
    );

    // Stack
    $stack = new ArrayStack();
    $stack->push(1);
    $stack->push(2);
    $this->assert(
      $stack->peek() === 2 && $stack->pop() === 2,
      "Stack operations work correctly"
    );

    // Queue
    $queue = new ArrayQueue();
    $queue->enqueue(1);
    $queue->enqueue(2);
    $this->assert(
      $queue->peek() === 1 && $queue->dequeue() === 1,
      "Queue operations work correctly"
    );

    // HashTable
    $hashTable = new HashTable();
    $hashTable->put('key', 'value');
    $this->assert(
      $hashTable->get('key') === 'value' && $hashTable->has('key'),
      "HashTable operations work correctly"
    );

    echo "\n";
  }

  private function testClustering(): void {
    echo "Testing Clustering Algorithms...\n";

    $vertices = [1, 2, 3, 4, 5];
    $positiveEdges = [[1, 2], [2, 3], [4, 5]];
    $negativeEdges = [[1, 4], [2, 5]];

    $cc = new CorrelationClustering($vertices, $positiveEdges, $negativeEdges);
    $clustering = $cc->greedyCorrelationClustering();

    $this->assert(
      $clustering instanceof Clustering,
      "Correlation clustering returns valid result"
    );

    $this->assert(
      $cc->validateClustering($clustering->clustering),
      "Clustering validation works"
    );

    echo "\n";
  }

  private function testUtils(): void {
    echo "Testing Utils...\n";

    $range = range_util(5);
    $this->assert(
      $range === [1, 2, 3, 4, 5],
      "range_util works correctly"
    );

    $density = calculateDensity([1, 0, 3, 0, 5]);
    $this->assert(
      $density === 3,
      "calculateDensity works correctly"
    );

    echo "\n";
  }

  private function testLinearProgramming(): void {
    echo "Testing Linear Programming...\n";

    $objective = [1.0, 2.0];
    $constraints = [[1.0, 1.0], [2.0, 1.0]];
    $rhs = [3.0, 4.0];
    $objectiveType = "max";
    $constraintTypes = ["<=", "<="];
    $unrestrictedVariables = [false, false];

    $result = CanonicalLPConverter::convertToCanonicalForm(
      $objective, $constraints, $rhs, $objectiveType, $constraintTypes, $unrestrictedVariables
    );

    $this->assert(
      isset($result['objective']) && isset($result['constraints']),
      "Linear programming conversion works"
    );

    echo "\n";
  }

  private function testSubtreeMode(): void {
    echo "Testing Subtree Mode...\n";

    // Create a simple tree
    $leaf1 = new TreeNode(1);
    $leaf2 = new TreeNode(2);
    $leaf3 = new TreeNode(1);
    $internal = new TreeNode(null, [$leaf1, $leaf2, $leaf3]);
    $root = new TreeNode(null, [$internal]);

    $modes = subtreeMode($root);
    $this->assert(
      is_array($modes) && count($modes) > 0,
      "Subtree mode calculation works"
    );

    echo "\n";
  }

  private function testEstimator(): void {
    echo "Testing Estimator...\n";

    $updates = [
      new StreamUpdate(1, 1.0),
      new StreamUpdate(2, 2.0),
      new StreamUpdate(1, -0.5)
    ];

    $v = calculateFrequencyVector(3, $updates, 3);
    $this->assert(
      count($v) === 3 && $v[0] === 0.5 && $v[1] === 2.0,
      "Frequency vector calculation works"
    );

    $result = obliviousStreamingAlgorithm(
      function($vec) { return max($vec); },
      0.1, 3.0, 3, 10, $updates
    );

    $this->assert(
      $result !== null,
      "Oblivious streaming algorithm works"
    );

    echo "\n";
  }

  private function testStateMachineAlgorithms(): void {
    echo "Testing State Machine Algorithms...\n";

    // Regex Compiler
    $compiler = new RegexCompiler('ab');
    $dfa = $compiler->compile();
    $this->assert(
      isset($dfa['states']) && isset($dfa['transitions']),
      "Regex compiler works"
    );

    // Lexical Analyzer
    $analyzer = new LexicalAnalyzer();
    $tokens = $analyzer->tokenize("if x > 5 then return x");
    $this->assert(
      count($tokens) > 0,
      "Lexical analyzer works"
    );

    // Binary Adder
    $adder = new BinaryAdder();
    $result = $adder->add("101", "110");
    $this->assert(
      $result === "1011",  // 5 + 6 = 11 in binary
      "Binary adder works"
    );

    // Palindrome Recognizer
    $recognizer = new PalindromeRecognizer();
    $this->assert(
      $recognizer->isPalindrome("radar"),
      "Palindrome recognizer works for palindromes"
    );
    $this->assert(
      !$recognizer->isPalindrome("hello"),
      "Palindrome recognizer works for non-palindromes"
    );

    echo "\n";
  }
}

// Run the test suite
$suite = new TestSuite();
$suite->run();

?>
