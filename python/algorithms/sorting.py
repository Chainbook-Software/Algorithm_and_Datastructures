"""
Sorting Algorithms Implementation in Python

This file contains various sorting algorithms with their time and space complexity analysis.
"""

from typing import List, Callable, Any, Optional

class SortingAlgorithms:

  @staticmethod
  def bubble_sort(arr: List[Any], compare: Optional[Callable[[Any, Any], int]] = None) -> List[Any]:
    """Bubble Sort
    Time: O(n²) worst/average, O(n) best
    Space: O(1)
    Stable: Yes
    """
    if compare is None:
      compare = lambda a, b: (a > b) - (a < b)

    result = arr.copy()
    n = len(result)

    for i in range(n - 1):
      swapped = False

      for j in range(n - i - 1):
        if compare(result[j], result[j + 1]) > 0:
          result[j], result[j + 1] = result[j + 1], result[j]
          swapped = True

      # If no swaps occurred, array is already sorted
      if not swapped:
        break

    return result

  @staticmethod
  def selection_sort(arr: List[Any], compare: Optional[Callable[[Any, Any], int]] = None) -> List[Any]:
    """Selection Sort
    Time: O(n²) worst/average/best
    Space: O(1)
    Stable: No
    """
    if compare is None:
      compare = lambda a, b: (a > b) - (a < b)

    result = arr.copy()
    n = len(result)

    for i in range(n - 1):
      min_index = i

      for j in range(i + 1, n):
        if compare(result[j], result[min_index]) < 0:
          min_index = j

      if min_index != i:
        result[i], result[min_index] = result[min_index], result[i]

    return result

  @staticmethod
  def insertion_sort(arr: List[Any], compare: Optional[Callable[[Any, Any], int]] = None) -> List[Any]:
    """Insertion Sort
    Time: O(n²) worst/average, O(n) best
    Space: O(1)
    Stable: Yes
    """
    if compare is None:
      compare = lambda a, b: (a > b) - (a < b)

    result = arr.copy()
    n = len(result)

    for i in range(1, n):
      key = result[i]
      j = i - 1

      while j >= 0 and compare(result[j], key) > 0:
        result[j + 1] = result[j]
        j -= 1

      result[j + 1] = key

    return result

  @staticmethod
  def merge_sort(arr: List[Any], compare: Optional[Callable[[Any, Any], int]] = None) -> List[Any]:
    """Merge Sort
    Time: O(n log n) worst/average/best
    Space: O(n)
    Stable: Yes
    """
    if compare is None:
      compare = lambda a, b: (a > b) - (a < b)

    n = len(arr)
    if n <= 1:
      return arr.copy()

    mid = n // 2
    left = SortingAlgorithms.merge_sort(arr[:mid], compare)
    right = SortingAlgorithms.merge_sort(arr[mid:], compare)

    return SortingAlgorithms._merge(left, right, compare)

  @staticmethod
  def _merge(left: List[Any], right: List[Any], compare: Callable[[Any, Any], int]) -> List[Any]:
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
      if compare(left[i], right[j]) <= 0:
        result.append(left[i])
        i += 1
      else:
        result.append(right[j])
        j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result

  @staticmethod
  def quick_sort(arr: List[Any], compare: Optional[Callable[[Any, Any], int]] = None) -> List[Any]:
    """Quick Sort
    Time: O(n²) worst, O(n log n) average/best
    Space: O(log n) due to recursion
    Stable: No
    """
    if compare is None:
      compare = lambda a, b: (a > b) - (a < b)

    result = arr.copy()
    SortingAlgorithms._quick_sort_helper(result, 0, len(result) - 1, compare)
    return result

  @staticmethod
  def _quick_sort_helper(arr: List[Any], low: int, high: int, compare: Callable[[Any, Any], int]) -> None:
    if low < high:
      pivot_index = SortingAlgorithms._partition(arr, low, high, compare)
      SortingAlgorithms._quick_sort_helper(arr, low, pivot_index - 1, compare)
      SortingAlgorithms._quick_sort_helper(arr, pivot_index + 1, high, compare)

  @staticmethod
  def _partition(arr: List[Any], low: int, high: int, compare: Callable[[Any, Any], int]) -> int:
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
      if compare(arr[j], pivot) <= 0:
        i += 1
        arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

  @staticmethod
  def heap_sort(arr: List[Any], compare: Optional[Callable[[Any, Any], int]] = None) -> List[Any]:
    """Heap Sort
    Time: O(n log n) worst/average/best
    Space: O(1)
    Stable: No
    """
    if compare is None:
      compare = lambda a, b: (a > b) - (a < b)

    result = arr.copy()
    n = len(result)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
      SortingAlgorithms._heapify(result, n, i, compare)

    # Extract elements from heap
    for i in range(n - 1, 0, -1):
      result[0], result[i] = result[i], result[0]
      SortingAlgorithms._heapify(result, i, 0, compare)

    return result

  @staticmethod
  def _heapify(arr: List[Any], n: int, i: int, compare: Callable[[Any, Any], int]) -> None:
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and compare(arr[left], arr[largest]) > 0:
      largest = left

    if right < n and compare(arr[right], arr[largest]) > 0:
      largest = right

    if largest != i:
      arr[i], arr[largest] = arr[largest], arr[i]
      SortingAlgorithms._heapify(arr, n, largest, compare)

  @staticmethod
  def counting_sort(arr: List[int]) -> List[int]:
    """Counting Sort (for integers)
    Time: O(n + k) where k is the range of input
    Space: O(n + k)
    Stable: Yes
    """
    if not arr:
      return []

    min_val = min(arr)
    max_val = max(arr)
    range_val = max_val - min_val + 1

    count = [0] * range_val
    output = [0] * len(arr)

    # Count occurrences
    for num in arr:
      count[num - min_val] += 1

    # Cumulative count
    for i in range(1, len(count)):
      count[i] += count[i - 1]

    # Build output array
    for i in range(len(arr) - 1, -1, -1):
      output[count[arr[i] - min_val] - 1] = arr[i]
      count[arr[i] - min_val] -= 1

    return output

  @staticmethod
  def radix_sort(arr: List[int]) -> List[int]:
    """Radix Sort (for positive integers)
    Time: O(n * d) where d is the number of digits
    Space: O(n + k)
    Stable: Yes
    """
    if not arr:
      return []

    result = arr.copy()
    max_val = max(result)
    max_digits = len(str(max_val))

    for digit in range(max_digits):
      result = SortingAlgorithms._counting_sort_by_digit(result, digit)

    return result

  @staticmethod
  def _counting_sort_by_digit(arr: List[int], digit: int) -> List[int]:
    count = [0] * 10
    output = [0] * len(arr)

    # Count occurrences of each digit
    for num in arr:
      digit_val = (num // (10 ** digit)) % 10
      count[digit_val] += 1

    # Cumulative count
    for i in range(1, len(count)):
      count[i] += count[i - 1]

    # Build output array
    for i in range(len(arr) - 1, -1, -1):
      digit_val = (arr[i] // (10 ** digit)) % 10
      output[count[digit_val] - 1] = arr[i]
      count[digit_val] -= 1

    return output

  @staticmethod
  def bucket_sort(arr: List[float], bucket_size: int = 5) -> List[float]:
    """Bucket Sort
    Time: O(n + k) average case
    Space: O(n + k)
    Stable: Depends on bucket sort implementation
    """
    if not arr:
      return []

    min_val = min(arr)
    max_val = max(arr)
    bucket_count = int((max_val - min_val) / bucket_size) + 1
    buckets: List[List[float]] = [[] for _ in range(bucket_count)]

    # Distribute elements into buckets
    for num in arr:
      bucket_index = int((num - min_val) / bucket_size)
      buckets[bucket_index].append(num)

    # Sort each bucket and concatenate
    sorted_arr = []
    for bucket in buckets:
      if bucket:
        sorted_arr.extend(SortingAlgorithms.insertion_sort(bucket))

    return sorted_arr

  @staticmethod
  def timsort(arr: List[Any], compare: Optional[Callable[[Any, Any], int]] = None) -> List[Any]:
    """Timsort (hybrid sorting algorithm used in Python and Java)
    Time: O(n log n) worst case
    Space: O(n)
    Stable: Yes
    """
    if compare is None:
      compare = lambda a, b: (a > b) - (a < b)

    result = arr.copy()
    n = len(result)
    min_run = SortingAlgorithms._calc_min_run(n)

    # Sort individual subarrays of size minRun
    for i in range(0, n, min_run):
      end = min(i + min_run, n)
      subarray = result[i:end]
      sorted_subarray = SortingAlgorithms.insertion_sort(subarray, compare)
      result[i:end] = sorted_subarray

    # Merge sorted subarrays
    size = min_run
    while size < n:
      for left in range(0, n, 2 * size):
        mid = left + size - 1
        right = min(left + 2 * size - 1, n - 1)

        if mid < right:
          left_part = result[left:mid + 1]
          right_part = result[mid + 1:right + 1]
          merged = SortingAlgorithms._merge(left_part, right_part, compare)
          result[left:right + 1] = merged

      size *= 2

    return result

  @staticmethod
  def _calc_min_run(n: int) -> int:
    r = 0
    while n >= 64:
      r |= n & 1
      n >>= 1
    return n + r

  @staticmethod
  def is_sorted(arr: List[Any], compare: Optional[Callable[[Any, Any], int]] = None) -> bool:
    """Check if an array is sorted"""
    if compare is None:
      compare = lambda a, b: (a > b) - (a < b)

    for i in range(1, len(arr)):
      if compare(arr[i - 1], arr[i]) > 0:
        return False
    return True

  @staticmethod
  def get_algorithm_info(algorithm: str) -> Optional[dict]:
    """Get sorting algorithm information"""
    algorithms = {
      'bubble_sort': {
        'name': 'Bubble Sort',
        'time_complexity': 'O(n²)',
        'space_complexity': 'O(1)',
        'stable': True,
        'description': 'Simple comparison-based sorting algorithm'
      },
      'selection_sort': {
        'name': 'Selection Sort',
        'time_complexity': 'O(n²)',
        'space_complexity': 'O(1)',
        'stable': False,
        'description': 'Finds minimum element and places it at the beginning'
      },
      'insertion_sort': {
        'name': 'Insertion Sort',
        'time_complexity': 'O(n²)',
        'space_complexity': 'O(1)',
        'stable': True,
        'description': 'Builds sorted array one element at a time'
      },
      'merge_sort': {
        'name': 'Merge Sort',
        'time_complexity': 'O(n log n)',
        'space_complexity': 'O(n)',
        'stable': True,
        'description': 'Divide and conquer algorithm using merging'
      },
      'quick_sort': {
        'name': 'Quick Sort',
        'time_complexity': 'O(n log n) average, O(n²) worst',
        'space_complexity': 'O(log n)',
        'stable': False,
        'description': 'Partition-based divide and conquer algorithm'
      },
      'heap_sort': {
        'name': 'Heap Sort',
        'time_complexity': 'O(n log n)',
        'space_complexity': 'O(1)',
        'stable': False,
        'description': 'Uses binary heap data structure'
      },
      'counting_sort': {
        'name': 'Counting Sort',
        'time_complexity': 'O(n + k)',
        'space_complexity': 'O(n + k)',
        'stable': True,
        'description': 'Non-comparison sort for integers with small range'
      },
      'radix_sort': {
        'name': 'Radix Sort',
        'time_complexity': 'O(n * d)',
        'space_complexity': 'O(n + k)',
        'stable': True,
        'description': 'Processes digits from least significant to most'
      },
      'bucket_sort': {
        'name': 'Bucket Sort',
        'time_complexity': 'O(n + k) average',
        'space_complexity': 'O(n + k)',
        'stable': True,
        'description': 'Distributes elements into buckets then sorts each bucket'
      },
      'timsort': {
        'name': 'Timsort',
        'time_complexity': 'O(n log n)',
        'space_complexity': 'O(n)',
        'stable': True,
        'description': 'Hybrid sorting algorithm derived from merge sort and insertion sort'
      }
    }

    return algorithms.get(algorithm)
