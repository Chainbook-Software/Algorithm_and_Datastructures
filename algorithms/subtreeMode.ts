/**
 * Algorithms for tree data structures.
 */

import { TreeNode } from '../datastructures/tree';

/**
 * Computes the mode (most frequent color) for each subtree in a tree.
 * @param tree The root of the tree.
 * @returns A Map where keys are nodes and values are the mode color of their subtree.
 */
export function subtreeMode(tree: TreeNode): Map<TreeNode, number> {
  const subtreeModes = new Map<TreeNode, number>();

  function computeSubtreeMode(node: TreeNode): number {
    if (subtreeModes.has(node)) {
      return subtreeModes.get(node)!;
    }

    if (node.children.length === 0) {
      // Leaf node
      const mode = node.color!;
      subtreeModes.set(node, mode);
      return mode;
    }

    const colorCounts = new Map<number, number>();

    for (const child of node.children) {
      const childMode = computeSubtreeMode(child);
      colorCounts.set(childMode, (colorCounts.get(childMode) || 0) + 1);
    }

    let mode = -1;
    let maxCount = 0;

    for (const [color, count] of colorCounts) {
      if (count > maxCount) {
        mode = color;
        maxCount = count;
      }
    }

    subtreeModes.set(node, mode);
    return mode;
  }

  computeSubtreeMode(tree);
  return subtreeModes;
}
