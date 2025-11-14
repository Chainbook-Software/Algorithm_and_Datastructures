"""
Python Algorithms and Data Structures Tutorial

This tutorial provides comprehensive examples and usage guides
for all implemented algorithms and data structures in Python.
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

class Tutorial:
    @staticmethod
    def run_all_tutorials():
        print("=== Python Algorithms and Data Structures Tutorial ===\n")

        Tutorial.tutorial_data_structures()
        Tutorial.tutorial_sorting_algorithms()
        Tutorial.tutorial_approximations()
        Tutorial.tutorial_clustering()
        Tutorial.tutorial_utils()
        Tutorial.tutorial_linear_programming()
        Tutorial.tutorial_subtree_mode()
        Tutorial.tutorial_estimator()
        Tutorial.tutorial_state_machine_algorithms()

        print("\n=== Tutorial Complete ===")

    @staticmethod
    def tutorial_data_structures():
        print("1. DATA STRUCTURES TUTORIAL")
        print("=" * 35)

        # LinkedList Tutorial
        print("\nLinkedList:")
        linked_list = LinkedList()
        linked_list.append(10)
        linked_list.append(20)
        linked_list.prepend(5)
        print(f"List after operations: {linked_list}")
        print(f"Size: {linked_list.size()}")
        print(f"Contains 10: {linked_list.contains(10)}")

        # Stack Tutorial
        print("\nStack:")
        stack = ArrayStack()
        stack.push(1)
        stack.push(2)
        stack.push(3)
        print(f"Stack size: {stack.size()}")
        print(f"Top element: {stack.peek()}")
        print(f"Popped: {stack.pop()}")
        print(f"New top: {stack.peek()}")

        # Queue Tutorial
        print("\nQueue:")
        queue = ArrayQueue()
        queue.enqueue('A')
        queue.enqueue('B')
        queue.enqueue('C')
        print(f"Queue size: {queue.size()}")
        print(f"Front element: {queue.front()}")
        print(f"Dequeued: {queue.dequeue()}")
        print(f"New front: {queue.front()}")

        # HashTable Tutorial
        print("\nHashTable:")
        hash_table = HashTable()
        hash_table.put('name', 'Alice')
        hash_table.put('age', 30)
        hash_table.put('city', 'New York')
        print(f"Name: {hash_table.get('name')}")
        print(f"Has 'age': {hash_table.has('age')}")
        print(f"Size: {hash_table.size()}")
        hash_table.remove('city')
        print(f"Size after removal: {hash_table.size()}")
        print()

    @staticmethod
    def tutorial_sorting_algorithms():
        print("2. SORTING ALGORITHMS TUTORIAL")
        print("=" * 36)

        unsorted = [64, 34, 25, 12, 22, 11, 90]
        print(f"Original array: {unsorted}\n")

        algorithms = [
            ('Bubble Sort', SortingAlgorithms.bubble_sort),
            ('Selection Sort', SortingAlgorithms.selection_sort),
            ('Insertion Sort', SortingAlgorithms.insertion_sort),
            ('Merge Sort', SortingAlgorithms.merge_sort),
            ('Quick Sort', SortingAlgorithms.quick_sort),
            ('Heap Sort', SortingAlgorithms.heap_sort)
        ]

        for name, method in algorithms:
            sorted_arr = method(unsorted)
            print(f"{name}: {sorted_arr}")

        print(f"\nIs sorted: {SortingAlgorithms.is_sorted([1, 2, 3, 4, 5])}")
        print()

    @staticmethod
    def tutorial_approximations():
        print("3. APPROXIMATIONS TUTORIAL")
        print("=" * 29)

        # Multiplicative Approximation
        print("\nMultiplicative Approximation:")
        approx = 0.1  # 10% approximation
        original = 100.0
        approximated = 105.0
        is_approx = is_multiplicative_approximation(approx, original, approximated)
        print(f"Is 105 a 10% approximation of 100? {is_approx}")

        # Flip Number
        print("\nFlip Number Calculation:")
        sequence = [100, 105, 95, 110, 90, 105, 95]
        epsilon = 0.1
        flip_number = calculate_flip_number(sequence, epsilon)
        print(f"Flip number for sequence with ε=0.1: {flip_number}")
        print()

    @staticmethod
    def tutorial_clustering():
        print("4. CLUSTERING TUTORIAL")
        print("=" * 24)

        vertices = [1, 2, 3, 4, 5]
        positive_edges = [(1, 2), (2, 3), (4, 5)]
        negative_edges = [(1, 4), (2, 5)]

        print(f"Vertices: {vertices}")
        print(f"Positive edges: {positive_edges}")
        print(f"Negative edges: {negative_edges}\n")

        cc = CorrelationClustering(vertices, positive_edges, negative_edges)
        result = cc.greedy_correlation_clustering()

        print("Clustering result:")
        print(f"Clusters: {result.clustering}")
        print(f"Objective value: {result.objective_value}")
        print(f"Valid clustering: {cc.validate_clustering(result.clustering)}")
        print()

    @staticmethod
    def tutorial_utils():
        print("5. UTILITIES TUTORIAL")
        print("=" * 22)

        # Range Utility
        print("\nRange Utility:")
        range_result = range_util(5)
        print(f"range_util(5): {range_result}")

        # Density Calculation
        print("\nDensity Calculation:")
        vector = [1, 0, 3, 0, 5, 0, 2]
        density = calculate_density(vector)
        print(f"Density of [1,0,3,0,5,0,2]: {density}")
        print()

    @staticmethod
    def tutorial_linear_programming():
        print("6. LINEAR PROGRAMMING TUTORIAL")
        print("=" * 33)

        # Example: Maximize 2x + 3y subject to x + y <= 4, 2x + y <= 5, x,y >= 0
        objective = [2.0, 3.0]
        constraints = [[1.0, 1.0], [2.0, 1.0]]
        rhs = [4.0, 5.0]
        objective_type = "max"
        constraint_types = ["<=", "<="]
        unrestricted_variables = [False, False]

        print("Original LP:")
        print("Maximize: 2x + 3y")
        print("Subject to: x + y <= 4")
        print("           2x + y <= 5")
        print("           x,y >= 0\n")

        canonical = CanonicalLPConverter.convert_to_canonical_form(
            objective, constraints, rhs, objective_type, constraint_types, unrestricted_variables
        )

        print("Canonical form:")
        print(f"Objective: {canonical['objective']}")
        print(f"Constraints: {canonical['constraints']}")
        print(f"RHS: {canonical['rhs']}")
        print(f"Variable bounds: {canonical['variable_bounds']}")
        print()

    @staticmethod
    def tutorial_subtree_mode():
        print("7. SUBTREE MODE TUTORIAL")
        print("=" * 25)

        # Create a tree: root -> (A:1, B:2, C:1) where A,B,C are leaves
        leaf_a = TreeNode(children=[], color=1)
        leaf_b = TreeNode(children=[], color=2)
        leaf_c = TreeNode(children=[], color=1)
        internal = TreeNode(children=[leaf_a, leaf_b, leaf_c], color=None)
        root = TreeNode(children=[internal], color=None)

        print("Tree structure:")
        print("Root -> Internal -> [LeafA(1), LeafB(2), LeafC(1)]\n")

        modes = subtree_mode(root)

        print("Subtree modes:")
        for node_id, mode in modes.items():
            print(f"Node {node_id}: mode = {mode}")
        print()

    @staticmethod
    def tutorial_estimator():
        print("8. ESTIMATOR TUTORIAL")
        print("=" * 22)

        # Create stream updates
        updates = [
            StreamUpdate(item_index=1, delta=1.0),    # Add 1.0 to item 1
            StreamUpdate(item_index=2, delta=2.0),    # Add 2.0 to item 2
            StreamUpdate(item_index=1, delta=-0.5),   # Subtract 0.5 from item 1
            StreamUpdate(item_index=3, delta=3.0),    # Add 3.0 to item 3
        ]

        print("Stream updates:")
        for update in updates:
            print(f"Item {update.item_index}: {update.delta}")
        print()

        # Calculate frequency vector
        vector_size = 3
        frequency_vector = calculate_frequency_vector(vector_size, updates, vector_size)
        print(f"Frequency vector: {frequency_vector}")

        # Oblivious streaming algorithm
        query_function = lambda vec: max(vec)
        epsilon = 0.1
        delta = 3.0
        vector_length = 3
        stream_length = 10

        result = oblivious_streaming_algorithm(
            query_function, epsilon, delta, vector_length, stream_length, updates
        )

        print(f"Oblivious streaming result: {result}")
        print()

    @staticmethod
    def tutorial_state_machine_algorithms():
        print("9. STATE MACHINE ALGORITHMS TUTORIAL")
        print("=" * 38)

        # Regex Compiler
        print("\nRegex Compiler:")
        compiler = RegexCompiler('ab')
        dfa = compiler.compile()
        print("DFA for regex 'ab':")
        print(f"States: {dfa['states']}")
        print(f"Transitions: {dfa['transitions']}")
        print(f"Accept states: {dfa['accept_states']}")

        # Lexical Analyzer
        print("\nLexical Analyzer:")
        analyzer = LexicalAnalyzer()
        code = "if x > 5 then return x * 2"
        tokens = analyzer.tokenize(code)
        print(f"Code: {code}")
        print(f"Tokens: {tokens}")

        # Binary Adder
        print("\nBinary Adder:")
        adder = BinaryAdder()
        result = adder.add('101', '110')  # 5 + 6 = 11
        print(f"101 + 110 = {result} (decimal: {int(result, 2)})")

        # Palindrome Recognizer
        print("\nPalindrome Recognizer:")
        recognizer = PalindromeRecognizer()
        test_strings = ['radar', 'level', 'hello', 'civic']

        for string in test_strings:
            is_palindrome = recognizer.is_palindrome(string)
            print(f"'{string}' is palindrome: {is_palindrome}")
        print()

# Run the tutorial
if __name__ == "__main__":
    Tutorial.run_all_tutorials()
