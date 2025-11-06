/**
 * Stack Data Structure Implementation
 *
 * A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle.
 * Elements are added and removed from the same end, called the "top" of the stack.
 *
 * Time Complexity:
 * - Push: O(1)
 * - Pop: O(1)
 * - Peek: O(1)
 * - Search: O(n)
 *
 * Space Complexity: O(n)
 */

export interface Stack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
  size(): number;
  clear(): void;
  toArray(): T[];
  contains(item: T): boolean;
}

export class ArrayStack<T> implements Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
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

  /**
   * Get element at specific index (0-based from bottom)
   */
  get(index: number): T | undefined {
    if (index < 0 || index >= this.items.length) {
      return undefined;
    }
    return this.items[index];
  }

  /**
   * Create a string representation
   */
  toString(): string {
    return this.items.join(' <- ');
  }
}

/**
 * Stack implementation using linked list for O(1) operations
 */
export class LinkedListStack<T> implements Stack<T> {
  private head: { value: T; next: any } | null = null;
  private _size: number = 0;

  push(item: T): void {
    const newNode = { value: item, next: this.head };
    this.head = newNode;
    this._size++;
  }

  pop(): T | undefined {
    if (!this.head) return undefined;

    const value = this.head.value;
    this.head = this.head.next;
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
    this._size = 0;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result.reverse(); // Reverse to show stack order (bottom to top)
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
    return this.toArray().reverse().join(' <- ');
  }
}
