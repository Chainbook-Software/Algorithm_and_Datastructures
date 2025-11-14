"""
Algorithms for tree data structures.
"""

from typing import Dict
from datastructures.tree import TreeNode

def subtree_mode(tree: TreeNode) -> Dict[int, int]:
  """Computes the mode (most frequent color) for each subtree in a tree.

  Args:
    tree: The root of the tree.

  Returns:
    A map where keys are node IDs and values are the mode color of their subtree.
  """
  subtree_modes: Dict[int, int] = {}

  def compute_subtree_mode(node: TreeNode) -> int:
    node_id = id(node)
    if node_id in subtree_modes:
      return subtree_modes[node_id]

    if not node.children:
      # Leaf node
      mode = node.color if node.color is not None else -1
      subtree_modes[node_id] = mode
      return mode

    color_counts: Dict[int, int] = {}

    for child in node.children:
      child_mode = compute_subtree_mode(child)
      color_counts[child_mode] = color_counts.get(child_mode, 0) + 1

    mode = -1
    max_count = 0

    for color, count in color_counts.items():
      if count > max_count:
        mode = color
        max_count = count

    subtree_modes[node_id] = mode
    return mode

  compute_subtree_mode(tree)
  return subtree_modes
