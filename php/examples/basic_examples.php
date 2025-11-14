<?php

/**
 * Basic examples demonstrating the algorithms and data structures implementations.
 */

require_once 'algorithms/sorting.php';
require_once 'algorithms/approximations.php';
require_once 'algorithms/clustering.php';
require_once 'datastructures/LinkedList.php';
require_once 'datastructures/Stack.php';
require_once 'datastructures/Queue.php';
require_once 'datastructures/HashTable.php';

// Example 1: Sorting Algorithms
echo "=== Sorting Algorithms Examples ===\n";

$unsortedArray = [64, 34, 25, 12, 22, 11, 90];

echo "Original array: " . implode(', ', $unsortedArray) . "\n";

$sortedBubble = SortingAlgorithms::bubbleSort($unsortedArray);
echo "Bubble Sort: " . implode(', ', $sortedBubble) . "\n";

$sortedMerge = SortingAlgorithms::mergeSort($unsortedArray);
echo "Merge Sort: " . implode(', ', $sortedMerge) . "\n";

$sortedQuick = SortingAlgorithms::quickSort($unsortedArray);
echo "Quick Sort: " . implode(', ', $sortedQuick) . "\n";

echo "\n";

// Example 2: Multiplicative Approximations
echo "=== Multiplicative Approximations Examples ===\n";

$epsilon = 0.1;
$x = 100.0;
$y = 105.0;

$isApprox = isMultiplicativeApproximation($epsilon, $x, $y);
echo "Is {$y} a (1+{$epsilon})-approximation of {$x}? " . ($isApprox ? 'Yes' : 'No') . "\n";

$sequence = [100, 105, 95, 110, 90];
$flipNumber = calculateFlipNumber($sequence, $epsilon);
echo "Flip number of sequence [" . implode(', ', $sequence) . "] with epsilon {$epsilon}: {$flipNumber}\n";

echo "\n";

// Example 3: Data Structures
echo "=== Data Structures Examples ===\n";

// LinkedList
$list = new LinkedList();
$list->append(1);
$list->append(2);
$list->append(3);
$list->prepend(0);
echo "LinkedList: " . $list->toString() . "\n";

// Stack
$stack = new ArrayStack();
$stack->push(1);
$stack->push(2);
$stack->push(3);
echo "Stack after pushes: top = " . $stack->peek() . "\n";
$popped = $stack->pop();
echo "Popped: {$popped}, new top = " . $stack->peek() . "\n";

// Queue
$queue = new ArrayQueue();
$queue->enqueue(1);
$queue->enqueue(2);
$queue->enqueue(3);
echo "Queue after enqueues: front = " . $queue->front() . "\n";
$dequeued = $queue->dequeue();
echo "Dequeued: {$dequeued}, new front = " . $queue->front() . "\n";

// HashTable
$hashTable = new HashTable();
$hashTable->put('name', 'John');
$hashTable->put('age', 30);
$hashTable->put('city', 'New York');
echo "HashTable size: " . $hashTable->size() . "\n";
echo "HashTable contains 'name': " . ($hashTable->has('name') ? 'Yes' : 'No') . "\n";
echo "HashTable get 'name': " . $hashTable->get('name') . "\n";

echo "\n";

// Example 4: Correlation Clustering
echo "=== Correlation Clustering Example ===\n";

$vertices = [1, 2, 3, 4, 5];
$positiveEdges = [[1, 2], [2, 3], [4, 5]];
$negativeEdges = [[1, 4], [2, 5]];

$cc = new CorrelationClustering($vertices, $positiveEdges, $negativeEdges);
$clustering = $cc->greedyCorrelationClustering();

echo "Graph statistics:\n";
$stats = $cc->getGraphStats();
echo "- Vertices: {$stats['vertexCount']}\n";
echo "- Positive edges: {$stats['positiveEdgeCount']}\n";
echo "- Negative edges: {$stats['negativeEdgeCount']}\n";

$cc->printClustering($clustering);

echo "\nAll examples completed successfully!\n";

?>
