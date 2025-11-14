<?php
/**
 * PHP Algorithms and Data Structures Tutorial
 *
 * This tutorial provides comprehensive examples and usage guides
 * for all implemented algorithms and data structures in PHP.
 */

// Include all necessary files
require_once __DIR__ . '/../algorithms/sorting.php';
require_once __DIR__ . '/../algorithms/approximations.php';
require_once __DIR__ . '/../algorithms/clustering.php';
require_once __DIR__ . '/../algorithms/utils.php';
require_once __DIR__ . '/../algorithms/linearProgramming.php';
require_once __DIR__ . '/../algorithms/subtreeMode.php';
require_once __DIR__ . '/../algorithms/estimator.php';
require_once __DIR__ . '/../algorithms/stateMachineAlgorithms.php';
require_once __DIR__ . '/../datastructures/LinkedList.php';
require_once __DIR__ . '/../datastructures/Stack.php';
require_once __DIR__ . '/../datastructures/Queue.php';
require_once __DIR__ . '/../datastructures/HashTable.php';
require_once __DIR__ . '/../datastructures/Tree.php';

class Tutorial {
    public static function runAllTutorials() {
        echo "=== PHP Algorithms and Data Structures Tutorial ===\n\n";

        self::tutorialDataStructures();
        self::tutorialSortingAlgorithms();
        self::tutorialApproximations();
        self::tutorialClustering();
        self::tutorialUtils();
        self::tutorialLinearProgramming();
        self::tutorialSubtreeMode();
        self::tutorialEstimator();
        self::tutorialStateMachineAlgorithms();

        echo "\n=== Tutorial Complete ===\n";
    }

    public static function tutorialDataStructures() {
        echo "1. DATA STRUCTURES TUTORIAL\n";
        echo "===========================\n\n";

        // LinkedList Tutorial
        echo "LinkedList:\n";
        $list = new LinkedList();
        $list->append(10);
        $list->append(20);
        $list->prepend(5);
        echo "List after operations: " . $list . "\n";
        echo "Size: " . $list->size() . "\n";
        echo "Contains 10: " . ($list->contains(10) ? 'true' : 'false') . "\n\n";

        // Stack Tutorial
        echo "Stack:\n";
        $stack = new ArrayStack();
        $stack->push(1);
        $stack->push(2);
        $stack->push(3);
        echo "Stack size: " . $stack->size() . "\n";
        echo "Top element: " . $stack->peek() . "\n";
        echo "Popped: " . $stack->pop() . "\n";
        echo "New top: " . $stack->peek() . "\n\n";

        // Queue Tutorial
        echo "Queue:\n";
        $queue = new ArrayQueue();
        $queue->enqueue('A');
        $queue->enqueue('B');
        $queue->enqueue('C');
        echo "Queue size: " . $queue->size() . "\n";
        echo "Front element: " . $queue->front() . "\n";
        echo "Dequeued: " . $queue->dequeue() . "\n";
        echo "New front: " . $queue->front() . "\n\n";

        // HashTable Tutorial
        echo "HashTable:\n";
        $hashTable = new HashTable();
        $hashTable->put('name', 'Alice');
        $hashTable->put('age', 30);
        $hashTable->put('city', 'New York');
        echo "Name: " . $hashTable->get('name') . "\n";
        echo "Has 'age': " . ($hashTable->has('age') ? 'true' : 'false') . "\n";
        echo "Size: " . $hashTable->size() . "\n";
        $hashTable->remove('city');
        echo "Size after removal: " . $hashTable->size() . "\n\n";
    }

    public static function tutorialSortingAlgorithms() {
        echo "2. SORTING ALGORITHMS TUTORIAL\n";
        echo "===============================\n\n";

        $unsorted = [64, 34, 25, 12, 22, 11, 90];
        echo "Original array: " . implode(', ', $unsorted) . "\n\n";

        $algorithms = [
            'Bubble Sort' => 'bubble_sort',
            'Selection Sort' => 'selection_sort',
            'Insertion Sort' => 'insertion_sort',
            'Merge Sort' => 'merge_sort',
            'Quick Sort' => 'quick_sort',
            'Heap Sort' => 'heap_sort'
        ];

        foreach ($algorithms as $name => $method) {
            $sorted = SortingAlgorithms::$method($unsorted);
            echo "$name: " . implode(', ', $sorted) . "\n";
        }

        echo "\nIs sorted: " . (SortingAlgorithms::is_sorted([1, 2, 3, 4, 5]) ? 'true' : 'false') . "\n\n";
    }

