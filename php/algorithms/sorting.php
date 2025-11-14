<?php

/**
 * Sorting Algorithms Implementation in PHP
 *
 * This file contains various sorting algorithms with their time and space complexity analysis.
 */

class SortingAlgorithms {

  /**
   * Bubble Sort
   * Time: O(n²) worst/average, O(n) best
   * Space: O(1)
   * Stable: Yes
   */
  public static function bubbleSort(array $arr, callable $compare = null): array {
    if ($compare === null) {
      $compare = function($a, $b) {
        return $a <=> $b;
      };
    }

    $result = $arr;
    $n = count($result);

    for ($i = 0; $i < $n - 1; $i++) {
      $swapped = false;

      for ($j = 0; $j < $n - $i - 1; $j++) {
        if ($compare($result[$j], $result[$j + 1]) > 0) {
          [$result[$j], $result[$j + 1]] = [$result[$j + 1], $result[$j]];
          $swapped = true;
        }
      }

      // If no swaps occurred, array is already sorted
      if (!$swapped) break;
    }

    return $result;
  }

  /**
   * Selection Sort
   * Time: O(n²) worst/average/best
   * Space: O(1)
   * Stable: No
   */
  public static function selectionSort(array $arr, callable $compare = null): array {
    if ($compare === null) {
      $compare = function($a, $b) {
        return $a <=> $b;
      };
    }

    $result = $arr;
    $n = count($result);

    for ($i = 0; $i < $n - 1; $i++) {
      $minIndex = $i;

      for ($j = $i + 1; $j < $n; $j++) {
        if ($compare($result[$j], $result[$minIndex]) < 0) {
          $minIndex = $j;
        }
      }

      if ($minIndex !== $i) {
        [$result[$i], $result[$minIndex]] = [$result[$minIndex], $result[$i]];
      }
    }

    return $result;
  }

  /**
   * Insertion Sort
   * Time: O(n²) worst/average, O(n) best
   * Space: O(1)
   * Stable: Yes
   */
  public static function insertionSort(array $arr, callable $compare = null): array {
    if ($compare === null) {
      $compare = function($a, $b) {
        return $a <=> $b;
      };
    }

    $result = $arr;
    $n = count($result);

    for ($i = 1; $i < $n; $i++) {
      $key = $result[$i];
      $j = $i - 1;

      while ($j >= 0 && $compare($result[$j], $key) > 0) {
        $result[$j + 1] = $result[$j];
        $j--;
      }

      $result[$j + 1] = $key;
    }

    return $result;
  }

  /**
   * Merge Sort
   * Time: O(n log n) worst/average/best
   * Space: O(n)
   * Stable: Yes
   */
  public static function mergeSort(array $arr, callable $compare = null): array {
    if ($compare === null) {
      $compare = function($a, $b) {
        return $a <=> $b;
      };
    }

    $n = count($arr);
    if ($n <= 1) return $arr;

    $mid = (int)($n / 2);
    $left = self::mergeSort(array_slice($arr, 0, $mid), $compare);
    $right = self::mergeSort(array_slice($arr, $mid), $compare);

    return self::merge($left, $right, $compare);
  }

  private static function merge(array $left, array $right, callable $compare): array {
    $result = [];
    $i = 0;
    $j = 0;

    while ($i < count($left) && $j < count($right)) {
      if ($compare($left[$i], $right[$j]) <= 0) {
        $result[] = $left[$i++];
      } else {
        $result[] = $right[$j++];
      }
    }

    return array_merge($result, array_slice($left, $i), array_slice($right, $j));
  }

  /**
   * Quick Sort
   * Time: O(n²) worst, O(n log n) average/best
   * Space: O(log n) due to recursion
   * Stable: No
   */
  public static function quickSort(array $arr, callable $compare = null): array {
    if ($compare === null) {
      $compare = function($a, $b) {
        return $a <=> $b;
      };
    }

    $result = $arr;
    self::quickSortHelper($result, 0, count($result) - 1, $compare);
    return $result;
  }

  private static function quickSortHelper(array &$arr, int $low, int $high, callable $compare): void {
    if ($low < $high) {
      $pivotIndex = self::partition($arr, $low, $high, $compare);
      self::quickSortHelper($arr, $low, $pivotIndex - 1, $compare);
      self::quickSortHelper($arr, $pivotIndex + 1, $high, $compare);
    }
  }

  private static function partition(array &$arr, int $low, int $high, callable $compare): int {
    $pivot = $arr[$high];
    $i = $low - 1;

    for ($j = $low; $j < $high; $j++) {
      if ($compare($arr[$j], $pivot) <= 0) {
        $i++;
        [$arr[$i], $arr[$j]] = [$arr[$j], $arr[$i]];
      }
    }

    [$arr[$i + 1], $arr[$high]] = [$arr[$high], $arr[$i + 1]];
    return $i + 1;
  }

