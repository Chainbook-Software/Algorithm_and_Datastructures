/// <reference types="jest" />

import { subtreeMode, TreeNode } from '../index';

describe('subtreeMode', () => {
  test('computes subtree modes for a simple tree', () => {
    // Create a simple tree:
    //     1 (color 1)
    //    / \
    //   2   3 (color 2)
    //  / \
    // 4   5 (color 3)
    const node4: TreeNode = { children: [], color: 3 };
    const node5: TreeNode = { children: [], color: 3 };
    const node2: TreeNode = { children: [node4, node5], color: undefined };
    const node3: TreeNode = { children: [], color: 2 };
    const root: TreeNode = { children: [node2, node3], color: undefined };

    const result = subtreeMode(root);

    expect(result.get(node4)).toBe(3);
    expect(result.get(node5)).toBe(3);
    expect(result.get(node2)).toBe(3); // mode of subtree: 3 appears twice
    expect(result.get(node3)).toBe(2);
    expect(result.get(root)).toBe(3); // mode of subtree: 3 appears once (from node2), 2 appears once (from node3) - picks first encountered
  });

  test('handles single node tree', () => {
    const root: TreeNode = { children: [], color: 5 };
    const result = subtreeMode(root);
    expect(result.get(root)).toBe(5);
  });

  test('handles tree with uniform colors', () => {
    const node4: TreeNode = { children: [], color: 1 };
    const node5: TreeNode = { children: [], color: 1 };
    const node2: TreeNode = { children: [node4, node5], color: undefined };
    const node3: TreeNode = { children: [], color: 1 };
    const root: TreeNode = { children: [node2, node3], color: undefined };

    const result = subtreeMode(root);

    expect(result.get(node4)).toBe(1);
    expect(result.get(node5)).toBe(1);
    expect(result.get(node2)).toBe(1);
    expect(result.get(node3)).toBe(1);
    expect(result.get(root)).toBe(1);
  });

  test('handles tree with tie in mode counts', () => {
    // Tree where root has children with different modes
    const node2: TreeNode = { children: [], color: 2 };
    const node3: TreeNode = { children: [], color: 3 };
    const root: TreeNode = { children: [node2, node3], color: undefined };

    const result = subtreeMode(root);

    expect(result.get(node2)).toBe(2);
    expect(result.get(node3)).toBe(3);
    // Root has two children with modes 2 and 3, tie - should pick the first one encountered
    expect([2, 3]).toContain(result.get(root));
  });
});
