/**
 * Binary Search Tree Data Structure Implementation
 *
 * A binary search tree is a binary tree data structure where each node has at most two children,
 * and for each node, all elements in its left subtree are less than the node, and all elements
 * in its right subtree are greater than the node.
 *
 * Time Complexity:
 * - Insert: O(log n) average, O(n) worst case
 * - Delete: O(log n) average, O(n) worst case
 * - Search: O(log n) average, O(n) worst case
 * - Traversal: O(n)
 *
 * Space Complexity: O(n)
 */

export class TreeNode<T> {
  constructor(
    public value: T,
    public left: TreeNode<T> | null = null,
    public right: TreeNode<T> | null = null,
    public parent: TreeNode<T> | null = null
  ) {}

  /**
   * Get the height of this subtree
   */
  getHeight(): number {
    return 1 + Math.max(
      this.left ? this.left.getHeight() : 0,
      this.right ? this.right.getHeight() : 0
    );
  }

  /**
   * Get the balance factor of this node
   */
  getBalanceFactor(): number {
    return (this.left ? this.left.getHeight() : 0) - (this.right ? this.right.getHeight() : 0);
  }

  /**
   * Check if this node is a leaf
   */
  isLeaf(): boolean {
    return !this.left && !this.right;
  }
}

export class BinarySearchTree<T> {
  root: TreeNode<T> | null = null;
  private _size: number = 0;

  /**
   * Get the number of nodes in the tree
   */
  get size(): number {
    return this._size;
  }

  /**
   * Check if the tree is empty
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Insert a value into the tree
   */
  insert(value: T): boolean {
    if (!this.root) {
      this.root = new TreeNode(value);
      this._size++;
      return true;
    }

    let current: TreeNode<T> | null = this.root;
    let parent: TreeNode<T> | null = null;

    while (current) {
      parent = current;
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        // Value already exists
        return false;
      }
    }

    const newNode = new TreeNode(value);
    newNode.parent = parent;

    if (value < parent!.value) {
      parent!.left = newNode;
    } else {
      parent!.right = newNode;
    }