  /**
   * Heap Sort
   * Time: O(n log n) worst/average/best
   * Space: O(1)
   * Stable: No
   */
  public static function heapSort(array $arr, callable $compare = null): array {
    if ($compare === null) {
      $compare = function($a, $b) {
        return $a <=> $b;
      };
    }

    $result = $arr;
    $n = count($result);

    // Build max heap
    for ($i = (int)($n / 2) - 1; $i >= 0; $i--) {
      self::heapify($result, $n, $i, $compare);
    }

    // Extract elements from heap
    for ($i = $n - 1; $i > 0; $i--) {
      [$result[0], $result[$i]] = [$result[$i], $result[0]];
      self::heapify($result, $i, 0, $compare);
    }

    return $result;
  }

  private static function heapify(array &$arr, int $n, int $i, callable $compare): void {
    $largest = $i;
    $left = 2 * $i + 1;
    $right = 2 * $i + 2;

    if ($left < $n && $compare($arr[$left], $arr[$largest]) > 0) {
      $largest = $left;
    }

    if ($right < $n && $compare($arr[$right], $arr[$largest]) > 0) {
      $largest = $right;
    }

    if ($largest !== $i) {
      [$arr[$i], $arr[$largest]] = [$arr[$largest], $arr[$i]];
      self::heapify($arr, $n, $largest, $compare);
    }
  }

  /**
   * Counting Sort (for integers)
   * Time: O(n + k) where k is the range of input
   * Space: O(n + k)
   * Stable: Yes
   */
  public static function countingSort(array $arr): array {
    if (empty($arr)) return [];

    $min = min($arr);
    $max = max($arr);
    $range = $max - $min + 1;

    $count = array_fill(0, $range, 0);
    $output = array_fill(0, count($arr), 0);

    // Count occurrences
    foreach ($arr as $num) {
      $count[$num - $min]++;
    }

    // Cumulative count
    for ($i = 1; $i < $range; $i++) {
      $count[$i] += $count[$i - 1];
    }

    // Build output array
    for ($i = count($arr) - 1; $i >= 0; $i--) {
      $output[$count[$arr[$i] - $min] - 1] = $arr[$i];
      $count[$arr[$i] - $min]--;
    }

    return $output;
  }

  /**
   * Radix Sort (for positive integers)
   * Time: O(n * d) where d is the number of digits
   * Space: O(n + k)
   * Stable: Yes
   */
  public static function radixSort(array $arr): array {
    if (empty($arr)) return [];

    $result = $arr;
    $max = max($result);
    $maxDigits = strlen((string)$max);

    for ($digit = 0; $digit < $maxDigits; $digit++) {
      $result = self::countingSortByDigit($result, $digit);
    }

    return $result;
  }

  private static function countingSortByDigit(array $arr, int $digit): array {
    $count = array_fill(0, 10, 0);
    $output = array_fill(0, count($arr), 0);

    // Count occurrences of each digit
    foreach ($arr as $num) {
      $digitValue = (int)($num / pow(10, $digit)) % 10;
      $count[$digitValue]++;
    }

    // Cumulative count
    for ($i = 1; $i < 10; $i++) {
      $count[$i] += $count[$i - 1];
    }

    // Build output array
    for ($i = count($arr) - 1; $i >= 0; $i--) {
      $digitValue = (int)($arr[$i] / pow(10, $digit)) % 10;
      $output[$count[$digitValue] - 1] = $arr[$i];
      $count[$digitValue]--;
    }

    return $output;
  }

  /**
   * Bucket Sort
   * Time: O(n + k) average case
   * Space: O(n + k)
   * Stable: Depends on bucket sort implementation
   */
  public static function bucketSort(array $arr, int $bucketSize = 5): array {
    if (empty($arr)) return [];

    $min = min($arr);
    $max = max($arr);
    $bucketCount = (int)(($max - $min) / $bucketSize) + 1;
    $buckets = array_fill(0, $bucketCount, []);

    // Distribute elements into buckets
    foreach ($arr as $num) {
      $bucketIndex = (int)(($num - $min) / $bucketSize);
      $buckets[$bucketIndex][] = $num;
    }

    // Sort each bucket and concatenate
    $sorted = [];
    foreach ($buckets as $bucket) {
      if (!empty($bucket)) {
        $sorted = array_merge($sorted, self::insertionSort($bucket));
      }
    }

    return $sorted;
  }

