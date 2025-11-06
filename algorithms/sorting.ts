/**
 * Sorting Algorithms Implementation
 *
 * This file contains various sorting algorithms with their time and space complexity analysis.
 */

export class SortingAlgorithms {

  /**
   * Bubble Sort
   * Time: O(n²) worst/average, O(n) best
   * Space: O(1)
   * Stable: Yes
   */
  static bubbleSort<T>(arr: T[], compare: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0)): T[] {
    const result = [...arr];
    const n = result.length;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        if (compare(result[j], result[j + 1]) > 0) {
          [result[j], result[j + 1]] = [result[j + 1], result[j]];
          swapped = true;
        }
      }

      // If no swaps occurred, array is already sorted
      if (!swapped) break;
    }

    return result;
  }

  /**
   * Selection Sort
   * Time: O(n²) worst/average/best
   * Space: O(1)
   * Stable: No
   */
  static selectionSort<T>(arr: T[], compare: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0)): T[] {
    const result = [...arr];
    const n = result.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      for (let j = i + 1; j < n; j++) {
        if (compare(result[j], result[minIndex]) < 0) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        [result[i], result[minIndex]] = [result[minIndex], result[i]];
      }
    }

    return result;
  }

  /**
   * Insertion Sort
   * Time: O(n²) worst/average, O(n) best
   * Space: O(1)
   * Stable: Yes
   */
  static insertionSort<T>(arr: T[], compare: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0)): T[] {
    const result = [...arr];
    const n = result.length;

    for (let i = 1; i < n; i++) {
      const key = result[i];
      let j = i - 1;

      while (j >= 0 && compare(result[j], key) > 0) {
        result[j + 1] = result[j];
        j--;
      }

      result[j + 1] = key;
    }

    return result;
  }

  /**
   * Merge Sort
   * Time: O(n log n) worst/average/best
   * Space: O(n)
   * Stable: Yes
   */
  static mergeSort<T>(arr: T[], compare: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0)): T[] {
    if (arr.length <= 1) return [...arr];

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid), compare);
    const right = this.mergeSort(arr.slice(mid), compare);

    return this.merge(left, right, compare);
  }

  private static merge<T>(left: T[], right: T[], compare: (a: T, b: T) => number): T[] {
    const result: T[] = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      if (compare(left[i], right[j]) <= 0) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }

  /**
   * Quick Sort
   * Time: O(n²) worst, O(n log n) average/best
   * Space: O(log n) due to recursion
   * Stable: No
   */
  static quickSort<T>(arr: T[], compare: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0)): T[] {
    const result = [...arr];
    this.quickSortHelper(result, 0, result.length - 1, compare);
    return result;
  }

  private static quickSortHelper<T>(
    arr: T[],
    low: number,
    high: number,
    compare: (a: T, b: T) => number
  ): void {
    if (low < high) {
      const pivotIndex = this.partition(arr, low, high, compare);
      this.quickSortHelper(arr, low, pivotIndex - 1, compare);
      this.quickSortHelper(arr, pivotIndex + 1, high, compare);
    }
  }

  private static partition<T>(
    arr: T[],
    low: number,
    high: number,
    compare: (a: T, b: T) => number
  ): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (compare(arr[j], pivot) <= 0) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }

  /**
   * Heap Sort
   * Time: O(n log n) worst/average/best
   * Space: O(1)
   * Stable: No
   */
  static heapSort<T>(arr: T[], compare: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0)): T[] {
    const result = [...arr];
    const n = result.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(result, n, i, compare);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      [result[0], result[i]] = [result[i], result[0]];
      this.heapify(result, i, 0, compare);
    }

    return result;
  }

  private static heapify<T>(
    arr: T[],
    n: number,
    i: number,
    compare: (a: T, b: T) => number
  ): void {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && compare(arr[left], arr[largest]) > 0) {
      largest = left;
    }

    if (right < n && compare(arr[right], arr[largest]) > 0) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      this.heapify(arr, n, largest, compare);
    }
  }

  /**
   * Counting Sort (for integers)
   * Time: O(n + k) where k is the range of input
   * Space: O(n + k)
   * Stable: Yes
   */
  static countingSort(arr: number[]): number[] {
    if (arr.length === 0) return [];

    const result = [...arr];
    const min = Math.min(...result);
    const max = Math.max(...result);
    const range = max - min + 1;

    const count = new Array(range).fill(0);
    const output = new Array(result.length);

    // Count occurrences
    for (const num of result) {
      count[num - min]++;
    }

    // Cumulative count
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
    }

    // Build output array
    for (let i = result.length - 1; i >= 0; i--) {
      output[count[result[i] - min] - 1] = result[i];
      count[result[i] - min]--;
    }

    return output;
  }

  /**
   * Radix Sort (for positive integers)
   * Time: O(n * d) where d is the number of digits
   * Space: O(n + k)
   * Stable: Yes
   */
  static radixSort(arr: number[]): number[] {
    if (arr.length === 0) return [];

    let result = [...arr];
    const max = Math.max(...result);
    const maxDigits = Math.floor(Math.log10(max)) + 1;

    for (let digit = 0; digit < maxDigits; digit++) {
      result = this.countingSortByDigit(result, digit);
    }

    return result;
  }

  private static countingSortByDigit(arr: number[], digit: number): number[] {
    const count = new Array(10).fill(0);
    const output = new Array(arr.length);

    // Count occurrences of each digit
    for (const num of arr) {
      const digitValue = Math.floor(num / Math.pow(10, digit)) % 10;
      count[digitValue]++;
    }

    // Cumulative count
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
    }

    // Build output array
    for (let i = arr.length - 1; i >= 0; i--) {
      const digitValue = Math.floor(arr[i] / Math.pow(10, digit)) % 10;
      output[count[digitValue] - 1] = arr[i];
      count[digitValue]--;
    }

    return output;
  }

  /**
   * Bucket Sort
   * Time: O(n + k) average case
   * Space: O(n + k)
   * Stable: Depends on bucket sort implementation
   */
  static bucketSort(arr: number[], bucketSize: number = 5): number[] {
    if (arr.length === 0) return [];

    const result = [...arr];
    const min = Math.min(...result);
    const max = Math.max(...result);
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    // Distribute elements into buckets
    for (const num of result) {
      const bucketIndex = Math.floor((num - min) / bucketSize);
      buckets[bucketIndex].push(num);
    }

    // Sort each bucket and concatenate
    const sorted: number[] = [];
    for (const bucket of buckets) {
      if (bucket.length > 0) {
        sorted.push(...this.insertionSort(bucket));
      }
    }

    return sorted;
  }

  /**
   * Timsort (hybrid sorting algorithm used in Python and Java)
   * Time: O(n log n) worst case
   * Space: O(n)
   * Stable: Yes
   */
  static timsort<T>(arr: T[], compare: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0)): T[] {
    const result = [...arr];
    const n = result.length;
    const minRun = this.calcMinRun(n);

    // Sort individual subarrays of size minRun
    for (let i = 0; i < n; i += minRun) {
      this.insertionSort(result.slice(i, Math.min(i + minRun, n)), compare);
    }

    // Merge sorted subarrays
    for (let size = minRun; size < n; size *= 2) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid = left + size - 1;
        const right = Math.min(left + 2 * size - 1, n - 1);

        if (mid < right) {
          this.merge(result.slice(left, mid + 1), result.slice(mid + 1, right + 1), compare);
        }
      }
    }

    return result;
  }

  private static calcMinRun(n: number): number {
    let r = 0;
    while (n >= 64) {
      r |= n & 1;
      n >>= 1;
    }
    return n + r;
  }

  /**
   * Check if an array is sorted
   */
  static isSorted<T>(arr: T[], compare: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0)): boolean {
    for (let i = 1; i < arr.length; i++) {
      if (compare(arr[i - 1], arr[i]) > 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get sorting algorithm information
   */
  static getAlgorithmInfo(algorithm: string): {
    name: string;
    timeComplexity: string;
    spaceComplexity: string;
    stable: boolean;
    description: string;
  } | null {
    const algorithms: Record<string, any> = {
      bubbleSort: {
        name: 'Bubble Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
        description: 'Simple comparison-based sorting algorithm'
      },
      selectionSort: {
        name: 'Selection Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: false,
        description: 'Finds minimum element and places it at the beginning'
      },
      insertionSort: {
        name: 'Insertion Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
        description: 'Builds sorted array one element at a time'
      },
      mergeSort: {
        name: 'Merge Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        stable: true,
        description: 'Divide and conquer algorithm using merging'
      },
      quickSort: {
        name: 'Quick Sort',
        timeComplexity: 'O(n log n) average, O(n²) worst',
        spaceComplexity: 'O(log n)',
        stable: false,
        description: 'Partition-based divide and conquer algorithm'
      },
      heapSort: {
        name: 'Heap Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        stable: false,
        description: 'Uses binary heap data structure'
      },
      countingSort: {
        name: 'Counting Sort',
        timeComplexity: 'O(n + k)',
        spaceComplexity: 'O(n + k)',
        stable: true,
        description: 'Non-comparison sort for integers with small range'
      },
      radixSort: {
        name: 'Radix Sort',
        timeComplexity: 'O(n * d)',
        spaceComplexity: 'O(n + k)',
        stable: true,
        description: 'Processes digits from least significant to most'
      },
      bucketSort: {
        name: 'Bucket Sort',
        timeComplexity: 'O(n + k) average',
        spaceComplexity: 'O(n + k)',
        stable: true,
        description: 'Distributes elements into buckets then sorts each bucket'
      },
      timsort: {
        name: 'Timsort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        stable: true,
        description: 'Hybrid sorting algorithm derived from merge sort and insertion sort'
      }
    };

    return algorithms[algorithm] || null;
  }
}
