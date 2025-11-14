"""
Stack implementations in Python
Array-based and Linked List-based stacks with O(1) operations
"""

from abc import ABC, abstractmethod
from typing import Any, List

class StackInterface(ABC):
    """Abstract base class for Stack implementations"""

    @abstractmethod
    def push(self, item: Any) -> 'StackInterface':
        """Push item onto stack"""
        pass

    @abstractmethod
    def pop(self) -> Any:
        """Pop item from stack"""
        pass

    @abstractmethod
    def peek(self) -> Any:
        """Peek at top item without removing"""
        pass

    @abstractmethod
    def is_empty(self) -> bool:
        """Check if stack is empty"""
        pass

    @abstractmethod
    def size(self) -> int:
        """Get stack size"""
        pass

class ArrayStack(StackInterface):
    """Array-based Stack implementation - O(1) operations"""

    def __init__(self):
        self._items: List[Any] = []

    def push(self, item: Any) -> 'ArrayStack':
        """Push item onto stack - O(1)"""
        self._items.append(item)
        return self

    def pop(self) -> Any:
        """Pop item from stack - O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._items.pop()

    def peek(self) -> Any:
        """Peek at top item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._items[-1]

    def is_empty(self) -> bool:
        """Check if stack is empty - O(1)"""
        return len(self._items) == 0

    def size(self) -> int:
        """Get stack size - O(1)"""
        return len(self._items)

    def to_list(self) -> List[Any]:
        """Convert stack to list (top to bottom)"""
        return self._items[::-1]

    def __len__(self) -> int:
        """Get size using len() function"""
        return self.size()

    def __str__(self) -> str:
        """String representation of the stack"""
        return '[' + ', '.join(str(x) for x in self.to_list()) + ']'

    def __repr__(self) -> str:
        """Detailed string representation"""
        return f"ArrayStack({self.to_list()})"

class LinkedListStackNode:
    """Node class for LinkedListStack"""
    def __init__(self, data: Any):
        self.data = data
        self.next = None

class LinkedListStack(StackInterface):
    """Linked List-based Stack implementation - O(1) operations"""

    def __init__(self):
        self.head: LinkedListStackNode = None
        self._size: int = 0

    def push(self, item: Any) -> 'LinkedListStack':
        """Push item onto stack - O(1)"""
        new_node = LinkedListStackNode(item)
        new_node.next = self.head
        self.head = new_node
        self._size += 1
        return self

    def pop(self) -> Any:
        """Pop item from stack - O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")

        data = self.head.data
        self.head = self.head.next
        self._size -= 1

        return data

    def peek(self) -> Any:
        """Peek at top item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.head.data

    def is_empty(self) -> bool:
        """Check if stack is empty - O(1)"""
        return self.head is None

    def size(self) -> int:
        """Get stack size - O(1)"""
        return self._size

    def to_list(self) -> List[Any]:
        """Convert stack to list (top to bottom)"""
        result = []
        current = self.head

        while current is not None:
            result.append(current.data)
            current = current.next

        return result

    def __len__(self) -> int:
        """Get size using len() function"""
        return self.size()

    def __str__(self) -> str:
        """String representation of the stack"""
        return '[' + ', '.join(str(x) for x in self.to_list()) + ']'

    def __repr__(self) -> str:
        """Detailed string representation"""
        return f"LinkedListStack({self.to_list()})"
