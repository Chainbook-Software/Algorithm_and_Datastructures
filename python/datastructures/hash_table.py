"""
HashTable implementations in Python
Chaining and Linear Probing collision resolution
"""

from typing import Any, List, Dict, Tuple, Optional

class HashTable:
    """HashTable implementation with chaining collision resolution"""

    def __init__(self, capacity: int = 16):
        self._capacity = capacity
        self._buckets: List[List[Dict[str, Any]]] = [[] for _ in range(capacity)]
        self._size = 0

    def _hash(self, key: Any) -> int:
        """Hash function using djb2 algorithm"""
        hash_value = 5381
        key_str = str(key)

        for char in key_str:
            hash_value = ((hash_value << 5) + hash_value) + ord(char)

        return abs(hash_value) % self._capacity

    def put(self, key: Any, value: Any) -> 'HashTable':
        """Insert key-value pair - O(1) average"""
        index = self._hash(key)
        bucket = self._buckets[index]

        # Check if key already exists
        for pair in bucket:
            if pair['key'] == key:
                pair['value'] = value
                return self

        # Key doesn't exist, add new pair
        bucket.append({'key': key, 'value': value})
        self._size += 1

        # Resize if load factor is too high
        if self._size / self._capacity > 0.75:
            self._resize(self._capacity * 2)

        return self

    def get(self, key: Any) -> Any:
        """Get value by key - O(1) average"""
        index = self._hash(key)
        bucket = self._buckets[index]

        for pair in bucket:
            if pair['key'] == key:
                return pair['value']

        raise KeyError(f"Key not found: {key}")

    def has(self, key: Any) -> bool:
        """Check if key exists - O(1) average"""
        index = self._hash(key)
        bucket = self._buckets[index]

        for pair in bucket:
            if pair['key'] == key:
                return True

        return False

    def remove(self, key: Any) -> Any:
        """Remove key-value pair - O(1) average"""
        index = self._hash(key)
        bucket = self._buckets[index]

        for i, pair in enumerate(bucket):
            if pair['key'] == key:
                removed_value = pair['value']
                del bucket[i]
                self._size -= 1

                # Resize if load factor is too low
                if self._capacity > 16 and self._size / self._capacity < 0.25:
                    self._resize(self._capacity // 2)

                return removed_value

        raise KeyError(f"Key not found: {key}")

    def keys(self) -> List[Any]:
        """Get all keys - O(n)"""
        keys = []

        for bucket in self._buckets:
            for pair in bucket:
                keys.append(pair['key'])

        return keys

    def values(self) -> List[Any]:
        """Get all values - O(n)"""
        values = []

        for bucket in self._buckets:
            for pair in bucket:
                values.append(pair['value'])

        return values

    def items(self) -> List[Tuple[Any, Any]]:
        """Get all key-value pairs - O(n)"""
        items = []

        for bucket in self._buckets:
            for pair in bucket:
                items.append((pair['key'], pair['value']))

        return items

    def size(self) -> int:
        """Get current size"""
        return self._size

    def capacity(self) -> int:
        """Get current capacity"""
        return self._capacity

    def load_factor(self) -> float:
        """Calculate load factor"""
        return self._size / self._capacity

    def bucket_sizes(self) -> List[int]:
        """Get bucket sizes for analysis"""
        return [len(bucket) for bucket in self._buckets]

    def _resize(self, new_capacity: int) -> None:
        """Resize the hash table"""
        old_buckets = self._buckets
        self._capacity = new_capacity
        self._buckets = [[] for _ in range(new_capacity)]
        self._size = 0

        # Rehash all existing entries
        for bucket in old_buckets:
            for pair in bucket:
                self.put(pair['key'], pair['value'])

    def clear(self) -> None:
        """Clear all entries"""
        self._buckets = [[] for _ in range(self._capacity)]
        self._size = 0

    def is_empty(self) -> bool:
        """Check if hash table is empty"""
        return self._size == 0

    def __len__(self) -> int:
        """Get size using len() function"""
        return self._size

    def __setitem__(self, key: Any, value: Any) -> None:
        """Set item using dictionary syntax"""
        self.put(key, value)

    def __getitem__(self, key: Any) -> Any:
        """Get item using dictionary syntax"""
        return self.get(key)

    def __contains__(self, key: Any) -> bool:
        """Check if key exists using 'in' operator"""
        return self.has(key)

    def __delitem__(self, key: Any) -> None:
        """Delete item using del syntax"""
        self.remove(key)

    def __str__(self) -> str:
        """String representation of the hash table"""
        pairs = [f"{pair['key']} => {pair['value']}" for bucket in self._buckets for pair in bucket]
        return '{' + ', '.join(pairs) + '}'

    def __repr__(self) -> str:
        """Detailed string representation"""
        return f"HashTable({dict(self.items())})"

class LinearProbingHashTable:
    """HashTable with linear probing collision resolution"""

    def __init__(self, capacity: int = 16):
        self._capacity = capacity
        self._keys: List[Optional[Any]] = [None] * capacity
        self._values: List[Optional[Any]] = [None] * capacity
        self._deleted: List[bool] = [False] * capacity
        self._size = 0

    def _hash(self, key: Any) -> int:
        """Hash function"""
        hash_value = 5381
        key_str = str(key)

        for char in key_str:
            hash_value = ((hash_value << 5) + hash_value) + ord(char)

        return abs(hash_value) % self._capacity

    def _find_position(self, key: Any) -> int:
        """Find position for key using linear probing"""
        index = self._hash(key)

        while self._keys[index] is not None or self._deleted[index]:
            if self._keys[index] == key and not self._deleted[index]:
                return index
            index = (index + 1) % self._capacity

        return index

    def put(self, key: Any, value: Any) -> 'LinearProbingHashTable':
        """Insert key-value pair - O(1) average"""
        if self._size / self._capacity > 0.75:
            self._resize(self._capacity * 2)

        index = self._find_position(key)

        if self._keys[index] is None:
            self._size += 1

        self._keys[index] = key
        self._values[index] = value
        self._deleted[index] = False

        return self

    def get(self, key: Any) -> Any:
        """Get value by key - O(1) average"""
        index = self._find_position(key)

        if self._keys[index] == key and not self._deleted[index]:
            return self._values[index]

        raise KeyError(f"Key not found: {key}")

    def has(self, key: Any) -> bool:
        """Check if key exists - O(1) average"""
        index = self._find_position(key)
        return self._keys[index] == key and not self._deleted[index]

    def remove(self, key: Any) -> Any:
        """Remove key-value pair - O(1) average"""
        index = self._find_position(key)

        if self._keys[index] == key and not self._deleted[index]:
            value = self._values[index]
            self._deleted[index] = True
            self._size -= 1

            if self._capacity > 16 and self._size / self._capacity < 0.25:
                self._resize(self._capacity // 2)

            return value

        raise KeyError(f"Key not found: {key}")

    def keys(self) -> List[Any]:
        """Get all keys - O(n)"""
        keys = []

        for i in range(self._capacity):
            if self._keys[i] is not None and not self._deleted[i]:
                keys.append(self._keys[i])

        return keys

    def values(self) -> List[Any]:
        """Get all values - O(n)"""
        values = []

        for i in range(self._capacity):
            if self._keys[i] is not None and not self._deleted[i]:
                values.append(self._values[i])

        return values

    def items(self) -> List[Tuple[Any, Any]]:
        """Get all key-value pairs - O(n)"""
        items = []

        for i in range(self._capacity):
            if self._keys[i] is not None and not self._deleted[i]:
                items.append((self._keys[i], self._values[i]))

        return items

    def size(self) -> int:
        """Get current size"""
        return self._size

    def capacity(self) -> int:
        """Get current capacity"""
        return self._capacity

    def load_factor(self) -> float:
        """Calculate load factor"""
        return self._size / self._capacity

    def _resize(self, new_capacity: int) -> None:
        """Resize the hash table"""
        old_keys = self._keys
        old_values = self._values

        self._capacity = new_capacity
        self._keys = [None] * new_capacity
        self._values = [None] * new_capacity
        self._deleted = [False] * new_capacity
        self._size = 0

        # Rehash all existing entries
        for i in range(len(old_keys)):
            if old_keys[i] is not None and not self._deleted[i]:
                self.put(old_keys[i], old_values[i])

    def clear(self) -> None:
        """Clear all entries"""
        self._keys = [None] * self._capacity
        self._values = [None] * self._capacity
        self._deleted = [False] * self._capacity
        self._size = 0

    def is_empty(self) -> bool:
        """Check if hash table is empty"""
        return self._size == 0

    def __len__(self) -> int:
        """Get size using len() function"""
        return self._size

    def __setitem__(self, key: Any, value: Any) -> None:
        """Set item using dictionary syntax"""
        self.put(key, value)

    def __getitem__(self, key: Any) -> Any:
        """Get item using dictionary syntax"""
        return self.get(key)

    def __contains__(self, key: Any) -> bool:
        """Check if key exists using 'in' operator"""
        return self.has(key)

    def __delitem__(self, key: Any) -> None:
        """Delete item using del syntax"""
        self.remove(key)

    def __str__(self) -> str:
        """String representation of the hash table"""
        pairs = [f"{key} => {value}" for key, value in self.items()]
        return '{' + ', '.join(pairs) + '}'

    def __repr__(self) -> str:
        """Detailed string representation"""
        return f"LinearProbingHashTable({dict(self.items())})"
