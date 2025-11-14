"""
Queue implementations in Python
Array-based, Linked List-based, Priority Queue, and Deque
"""

from abc import ABC, abstractmethod
from typing import Any, List, Tuple
import heapq

class QueueInterface(ABC):
    """Abstract base class for Queue implementations"""

    @abstractmethod
    def enqueue(self, item: Any) -> 'QueueInterface':
        """Add item to the end of queue"""
        pass

    @abstractmethod
    def dequeue(self) -> Any:
        """Remove item from the front of queue"""
        pass

    @abstractmethod
    def peek(self) -> Any:
        """Peek at front item without removing"""
        pass

    @abstractmethod
    def is_empty(self) -> bool:
        """Check if queue is empty"""
        pass

    @abstractmethod
    def size(self) -> int:
        """Get queue size"""
        pass

class QueueNode:
    """Node class for LinkedList-based queues"""
    def __init__(self, data: Any):
        self.data = data
        self.next = None

class ArrayQueue(QueueInterface):
    """Array-based Queue implementation - O(1) amortized operations"""

    def __init__(self):
        self._items: List[Any] = []

    def enqueue(self, item: Any) -> 'ArrayQueue':
        """Add item to the end of queue - O(1)"""
        self._items.append(item)
        return self

    def dequeue(self) -> Any:
        """Remove item from the front of queue - O(1) amortized"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._items.pop(0)

    def peek(self) -> Any:
        """Peek at front item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._items[0]

    def is_empty(self) -> bool:
        """Check if queue is empty - O(1)"""
        return len(self._items) == 0

    def size(self) -> int:
        """Get queue size - O(1)"""
        return len(self._items)

    def to_list(self) -> List[Any]:
        """Convert queue to list (front to back)"""
        return self._items.copy()

    def __len__(self) -> int:
        """Get size using len() function"""
        return self.size()

    def __str__(self) -> str:
        """String representation of the queue"""
        return '[' + ', '.join(str(x) for x in self._items) + ']'

    def __repr__(self) -> str:
        """Detailed string representation"""
        return f"ArrayQueue({self._items})"

class LinkedListQueue(QueueInterface):
    """Linked List-based Queue implementation - O(1) operations"""

    def __init__(self):
        self.head: QueueNode = None
        self.tail: QueueNode = None
        self._size: int = 0

    def enqueue(self, item: Any) -> 'LinkedListQueue':
        """Add item to the end of queue - O(1)"""
        new_node = QueueNode(item)

        if self.tail is None:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node

        self._size += 1
        return self

    def dequeue(self) -> Any:
        """Remove item from the front of queue - O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")

        data = self.head.data
        self.head = self.head.next

        if self.head is None:
            self.tail = None

        self._size -= 1
        return data

    def peek(self) -> Any:
        """Peek at front item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.head.data

    def is_empty(self) -> bool:
        """Check if queue is empty - O(1)"""
        return self.head is None

    def size(self) -> int:
        """Get queue size - O(1)"""
        return self._size

    def to_list(self) -> List[Any]:
        """Convert queue to list (front to back)"""
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
        """String representation of the queue"""
        return '[' + ', '.join(str(x) for x in self.to_list()) + ']'

    def __repr__(self) -> str:
        """Detailed string representation"""
        return f"LinkedListQueue({self.to_list()})"

class PriorityQueue:
    """Priority Queue implementation using min-heap"""

    def __init__(self):
        self._heap: List[Tuple[int, Any]] = []
        self._counter = 0  # To handle equal priorities

    def enqueue(self, item: Any, priority: int) -> 'PriorityQueue':
        """Add item with priority - O(log n)"""
        heapq.heappush(self._heap, (-priority, self._counter, item))
        self._counter += 1
        return self

    def dequeue(self) -> Any:
        """Remove highest priority item - O(log n)"""
        if self.is_empty():
            raise IndexError("Priority queue is empty")
        return heapq.heappop(self._heap)[2]

    def peek(self) -> Any:
        """Peek at highest priority item - O(1)"""
        if self.is_empty():
            raise IndexError("Priority queue is empty")
        return self._heap[0][2]

    def is_empty(self) -> bool:
        """Check if priority queue is empty - O(1)"""
        return len(self._heap) == 0

    def size(self) -> int:
        """Get priority queue size - O(1)"""
        return len(self._heap)

    def to_list(self) -> List[Tuple[Any, int]]:
        """Convert priority queue to list of (item, priority) tuples"""
        return [(item, -priority) for priority, _, item in self._heap]

    def __len__(self) -> int:
        """Get size using len() function"""
        return self.size()

    def __str__(self) -> str:
        """String representation of the priority queue"""
        items = [f"{item}({priority})" for item, priority in self.to_list()]
        return '[' + ', '.join(items) + ']'

    def __repr__(self) -> str:
        """Detailed string representation"""
        return f"PriorityQueue({self.to_list()})"

class Deque(QueueInterface):
    """Deque (Double-ended Queue) implementation"""

    def __init__(self):
        self._items: List[Any] = []

    def add_front(self, item: Any) -> 'Deque':
        """Add item to the front - O(1) amortized"""
        self._items.insert(0, item)
        return self

    def enqueue(self, item: Any) -> 'Deque':
        """Add item to the end - O(1) amortized"""
        self._items.append(item)
        return self

    def add_rear(self, item: Any) -> 'Deque':
        """Add item to the end (alias for enqueue)"""
        return self.enqueue(item)

    def dequeue(self) -> Any:
        """Remove item from the front - O(1) amortized"""
        if self.is_empty():
            raise IndexError("Deque is empty")
        return self._items.pop(0)

    def remove_front(self) -> Any:
        """Remove item from the front (alias for dequeue)"""
        return self.dequeue()

    def remove_rear(self) -> Any:
        """Remove item from the end - O(1) amortized"""
        if self.is_empty():
            raise IndexError("Deque is empty")
        return self._items.pop()

    def peek(self) -> Any:
        """Peek at front item - O(1)"""
        if self.is_empty():
            raise IndexError("Deque is empty")
        return self._items[0]

    def peek_front(self) -> Any:
        """Peek at front item (alias for peek)"""
        return self.peek()

    def peek_rear(self) -> Any:
        """Peek at rear item - O(1)"""
        if self.is_empty():
            raise IndexError("Deque is empty")
        return self._items[-1]

    def is_empty(self) -> bool:
        """Check if deque is empty - O(1)"""
        return len(self._items) == 0

    def size(self) -> int:
        """Get deque size - O(1)"""
        return len(self._items)

    def to_list(self) -> List[Any]:
        """Convert deque to list (front to back)"""
        return self._items.copy()

    def __len__(self) -> int:
        """Get size using len() function"""
        return self.size()

    def __str__(self) -> str:
        """String representation of the deque"""
        return '[' + ', '.join(str(x) for x in self._items) + ']'

    def __repr__(self) -> str:
        """Detailed string representation"""
        return f"Deque({self._items})"
