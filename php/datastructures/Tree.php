<?php

/**
 * Tree data structure definitions.
 */

/**
 * Represents a node in a tree where leaves have colors.
 */
class TreeNode {
  /** @var TreeNode[] */
  public array $children;
  /** @var int|null Only defined for leaf nodes */
  public ?int $color;

  public function __construct(?int $color = null, array $children = []) {
    $this->color = $color;
    $this->children = $children;
  }
}

/**
 * Represents a tree with a root node.
 */
class Tree {
  public TreeNode $root;

  public function __construct(TreeNode $root) {
    $this->root = $root;
  }
}

?>