  /**
   * Timsort (hybrid sorting algorithm used in Python and Java)
   * Time: O(n log n) worst case
   * Space: O(n)
   * Stable: Yes
   */
  public static function timsort(array $arr, callable $compare = null): array {
    if ($compare === null) {
      $compare = function($a, $b) {
        return $a <=> $b;
      };
    }

    $result = $arr;
    $n = count($result);
    $minRun = self::calcMinRun($n);

    // Sort individual subarrays of size minRun
    for ($i = 0; $i < $n; $i += $minRun) {
      $subarray = array_slice($result, $i, min($minRun, $n - $i));
      $sortedSubarray = self::insertionSort($subarray, $compare);
      array_splice($result, $i, count($subarray), $sortedSubarray);
    }

    // Merge sorted subarrays
    for ($size = $minRun; $size < $n; $size *= 2) {
      for ($left = 0; $left < $n; $left += 2 * $size) {
        $mid = $left + $size - 1;
        $right = min($left + 2 * $size - 1, $n - 1);

        if ($mid < $right) {
          $leftPart = array_slice($result, $left, $mid - $left + 1);
          $rightPart = array_slice($result, $mid + 1, $right - $mid);
          $merged = self::merge($leftPart, $rightPart, $compare);
          array_splice($result, $left, $right - $left + 1, $merged);
        }
      }
    }

    return $result;
  }

  private static function calcMinRun(int $n): int {
    $r = 0;
    while ($n >= 64) {
      $r |= $n & 1;
      $n >>= 1;
    }
    return $n + $r;
  }

  /**
   * Check if an array is sorted
   */
  public static function isSorted(array $arr, callable $compare = null): bool {
    if ($compare === null) {
      $compare = function($a, $b) {
        return $a <=> $b;
      };
    }

    for ($i = 1; $i < count($arr); $i++) {
      if ($compare($arr[$i - 1], $arr[$i]) > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get sorting algorithm information
   */
  public static function getAlgorithmInfo(string $algorithm): ?array {
    $algorithms = [
      'bubbleSort' => [
        'name' => 'Bubble Sort',
        'timeComplexity' => 'O(n²)',
        'spaceComplexity' => 'O(1)',
        'stable' => true,
        'description' => 'Simple comparison-based sorting algorithm'
      ],
      'selectionSort' => [
        'name' => 'Selection Sort',
        'timeComplexity' => 'O(n²)',
        'spaceComplexity' => 'O(1)',
        'stable' => false,
        'description' => 'Finds minimum element and places it at the beginning'
      ],
      'insertionSort' => [
        'name' => 'Insertion Sort',
        'timeComplexity' => 'O(n²)',
        'spaceComplexity' => 'O(1)',
        'stable' => true,
        'description' => 'Builds sorted array one element at a time'
      ],
      'mergeSort' => [
        'name' => 'Merge Sort',
        'timeComplexity' => 'O(n log n)',
        'spaceComplexity' => 'O(n)',
        'stable' => true,
        'description' => 'Divide and conquer algorithm using merging'
      ],
      'quickSort' => [
        'name' => 'Quick Sort',
        'timeComplexity' => 'O(n log n) average, O(n²) worst',
        'spaceComplexity' => 'O(log n)',
        'stable' => false,
        'description' => 'Partition-based divide and conquer algorithm'
      ],
      'heapSort' => [
        'name' => 'Heap Sort',
        'timeComplexity' => 'O(n log n)',
        'spaceComplexity' => 'O(1)',
        'stable' => false,
        'description' => 'Uses binary heap data structure'
      ],
      'countingSort' => [
        'name' => 'Counting Sort',
        'timeComplexity' => 'O(n + k)',
        'spaceComplexity' => 'O(n + k)',
        'stable' => true,
        'description' => 'Non-comparison sort for integers with small range'
      ],
      'radixSort' => [
        'name' => 'Radix Sort',
        'timeComplexity' => 'O(n * d)',
        'spaceComplexity' => 'O(n + k)',
        'stable' => true,
        'description' => 'Processes digits from least significant to most'
      ],
      'bucketSort' => [
        'name' => 'Bucket Sort',
        'timeComplexity' => 'O(n + k) average',
        'spaceComplexity' => 'O(n + k)',
        'stable' => true,
        'description' => 'Distributes elements into buckets then sorts each bucket'
      ],
      'timsort' => [
        'name' => 'Timsort',
        'timeComplexity' => 'O(n log n)',
        'spaceComplexity' => 'O(n)',
        'stable' => true,
        'description' => 'Hybrid sorting algorithm derived from merge sort and insertion sort'
      ]
    ];

    return $algorithms[$algorithm] ?? null;
  }
}

?>
