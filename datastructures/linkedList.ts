/**
 * Linked List Data Structure Implementation
 *
 * A linked list is a linear data structure where each element is a separate object.
 * Each element (node) contains data and a reference to the next node in the sequence.
 *
 * Time Complexity:
 * - Access: O(n)
 * - Search: O(n)
 * - Insertion: O(1) at head, O(n) at arbitrary position
 * - Deletion: O(1) at head, O(n) at arbitrary position
 *
 * Space Complexity: O(n)
 */

export class ListNode<T> {
  constructor(
    public value: T,
    public next: ListNode<T> | null = null
  ) {}
}

export class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private _size: number = 0;

  /**
   * Get the number of elements in the list
   */
  get size(): number {
    return this._size;
  }

  /**
   * Check if the list is empty
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Add an element to the beginning of the list
   */
  prepend(value: T): void {
    const newNode = new ListNode(value, this.head);
    this.head = newNode;

    if (!this.tail) {
      this.tail = newNode;
    }

    this._size++;
  }

  /**
   * Add an element to the end of the list
   */
  append(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this._size++;
  }

  /**
   * Insert an element at a specific position
   */
  insertAt(value: T, index: number): boolean {
    if (index < 0 || index > this._size) {
      return false;
    }

    if (index === 0) {
      this.prepend(value);
      return true;
    }

    if (index === this._size) {
      this.append(value);
      return true;
    }

    let current = this.head;
    let previous: ListNode<T> | null = null;
    let currentIndex = 0;

    while (current && currentIndex < index) {
      previous = current;
      current = current.next;
      currentIndex++;
    }

    if (previous) {
      previous.next = new ListNode(value, current);
      this._size++;
      return true;
    }

    return false;
  }

  /**
   * Remove and return the first element
   */
  removeFirst(): T | null {
    if (!this.head) {
      return null;
    }

    const value = this.head.value;
    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    this._size--;
    return value;
  }

  /**
   * Remove and return the last element
   */
  removeLast(): T | null {
    if (!this.head) {
      return null;
    }

    if (this.head === this.tail) {
      const value = this.head.value;
      this.head = null;
      this.tail = null;
      this._size--;
      return value;
    }

    let current = this.head;
    let previous: ListNode<T> | null = null;

    while (current.next) {
      previous = current;
      current = current.next;
    }

    if (previous) {
      previous.next = null;
      this.tail = previous;
    }

    this._size--;
    return current.value;
  }

  /**
   * Remove an element at a specific position
   */
  removeAt(index: number): T | null {
    if (index < 0 || index >= this._size) {
      return null;
    }

    if (index === 0) {
      return this.removeFirst();
    }

    if (index === this._size - 1) {
      return this.removeLast();
    }

    let current = this.head;
    let previous: ListNode<T> | null = null;
    let currentIndex = 0;

    while (current && currentIndex < index) {
      previous = current;
      current = current.next;
      currentIndex++;
    }

    if (previous && current) {
      previous.next = current.next;
      this._size--;
      return current.value;
    }

    return null;
  }

  /**
   * Get the element at a specific position
   */
  get(index: number): T | null {
    if (index < 0 || index >= this._size) {
      return null;
    }

    let current = this.head;
    let currentIndex = 0;

    while (current && currentIndex < index) {
      current = current.next;
      currentIndex++;
    }

    return current ? current.value : null;
  }

  /**
   * Find the index of an element
   */
  indexOf(value: T): number {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  /**
   * Check if the list contains an element
   */
  contains(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /**
   * Convert the list to an array
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  /**
   * Create a linked list from an array
   */
  static fromArray<T>(array: T[]): LinkedList<T> {
    const list = new LinkedList<T>();
    for (const item of array) {
      list.append(item);
    }
    return list;
  }

  /**
   * Reverse the linked list in place
   */
  reverse(): void {
    let previous: ListNode<T> | null = null;
    let current = this.head;
    let next: ListNode<T> | null = null;

    // Swap head and tail
    const oldTail = this.tail;
    this.tail = this.head;
    this.head = oldTail;

    while (current) {
      next = current.next;
      current.next = previous;
      previous = current;
      current = next;
    }
  }

  /**
   * Get the middle element using fast/slow pointer technique
   */
  getMiddle(): T | null {
    if (!this.head) return null;

    let slow = this.head;
    let fast = this.head;

    while (fast.next && fast.next.next) {
      slow = slow.next!;
      fast = fast.next.next;
    }

    return slow.value;
  }

  /**
   * Detect if the list has a cycle
   */
  hasCycle(): boolean {
    if (!this.head) return false;

    let slow = this.head;
    let fast = this.head;

    while (fast.next && fast.next.next) {
      slow = slow.next!;
      fast = fast.next.next;

      if (slow === fast) {
        return true;
      }
    }

    return false;
  }

  /**
   * Clear the list
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  /**
   * Create a string representation of the list
   */
  toString(): string {
    return this.toArray().join(' -> ');
  }

  /**
   * Iterate over the list
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
