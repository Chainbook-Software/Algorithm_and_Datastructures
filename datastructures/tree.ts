/**
 * Tree data structure definitions.
 */

/**
 * Represents a node in a tree where leaves have colors.
 */
export interface TreeNode {
  children: TreeNode[];
  color?: number; // Only defined for leaf nodes
}

/**
 * Represents a tree with a root node.
 */
export interface Tree {
  root: TreeNode;
}
