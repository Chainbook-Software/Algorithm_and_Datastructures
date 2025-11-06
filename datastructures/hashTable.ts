/**
 * Hash Table Data Structure Implementation
 *
 * A hash table is a data structure that implements an associative array abstract data type,
 * a structure that can map keys to values. It uses a hash function to compute an index
 * into an array of buckets or slots, from which the desired value can be found.
 *
 * Time Complexity (average case):
 * - Insert: O(1)
 * - Delete: O(1)
 * - Search: O(1)
 *
 * Time Complexity (worst case): O(n) - when many collisions occur
 * Space Complexity: O(n)
 */

export class HashTable<K, V> {
  private table: Array<Array<[K, V]>> = [];
  private _size: number = 0;
  private capacity: number;
  private loadFactor: number = 0.75;

  constructor(capacity: number = 16) {
    this.capacity = capacity;
    this.table = new Array(capacity);
  }

  /**
   * Hash function to convert key to index
   */
  protected hash(key: K): number {
    const str = String(key);
    let hash = 0;

    // djb2 hash function
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash) % this.capacity;
  }

  /**
   * Resize the hash table when load factor is exceeded
   */
  private resize(): void {
    const oldTable = this.table;
    this.capacity *= 2;
    this.table = new Array(this.capacity);
    this._size = 0;

    // Rehash all existing entries
    for (const bucket of oldTable) {
      if (bucket) {
        for (const [key, value] of bucket) {
          this.set(key, value);
        }
      }
    }
  }

  /**
   * Insert or update a key-value pair
   */
  set(key: K, value: V): void {
    const index = this.hash(key);

    if (!this.table[index]) {
      this.table[index] = [];
    }

    // Check if key already exists
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i][0] === key) {
        this.table[index][i][1] = value;
        return;
      }
    }

    // Add new key-value pair
    this.table[index].push([key, value]);
    this._size++;

    // Check load factor and resize if necessary
    if (this._size / this.capacity > this.loadFactor) {
      this.resize();
    }
  }

  /**
   * Get the value associated with a key
   */
  get(key: K): V | undefined {
    const index = this.hash(key);

    if (!this.table[index]) {
      return undefined;
    }

    for (const [k, v] of this.table[index]) {
      if (k === key) {
        return v;
      }
    }

    return undefined;
  }

  /**
   * Check if a key exists in the hash table
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Remove a key-value pair
   */
  delete(key: K): boolean {
    const index = this.hash(key);

    if (!this.table[index]) {
      return false;
    }

    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i][0] === key) {
        this.table[index][i] = this.table[index][this.table[index].length - 1];
        this.table[index].pop();
        this._size--;

        // Clean up empty buckets
        if (this.table[index].length === 0) {
          this.table[index] = undefined as any;
        }

        return true;
      }
    }

    return false;
  }

  /**
   * Get the number of key-value pairs
   */
  size(): number {
    return this._size;
  }

  /**
   * Check if the hash table is empty
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Get all keys
   */
  keys(): K[] {
    const result: K[] = [];

    for (const bucket of this.table) {
      if (bucket) {
        for (const [key] of bucket) {
          result.push(key);
        }
      }
    }

    return result;
  }

  /**
   * Get all values
   */
  values(): V[] {
    const result: V[] = [];

    for (const bucket of this.table) {
      if (bucket) {
        for (const [, value] of bucket) {
          result.push(value);
        }
      }
    }

    return result;
  }

  /**
   * Get all key-value pairs
   */
  entries(): Array<[K, V]> {
    const result: Array<[K, V]> = [];

    for (const bucket of this.table) {
      if (bucket) {
        result.push(...bucket);
      }
    }

    return result;
  }

  /**
   * Execute a function for each key-value pair
   */
  forEach(callback: (value: V, key: K) => void): void {
    for (const [key, value] of this.entries()) {
      callback(value, key);
    }
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.table = new Array(this.capacity);
    this._size = 0;
  }

  /**
   * Get the current capacity
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Get the load factor
   */
  getLoadFactor(): number {
    return this._size / this.capacity;
  }

  /**
   * Get statistics about the hash table
   */
  getStats(): {
    size: number;
    capacity: number;
    loadFactor: number;
    bucketSizes: number[];
    maxBucketSize: number;
    averageBucketSize: number;
  } {
    const bucketSizes = this.table
      .filter(bucket => bucket)
      .map(bucket => bucket.length);

    const maxBucketSize = bucketSizes.length > 0 ? Math.max(...bucketSizes) : 0;
    const averageBucketSize = bucketSizes.length > 0
      ? bucketSizes.reduce((sum, size) => sum + size, 0) / bucketSizes.length
      : 0;

    return {
      size: this._size,
      capacity: this.capacity,
      loadFactor: this.getLoadFactor(),
      bucketSizes,
      maxBucketSize,
      averageBucketSize
    };
  }

  /**
   * Create a string representation
   */
  toString(): string {
    const entries = this.entries();
    return `HashTable(${entries.map(([k, v]) => `${k}:${v}`).join(', ')})`;
  }
}

