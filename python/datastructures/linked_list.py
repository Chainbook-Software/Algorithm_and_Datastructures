"""
LinkedList implementation in Python
O(1) prepend/append, O(n) insert/delete operations
"""

class ListNode:
    """Node class for LinkedList"""
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    """LinkedList implementation with efficient operations"""

    def __init__(self):
        self.head = None
        self.tail = None
        self._size = 0

    def prepend(self, data):
        """Add element to the beginning of the list - O(1)"""
        new_node = ListNode(data)

        if self.head is None:
            self.head = new_node
            self.tail = new_node
        else:
            new_node.next = self.head
            self.head = new_node

        self._size += 1
        return self

    def append(self, data):
        """Add element to the end of the list - O(1)"""
        new_node = ListNode(data)

        if self.tail is None:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node

        self._size += 1
        return self

    def insert_at(self, data, index):
        """Insert element at specific index - O(n)"""
        if index < 0 or index > self._size:
            raise IndexError("Index out of bounds")

        if index == 0:
            return self.prepend(data)

        if index == self._size:
            return self.append(data)

        new_node = ListNode(data)
        current = self.head

        for i in range(index - 1):
            current = current.next

        new_node.next = current.next
        current.next = new_node
        self._size += 1

        return self

    def remove_at(self, index):
        """Remove element at specific index - O(n)"""
        if index < 0 or index >= self._size:
            raise IndexError("Index out of bounds")

        if index == 0:
            removed_data = self.head.data
            self.head = self.head.next

            if self.head is None:
                self.tail = None
        else:
            current = self.head

            for i in range(index - 1):
                current = current.next

            removed_data = current.next.data
            current.next = current.next.next

            if current.next is None:
                self.tail = current

        self._size -= 1
        return removed_data

    def get(self, index):
        """Get element at specific index - O(n)"""
        if index < 0 or index >= self._size:
            raise IndexError("Index out of bounds")

        current = self.head
        for i in range(index):
            current = current.next

        return current.data

    def reverse(self):
        """Reverse the linked list - O(n)"""
        prev = None
        current = self.head
        self.tail = self.head

        while current is not None:
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node

        self.head = prev
        return self

    def has_cycle(self):
        """Check if list contains cycle - O(n)"""
        if self.head is None:
            return False

        slow = self.head
        fast = self.head

        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next.next

            if slow == fast:
                return True

        return False

    def size(self):
        """Get size of the list - O(1)"""
        return self._size

    def is_empty(self):
        """Check if list is empty - O(1)"""
        return self._size == 0

    def to_list(self):
        """Convert list to Python list - O(n)"""
        result = []
        current = self.head

        while current is not None:
            result.append(current.data)
            current = current.next

        return result

    @classmethod
    def from_list(cls, data_list):
        """Create linked list from Python list - O(n)"""
        linked_list = cls()

        for item in data_list:
            linked_list.append(item)

        return linked_list

    def __len__(self):
        """Get size using len() function"""
        return self._size

    def __getitem__(self, index):
        """Get item using indexing syntax"""
        return self.get(index)

    def __str__(self):
        """String representation of the list"""
        return '[' + ' -> '.join(str(x) for x in self.to_list()) + ']'

    def __repr__(self):
        """Detailed string representation"""
        return f"LinkedList({self.to_list()})"
