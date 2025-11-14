"""
Tree data structure definitions.
"""

from typing import List, Optional
from dataclasses import dataclass

@dataclass
class TreeNode:
  """Represents a node in a tree where leaves have colors."""
  children: List['TreeNode']
  color: Optional[int] = None  # Only defined for leaf nodes

@dataclass
class Tree:
  """Represents a tree with a root node."""
  root: TreeNode
