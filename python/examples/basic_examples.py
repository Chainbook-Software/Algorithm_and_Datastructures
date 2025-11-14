"""
Basic examples demonstrating the algorithms and data structures implementations.
"""

from algorithms.sorting import SortingAlgorithms
from algorithms.approximations import is_multiplicative_approximation, calculate_flip_number
from algorithms.clustering import CorrelationClustering
from datastructures.linked_list import LinkedList
from datastructures.stack import ArrayStack
from datastructures.queue import ArrayQueue
from datastructures.hash_table import HashTable

def main():
    # Example 1: Sorting Algorithms
    print("=== Sorting Algorithms Examples ===")

    unsorted_array = [64, 34, 25, 12, 22, 11, 90]

    print(f"Original array: {unsorted_array}")

    sorted_bubble = SortingAlgorithms.bubble_sort(unsorted_array)
    print(f"Bubble Sort: {sorted_bubble}")

    sorted_merge = SortingAlgorithms.merge_sort(unsorted_array)
    print(f"Merge Sort: {sorted_merge}")

    sorted_quick = SortingAlgorithms.quick_sort(unsorted_array)
    print(f"Quick Sort: {sorted_quick}")

    print()

    # Example 2: Multiplicative Approximations
    print("=== Multiplicative Approximations Examples ===")

    epsilon = 0.1
    x = 100.0
    y = 105.0

    is_approx = is_multiplicative_approximation(epsilon, x, y)
    print(f"Is {y} a (1+{epsilon})-approximation of {x}? {'Yes' if is_approx else 'No'}")

    sequence = [100, 105, 95, 110, 90]
    flip_number = calculate_flip_number(sequence, epsilon)
    print(f"Flip number of sequence {sequence} with epsilon {epsilon}: {flip_number}")

    print()

    # Example 3: Data Structures
    print("=== Data Structures Examples ===")

    # LinkedList
    linked_list = LinkedList()
    linked_list.append(1)
    linked_list.append(2)
    linked_list.append(3)
    linked_list.prepend(0)
    print(f"LinkedList: {linked_list}")

    # Stack
    stack = ArrayStack()
    stack.push(1)
    stack.push(2)
    stack.push(3)
    print(f"Stack after pushes: top = {stack.peek()}")
    popped = stack.pop()
    print(f"Popped: {popped}, new top = {stack.peek()}")

    # Queue
    queue = ArrayQueue()
    queue.enqueue(1)
    queue.enqueue(2)
    queue.enqueue(3)
    print(f"Queue after enqueues: front = {queue.front()}")
    dequeued = queue.dequeue()
    print(f"Dequeued: {dequeued}, new front = {queue.front()}")

    # HashTable
    hash_table = HashTable()
    hash_table.put('name', 'John')
    hash_table.put('age', 30)
    hash_table.put('city', 'New York')
    print(f"HashTable size: {hash_table.size()}")
    print(f"HashTable contains 'name': {'Yes' if hash_table.has('name') else 'No'}")
    print(f"HashTable get 'name': {hash_table.get('name')}")

    print()

    # Example 4: Correlation Clustering
    print("=== Correlation Clustering Example ===")

    vertices = [1, 2, 3, 4, 5]
    positive_edges = [(1, 2), (2, 3), (4, 5)]
    negative_edges = [(1, 4), (2, 5)]

    cc = CorrelationClustering(vertices, positive_edges, negative_edges)
    clustering = cc.greedy_correlation_clustering()

    print("Graph statistics:")
    stats = cc.get_graph_stats()
    print(f"- Vertices: {stats['vertex_count']}")
    print(f"- Positive edges: {stats['positive_edge_count']}")
    print(f"- Negative edges: {stats['negative_edge_count']}")

    cc.print_clustering(clustering)

    print("\nAll examples completed successfully!")

if __name__ == "__main__":
    main()