/**
 * Specialized HashTable for string keys with better hash function
 */
export class StringHashTable<V> extends HashTable<string, V> {
  protected hash(key: string): number {
    let hash = 0;

    // FNV-1a hash function for strings
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash *= 0x01000193; // FNV prime
    }

    return Math.abs(hash) % 16; // Use default capacity for calculation
  }
}

/**
 * HashTable with linear probing collision resolution
 */
export class LinearProbingHashTable<K, V> {
  private _keys: (K | undefined)[] = [];
  private _values: (V | undefined)[] = [];
  private _size: number = 0;
  private capacity: number;
  private loadFactor: number = 0.75;

  constructor(capacity: number = 16) {
    this.capacity = capacity;
    this._keys = new Array(capacity);
    this._values = new Array(capacity);
  }

  private hash(key: K): number {
    const str = String(key);
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return Math.abs(hash) % this.capacity;
  }

  private resize(): void {
    const oldKeys = this._keys;
    const oldValues = this._values;

    this.capacity *= 2;
    this._keys = new Array(this.capacity);
    this._values = new Array(this.capacity);
    this._size = 0;

    for (let i = 0; i < oldKeys.length; i++) {
      if (oldKeys[i] !== undefined) {
        this.set(oldKeys[i]!, oldValues[i]!);
      }
    }
  }

  set(key: K, value: V): void {
    if (this._size / this.capacity > this.loadFactor) {
      this.resize();
    }

    let index = this.hash(key);

    while (this._keys[index] !== undefined && this._keys[index] !== key) {
      index = (index + 1) % this.capacity;
    }

    if (this._keys[index] === undefined) {
      this._size++;
    }

    this._keys[index] = key;
    this._values[index] = value;
  }

  get(key: K): V | undefined {
    let index = this.hash(key);

    while (this._keys[index] !== undefined) {
      if (this._keys[index] === key) {
        return this._values[index];
      }
      index = (index + 1) % this.capacity;
    }

    return undefined;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    let index = this.hash(key);

    while (this._keys[index] !== undefined) {
      if (this._keys[index] === key) {
        this._keys[index] = undefined;
        this._values[index] = undefined;
        this._size--;
        return true;
      }
      index = (index + 1) % this.capacity;
    }

    return false;
  }

  size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  clear(): void {
    this._keys = new Array(this.capacity);
    this._values = new Array(this.capacity);
    this._size = 0;
  }

  getKeys(): K[] {
    const result: K[] = [];
    for (const key of this._keys) {
      if (key !== undefined) {
        result.push(key);
      }
    }
    return result;
  }

  getValues(): V[] {
    const result: V[] = [];
    for (const value of this._values) {
      if (value !== undefined) {
        result.push(value);
      }
    }
    return result;
  }
}