    public static function tutorialApproximations() {
        echo "3. APPROXIMATIONS TUTORIAL\n";
        echo "==========================\n\n";

        // Multiplicative Approximation
        echo "Multiplicative Approximation:\n";
        $approx = 0.1; // 10% approximation
        $original = 100.0;
        $approximated = 105.0;
        $isApprox = is_multiplicative_approximation($approx, $original, $approximated);
        echo "Is 105 a 10% approximation of 100? " . ($isApprox ? 'Yes' : 'No') . "\n\n";

        // Flip Number
        echo "Flip Number Calculation:\n";
        $sequence = [100, 105, 95, 110, 90, 105, 95];
        $epsilon = 0.1;
        $flipNumber = calculate_flip_number($sequence, $epsilon);
        echo "Flip number for sequence with ε=0.1: $flipNumber\n\n";
    }

    public static function tutorialClustering() {
        echo "4. CLUSTERING TUTORIAL\n";
        echo "======================\n\n";

        $vertices = [1, 2, 3, 4, 5];
        $positiveEdges = [[1, 2], [2, 3], [4, 5]];
        $negativeEdges = [[1, 4], [2, 5]];

        echo "Vertices: " . implode(', ', $vertices) . "\n";
        echo "Positive edges: " . json_encode($positiveEdges) . "\n";
        echo "Negative edges: " . json_encode($negativeEdges) . "\n\n";

        $cc = new CorrelationClustering($vertices, $positiveEdges, $negativeEdges);
        $result = $cc->greedy_correlation_clustering();

        echo "Clustering result:\n";
        echo "Clusters: " . json_encode($result->clustering) . "\n";
        echo "Objective value: " . $result->objective_value . "\n";
        echo "Valid clustering: " . ($cc->validate_clustering($result->clustering) ? 'Yes' : 'No') . "\n\n";
    }

    public static function tutorialUtils() {
        echo "5. UTILITIES TUTORIAL\n";
        echo "=====================\n\n";

        // Range Utility
        echo "Range Utility:\n";
        $range = range_util(5);
        echo "range_util(5): " . implode(', ', $range) . "\n\n";

        // Density Calculation
        echo "Density Calculation:\n";
        $vector = [1, 0, 3, 0, 5, 0, 2];
        $density = calculate_density($vector);
        echo "Density of [1,0,3,0,5,0,2]: $density\n\n";
    }

    public static function tutorialLinearProgramming() {
        echo "6. LINEAR PROGRAMMING TUTORIAL\n";
        echo "===============================\n\n";

        // Example: Maximize 2x + 3y subject to x + y <= 4, 2x + y <= 5, x,y >= 0
        $objective = [2.0, 3.0];
        $constraints = [[1.0, 1.0], [2.0, 1.0]];
        $rhs = [4.0, 5.0];
        $objectiveType = "max";
        $constraintTypes = ["<=", "<="];
        $unrestrictedVariables = [false, false];

        echo "Original LP:\n";
        echo "Maximize: 2x + 3y\n";
        echo "Subject to: x + y <= 4\n";
        echo "           2x + y <= 5\n";
        echo "           x,y >= 0\n\n";

        $canonical = CanonicalLPConverter::convert_to_canonical_form(
            $objective, $constraints, $rhs, $objectiveType, $constraintTypes, $unrestrictedVariables
        );

        echo "Canonical form:\n";
        echo "Objective: " . json_encode($canonical['objective']) . "\n";
        echo "Constraints: " . json_encode($canonical['constraints']) . "\n";
        echo "RHS: " . json_encode($canonical['rhs']) . "\n";
        echo "Variable bounds: " . json_encode($canonical['variable_bounds']) . "\n\n";
    }