    this._size++;
    return true;
  }

  /**
   * Search for a value in the tree
   */
  search(value: T): boolean {
    return this.findNode(value) !== null;
  }

  /**
   * Find and return the node containing the value
   */
  findNode(value: T): TreeNode<T> | null {
    let current = this.root;

    while (current) {
      if (value === current.value) {
        return current;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  /**
   * Find the minimum value in the tree
   */
  findMin(): T | null {
    if (!this.root) return null;

    let current = this.root;
    while (current.left) {
      current = current.left;
    }
    return current.value;
  }

  /**
   * Find the maximum value in the tree
   */
  findMax(): T | null {
    if (!this.root) return null;

    let current = this.root;
    while (current.right) {
      current = current.right;
    }
    return current.value;
  }

  /**
   * Delete a value from the tree
   */
  delete(value: T): boolean {
    const node = this.findNode(value);
    if (!node) return false;

    this.deleteNode(node);
    this._size--;
    return true;
  }

  /**
   * Delete a specific node from the tree
   */
  private deleteNode(node: TreeNode<T>): void {
    // Case 1: Node has no children (leaf node)
    if (!node.left && !node.right) {
      this.transplant(node, null);
      return;
    }

    // Case 2: Node has one child
    if (!node.left) {
      this.transplant(node, node.right);
      return;
    }

    if (!node.right) {
      this.transplant(node, node.left);
      return;
    }

    // Case 3: Node has two children
    // Find the successor (minimum value in right subtree)
    const successor = this.findMinNode(node.right);

    // If successor is not the direct right child
    if (successor.parent !== node) {
      this.transplant(successor, successor.right);
      successor.right = node.right;
      successor.right.parent = successor;
    }

    this.transplant(node, successor);
    successor.left = node.left;
    successor.left.parent = successor;
  }

  /**
   * Transplant one subtree with another
   */
  private transplant(oldNode: TreeNode<T>, newNode: TreeNode<T> | null): void {
    if (!oldNode.parent) {
      // oldNode is root
      this.root = newNode;
    } else if (oldNode === oldNode.parent.left) {
      oldNode.parent.left = newNode;
    } else {
      oldNode.parent.right = newNode;
    }

    if (newNode) {
      newNode.parent = oldNode.parent;
    }
  }

  /**
   * Find the node with minimum value in a subtree
   */
  private findMinNode(node: TreeNode<T>): TreeNode<T> {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  /**
   * In-order traversal: left -> root -> right
   */
  inorder(): T[] {
    const result: T[] = [];
    this.inorderTraversal(this.root, result);
    return result;
  }

  private inorderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      this.inorderTraversal(node.left, result);
      result.push(node.value);
      this.inorderTraversal(node.right, result);
    }
  }

  /**
   * Pre-order traversal: root -> left -> right
   */
  preorder(): T[] {
    const result: T[] = [];
    this.preorderTraversal(this.root, result);
    return result;
  }

  private preorderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      result.push(node.value);
      this.preorderTraversal(node.left, result);
      this.preorderTraversal(node.right, result);
    }
  }

  /**
   * Post-order traversal: left -> right -> root
   */
  postorder(): T[] {
    const result: T[] = [];
    this.postorderTraversal(this.root, result);
    return result;
  }

  private postorderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (node) {
      this.postorderTraversal(node.left, result);
      this.postorderTraversal(node.right, result);
      result.push(node.value);
    }
  }

  /**
   * Level-order traversal (breadth-first)
   */
  levelOrder(): T[] {
    const result: T[] = [];
    if (!this.root) return result;

    const queue: TreeNode<T>[] = [this.root];

    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.value);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return result;
  }

  /**
   * Get the height of the tree
   */
  getHeight(): number {
    return this.root ? this.root.getHeight() : 0;
  }

  /**
   * Check if the tree is balanced
   */
  isBalanced(): boolean {
    return this.checkBalance(this.root);
  }

  private checkBalance(node: TreeNode<T> | null): boolean {
    if (!node) return true;

    const balanceFactor = node.getBalanceFactor();
    if (Math.abs(balanceFactor) > 1) return false;

    return this.checkBalance(node.left) && this.checkBalance(node.right);
  }

  /**
   * Find the lowest common ancestor of two values
   */
  findLCA(value1: T, value2: T): T | null {
    const node1 = this.findNode(value1);
    const node2 = this.findNode(value2);

    if (!node1 || !node2) return null;

    return this.findLCANode(node1, node2)?.value || null;
  }

  private findLCANode(node1: TreeNode<T>, node2: TreeNode<T>): TreeNode<T> | null {
    const path1 = this.getPathToRoot(node1);
    const path2 = this.getPathToRoot(node2);

    let i = path1.length - 1;
    let j = path2.length - 1;

    let lca: TreeNode<T> | null = null;

    while (i >= 0 && j >= 0 && path1[i] === path2[j]) {
      lca = path1[i];
      i--;
      j--;
    }

    return lca;
  }

  private getPathToRoot(node: TreeNode<T>): TreeNode<T>[] {
    const path: TreeNode<T>[] = [];
    let current: TreeNode<T> | null = node;

    while (current) {
      path.push(current);
      current = current.parent;
    }

    return path.reverse();
  }

  /**
   * Get all values within a range
   */
  rangeQuery(min: T, max: T): T[] {
    const result: T[] = [];
    this.rangeQueryTraversal(this.root, min, max, result);
    return result;
  }

  private rangeQueryTraversal(node: TreeNode<T> | null, min: T, max: T, result: T[]): void {
    if (!node) return;

    if (node.value >= min) {
      this.rangeQueryTraversal(node.left, min, max, result);
    }

    if (node.value >= min && node.value <= max) {
      result.push(node.value);
    }

    if (node.value <= max) {
      this.rangeQueryTraversal(node.right, min, max, result);
    }
  }

  /**
   * Convert the tree to an array representation
   */
  toArray(): (T | null)[] {
    if (!this.root) return [];

    const result: (T | null)[] = [];
    const queue: (TreeNode<T> | null)[] = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();

      if (node) {
        result.push(node.value);
        queue.push(node.left);
        queue.push(node.right);
      } else {
        result.push(null);
      }
    }

    // Remove trailing nulls
    while (result.length > 0 && result[result.length - 1] === null) {
      result.pop();
    }

    return result;
  }

  /**
   * Create a tree from an array representation
   */
  static fromArray<T>(array: (T | null)[]): BinarySearchTree<T> {
    const tree = new BinarySearchTree<T>();
    if (array.length === 0 || array[0] === null) return tree;

    tree.root = new TreeNode(array[0]);
    const queue: TreeNode<T>[] = [tree.root];
    let i = 1;

    while (i < array.length) {
      const node = queue.shift()!;

      // Left child
      if (i < array.length && array[i] !== null) {
        node.left = new TreeNode(array[i]!);
        node.left.parent = node;
        queue.push(node.left);
      }
      i++;

      // Right child
      if (i < array.length && array[i] !== null) {
        node.right = new TreeNode(array[i]!);
        node.right.parent = node;
        queue.push(node.right);
      }
      i++;
    }

    tree._size = tree.calculateSize();
    return tree;
  }

  private calculateSize(): number {
    let count = 0;
    const traverse = (node: TreeNode<T> | null) => {
      if (node) {
        count++;
        traverse(node.left);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return count;
  }

  /**
   * Clear the tree
   */
  clear(): void {
    this.root = null;
    this._size = 0;
  }

  /**
   * Create a string representation of the tree
   */
  toString(): string {
    return this.inorder().join(', ');
  }
}
