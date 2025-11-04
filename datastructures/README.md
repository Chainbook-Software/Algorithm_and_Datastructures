# Data Structures

This directory contains data structure definitions.

## Files

- `tree.ts` - Tree data structure with colored leaf nodes
  - `TreeNode` interface - Node in a tree where leaves have colors
  - `Tree` interface - Tree with a root node

## Usage

```typescript
import { TreeNode, Tree } from './datastructures';

const leaf: TreeNode = { children: [], color: 1 };
const tree: Tree = { root: leaf };
```
