<?php

require_once __DIR__ . '/../datastructures/Tree.php';

/**
 * Algorithms for tree data structures.
 */

/**
 * Computes the mode (most frequent color) for each subtree in a tree.
 * @param TreeNode $tree The root of the tree.
 * @return array A map where keys are TreeNode objects and values are the mode color of their subtree.
 */
function subtreeMode(TreeNode $tree): array {
  $subtreeModes = [];

  $computeSubtreeMode = function(TreeNode $node) use (&$subtreeModes, &$computeSubtreeMode): int {
    if (isset($subtreeModes[spl_object_hash($node)])) {
      return $subtreeModes[spl_object_hash($node)];
    }

    if (empty($node->children)) {
      // Leaf node
      $mode = $node->color ?? -1;
      $subtreeModes[spl_object_hash($node)] = $mode;
      return $mode;
    }

    $colorCounts = [];

    foreach ($node->children as $child) {
      $childMode = $computeSubtreeMode($child);
      if (!isset($colorCounts[$childMode])) {
        $colorCounts[$childMode] = 0;
      }
      $colorCounts[$childMode]++;
    }

    $mode = -1;
    $maxCount = 0;

    foreach ($colorCounts as $color => $count) {
      if ($count > $maxCount) {
        $mode = $color;
        $maxCount = $count;
      }
    }

    $subtreeModes[spl_object_hash($node)] = $mode;
    return $mode;
  };

  $computeSubtreeMode($tree);
  return $subtreeModes;
}

?>
