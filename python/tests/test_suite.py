"""
Comprehensive test suite for Python implementations
"""

from algorithms.sorting import SortingAlgorithms
from algorithms.approximations import is_multiplicative_approximation, calculate_flip_number
from algorithms.clustering import CorrelationClustering
from algorithms.utils import range_util, calculate_density
from algorithms.linear_programming import CanonicalLPConverter
from algorithms.subtree_mode import subtree_mode
from algorithms.estimator import calculate_frequency_vector, oblivious_streaming_algorithm, StreamUpdate
from algorithms.state_machine_algorithms import RegexCompiler, LexicalAnalyzer, BinaryAdder, PalindromeRecognizer
from datastructures.linked_list import LinkedList
from datastructures.stack import ArrayStack
from datastructures.queue import ArrayQueue
from datastructures.hash_table import HashTable
from datastructures.tree import TreeNode

class TestSuite:
  def __init__(self):
    self.passed = 0
    self.failed = 0
    self.failures = []

  def run(self):
    print("Running Python Test Suite...\n")

    self.test_sorting_algorithms()
    self.test_approximations()
    self.test_data_structures()
    self.test_clustering()
    self.test_utils()
    self.test_linear_programming()
    self.test_subtree_mode()
    self.test_estimator()
    self.test_state_machine_algorithms()

    print("\nTest Results:")
    print(f"Passed: {self.passed}")
    print(f"Failed: {self.failed}")
    print(f"Total: {self.passed + self.failed}")

    if self.failures:
      print("\nFailures:")
      for failure in self.failures:
        print(f"- {failure}")

  def assert_test(self, condition: bool, message: str):
    if condition:
      self.passed += 1
      print(f"✓ {message}")
    else:
      self.failed += 1
      print(f"✗ {message}")
      self.failures.append(message)

  def test_sorting_algorithms(self):
    print("Testing Sorting Algorithms...")

    arr = [64, 34, 25, 12, 22, 11, 90]
    expected = [11, 12, 22, 25, 34, 64, 90]

    self.assert_test(
      SortingAlgorithms.bubble_sort(arr) == expected,
      "Bubble sort works correctly"
    )

    self.assert_test(
      SortingAlgorithms.selection_sort(arr) == expected,
      "Selection sort works correctly"
    )

    self.assert_test(
      SortingAlgorithms.insertion_sort(arr) == expected,
      "Insertion sort works correctly"
    )

    self.assert_test(
      SortingAlgorithms.merge_sort(arr) == expected,
      "Merge sort works correctly"
    )

    self.assert_test(
      SortingAlgorithms.quick_sort(arr) == expected,
      "Quick sort works correctly"
    )

    self.assert_test(
      SortingAlgorithms.heap_sort(arr) == expected,
      "Heap sort works correctly"
    )

    self.assert_test(
      SortingAlgorithms.is_sorted(expected),
      "is_sorted correctly identifies sorted array"
    )

    print()

  def test_approximations(self):
    print("Testing Approximations...")

    self.assert_test(
      is_multiplicative_approximation(0.1, 100.0, 105.0),
      "is_multiplicative_approximation works correctly"
    )

    sequence = [100, 105, 95, 110, 90]
    flip_number = calculate_flip_number(sequence, 0.1)
    self.assert_test(
      flip_number >= 0,
      "calculate_flip_number returns valid result"
    )

    print()

  def test_data_structures(self):
    print("Testing Data Structures...")

    # LinkedList
    linked_list = LinkedList()
    linked_list.append(1)
    linked_list.append(2)
    linked_list.prepend(0)
    self.assert_test(
      str(linked_list) == "[0 -> 1 -> 2]",
      "LinkedList operations work correctly"
    )

    # Stack
    stack = ArrayStack()
    stack.push(1)
    stack.push(2)
    self.assert_test(
      stack.peek() == 2 and stack.pop() == 2,
      "Stack operations work correctly"
    )

    # Queue
    queue = ArrayQueue()
    queue.enqueue(1)
    queue.enqueue(2)
    self.assert_test(
      queue.peek() == 1 and queue.dequeue() == 1,
      "Queue operations work correctly"
    )

    # HashTable
    hash_table = HashTable()
    hash_table.put('key', 'value')
    self.assert_test(
      hash_table.get('key') == 'value' and hash_table.has('key'),
      "HashTable operations work correctly"
    )

    print()

  def test_clustering(self):
    print("Testing Clustering Algorithms...")

    vertices = [1, 2, 3, 4, 5]
    positive_edges = [(1, 2), (2, 3), (4, 5)]
    negative_edges = [(1, 4), (2, 5)]

    cc = CorrelationClustering(vertices, positive_edges, negative_edges)
    clustering = cc.greedy_correlation_clustering()

    self.assert_test(
      clustering.clustering is not None,
      "Correlation clustering returns valid result"
    )

    self.assert_test(
      cc.validate_clustering(clustering.clustering),
      "Clustering validation works"
    )

    print()

  def test_utils(self):
    print("Testing Utils...")

    range_result = range_util(5)
    self.assert_test(
      range_result == [1, 2, 3, 4, 5],
      "range_util works correctly"
    )

    density = calculate_density([1, 0, 3, 0, 5])
    self.assert_test(
      density == 3,
      "calculate_density works correctly"
    )

    print()

  def test_linear_programming(self):
    print("Testing Linear Programming...")

    objective = [1.0, 2.0]
    constraints = [[1.0, 1.0], [2.0, 1.0]]
    rhs = [3.0, 4.0]
    objective_type = "max"
    constraint_types = ["<=", "<="]
    unrestricted_variables = [False, False]

    result = CanonicalLPConverter.convert_to_canonical_form(
      objective, constraints, rhs, objective_type, constraint_types, unrestricted_variables
    )

    self.assert_test(
      'objective' in result and 'constraints' in result,
      "Linear programming conversion works"
    )

    print()

  def test_subtree_mode(self):
    print("Testing Subtree Mode...")

    # Create a simple tree
    leaf1 = TreeNode(children=[], color=1)
    leaf2 = TreeNode(children=[], color=2)
    leaf3 = TreeNode(children=[], color=1)
    internal = TreeNode(children=[leaf1, leaf2, leaf3], color=None)
    root = TreeNode(children=[internal], color=None)

    modes = subtree_mode(root)
    self.assert_test(
      isinstance(modes, dict) and len(modes) > 0,
      "Subtree mode calculation works"
    )

    print()

  def test_estimator(self):
    print("Testing Estimator...")

    updates = [
      StreamUpdate(item_index=1, delta=1.0),
      StreamUpdate(item_index=2, delta=2.0),
      StreamUpdate(item_index=1, delta=-0.5)
    ]

    v = calculate_frequency_vector(3, updates, 3)
    self.assert_test(
      len(v) == 3 and v[0] == 0.5 and v[1] == 2.0,
      "Frequency vector calculation works"
    )

    result = oblivious_streaming_algorithm(
      lambda vec: max(vec),
      0.1, 3.0, 3, 10, updates
    )

    self.assert_test(
      result is not None,
      "Oblivious streaming algorithm works"
    )

    print()

  def test_state_machine_algorithms(self):
    print("Testing State Machine Algorithms...")

    # Regex Compiler
    compiler = RegexCompiler('ab')
    dfa = compiler.compile()
    self.assert_test(
      'states' in dfa and 'transitions' in dfa,
      "Regex compiler works"
    )

    # Lexical Analyzer
    analyzer = LexicalAnalyzer()
    tokens = analyzer.tokenize("if x > 5 then return x")
    self.assert_test(
      len(tokens) > 0,
      "Lexical analyzer works"
    )

    # Binary Adder
    adder = BinaryAdder()
    result = adder.add("101", "110")
    self.assert_test(
      result == "1011",  # 5 + 6 = 11 in binary
      "Binary adder works"
    )

    # Palindrome Recognizer
    recognizer = PalindromeRecognizer()
    self.assert_test(
      recognizer.is_palindrome("radar"),
      "Palindrome recognizer works for palindromes"
    )
    self.assert_test(
      not recognizer.is_palindrome("hello"),
      "Palindrome recognizer works for non-palindromes"
    )

    print()

# Run the test suite
if __name__ == "__main__":
  suite = TestSuite()
  suite.run()