    public static function tutorialSubtreeMode() {
        echo "7. SUBTREE MODE TUTORIAL\n";
        echo "========================\n\n";

        // Create a tree: root -> (A:1, B:2, C:1) where A,B,C are leaves
        $leafA = new TreeNode(null, 1);
        $leafB = new TreeNode(null, 2);
        $leafC = new TreeNode(null, 1);
        $internal = new TreeNode(null, null, [$leafA, $leafB, $leafC]);
        $root = new TreeNode(null, null, [$internal]);

        echo "Tree structure:\n";
        echo "Root -> Internal -> [LeafA(1), LeafB(2), LeafC(1)]\n\n";

        $modes = subtree_mode($root);

        echo "Subtree modes:\n";
        foreach ($modes as $nodeId => $mode) {
            echo "Node $nodeId: mode = $mode\n";
        }
        echo "\n";
    }

    public static function tutorialEstimator() {
        echo "8. ESTIMATOR TUTORIAL\n";
        echo "=====================\n\n";

        // Create stream updates
        $updates = [
            new StreamUpdate(1, 1.0),    // Add 1.0 to item 1
            new StreamUpdate(2, 2.0),    // Add 2.0 to item 2
            new StreamUpdate(1, -0.5),   // Subtract 0.5 from item 1
            new StreamUpdate(3, 3.0),    // Add 3.0 to item 3
        ];

        echo "Stream updates:\n";
        foreach ($updates as $update) {
            echo "Item {$update->item_index}: {$update->delta}\n";
        }
        echo "\n";

        // Calculate frequency vector
        $vectorSize = 3;
        $frequencyVector = calculate_frequency_vector($vectorSize, $updates, $vectorSize);
        echo "Frequency vector: " . json_encode($frequencyVector) . "\n\n";

        // Oblivious streaming algorithm
        $queryFunction = function($vec) { return max($vec); };
        $epsilon = 0.1;
        $delta = 3.0;
        $vectorLength = 3;
        $streamLength = 10;

        $result = oblivious_streaming_algorithm(
            $queryFunction, $epsilon, $delta, $vectorLength, $streamLength, $updates
        );

        echo "Oblivious streaming result: $result\n\n";
    }

    public static function tutorialStateMachineAlgorithms() {
        echo "9. STATE MACHINE ALGORITHMS TUTORIAL\n";
        echo "====================================\n\n";

        // Regex Compiler
        echo "Regex Compiler:\n";
        $compiler = new RegexCompiler('ab');
        $dfa = $compiler->compile();
        echo "DFA for regex 'ab':\n";
        echo "States: " . json_encode($dfa['states']) . "\n";
        echo "Transitions: " . json_encode($dfa['transitions']) . "\n";
        echo "Accept states: " . json_encode($dfa['accept_states']) . "\n\n";

        // Lexical Analyzer
        echo "Lexical Analyzer:\n";
        $analyzer = new LexicalAnalyzer();
        $code = "if x > 5 then return x * 2";
        $tokens = $analyzer->tokenize($code);
        echo "Code: $code\n";
        echo "Tokens: " . json_encode($tokens) . "\n\n";

        // Binary Adder
        echo "Binary Adder:\n";
        $adder = new BinaryAdder();
        $result = $adder->add('101', '110'); // 5 + 6 = 11
        echo "101 + 110 = $result (decimal: " . bindec($result) . ")\n\n";

        // Palindrome Recognizer
        echo "Palindrome Recognizer:\n";
        $recognizer = new PalindromeRecognizer();
        $testStrings = ['radar', 'level', 'hello', 'civic'];

        foreach ($testStrings as $str) {
            $isPalindrome = $recognizer->is_palindrome($str);
            echo "'$str' is palindrome: " . ($isPalindrome ? 'Yes' : 'No') . "\n";
        }
        echo "\n";
    }
}

// Run the tutorial
Tutorial::runAllTutorials();
?>
