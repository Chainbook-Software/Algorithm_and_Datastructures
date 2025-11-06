/**
 * Queue Data Structure Implementation
 *
 * A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle.
 * Elements are added at the rear (enqueue) and removed from the front (dequeue).
 *
 * Time Complexity:
 * - Enqueue: O(1)
 * - Dequeue: O(1)
 * - Peek: O(1)
 * - Search: O(n)
 *
 * Space Complexity: O(n)
 */

export interface Queue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
  size(): number;
  clear(): void;
  toArray(): T[];
  contains(item: T): boolean;
}

export class ArrayQueue<T> implements Queue<T> {
  private items: T[] = [];
  private front: number = 0;

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;

    const item = this.items[this.front];
    this.front++;

    // Reset front when queue becomes empty to prevent memory leaks
    if (this.front === this.items.length) {
      this.items = [];
      this.front = 0;
    }

    return item;
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.front];
  }

  isEmpty(): boolean {
    return this.front === this.items.length;
  }

  size(): number {
    return this.items.length - this.front;
  }

  clear(): void {
    this.items = [];
    this.front = 0;
  }

  toArray(): T[] {
    return this.items.slice(this.front);
  }

  contains(item: T): boolean {
    return this.items.slice(this.front).includes(item);
  }

  /**
   * Get element at specific index (0-based from front)
   */
  get(index: number): T | undefined {
    const actualIndex = this.front + index;
    if (actualIndex < this.front || actualIndex >= this.items.length) {
      return undefined;
    }
    return this.items[actualIndex];
  }

  toString(): string {
    return this.toArray().join(' <- ');
  }
}

/**
 * Queue implementation using linked list for efficient operations
 */
export class LinkedListQueue<T> implements Queue<T> {
  private head: { value: T; next: any } | null = null;
  private tail: { value: T; next: any } | null = null;
  private _size: number = 0;

  enqueue(item: T): void {
    const newNode = { value: item, next: null };

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this._size++;
  }

  dequeue(): T | undefined {
    if (!this.head) return undefined;

    const value = this.head.value;
    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    this._size--;
    return value;
  }

  peek(): T | undefined {
    return this.head ? this.head.value : undefined;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  size(): number {
    return this._size;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  contains(item: T): boolean {
    let current = this.head;
    while (current) {
      if (current.value === item) return true;
      current = current.next;
    }
    return false;
  }

  toString(): string {
    return this.toArray().join(' <- ');
  }
}

/**
 * Priority Queue Implementation
 *
 * Elements are dequeued based on priority rather than insertion order.
 * Higher priority elements are dequeued first.
 */
export class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  /**
   * Add an element with a priority
   */
  enqueue(element: T, priority: number): void {
    const queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority > this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }
  }

  /**
   * Remove and return the highest priority element
   */
  dequeue(): T | undefined {
    return this.items.shift()?.element;
  }

  /**
   * Return the highest priority element without removing it
   */
  peek(): T | undefined {
    return this.items[0]?.element;
  }

  /**
   * Return the highest priority without removing it
   */
  peekPriority(): number | undefined {
    return this.items[0]?.priority;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  toArray(): T[] {
    return this.items.map(item => item.element);
  }

  toString(): string {
    return this.items.map(item => `${item.element}(p:${item.priority})`).join(' <- ');
  }
}

/**
 * Deque (Double-Ended Queue) Implementation
 *
 * Allows insertion and deletion from both ends.
 */
export class Deque<T> {
  private items: T[] = [];

  /**
   * Add element to the front
   */
  addFront(item: T): void {
    this.items.unshift(item);
  }

  /**
   * Add element to the back
   */
  addBack(item: T): void {
    this.items.push(item);
  }

  /**
   * Remove and return element from the front
   */
  removeFront(): T | undefined {
    return this.items.shift();
  }

  /**
   * Remove and return element from the back
   */
  removeBack(): T | undefined {
    return this.items.pop();
  }

  /**
   * Peek at the front element
   */
  peekFront(): T | undefined {
    return this.items[0];
  }

  /**
   * Peek at the back element
   */
  peekBack(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  toArray(): T[] {
    return [...this.items];
  }

  contains(item: T): boolean {
    return this.items.includes(item);
  }

  toString(): string {
    return this.items.join(' <-> ');
  }
}
