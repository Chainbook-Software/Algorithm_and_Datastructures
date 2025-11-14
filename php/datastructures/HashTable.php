<?php

/**
 * HashTable implementation with chaining collision resolution
 */
class HashTable {
    private $buckets;
    private $size;
    private $capacity;

    public function __construct($capacity = 16) {
        $this->capacity = $capacity;
        $this->buckets = array_fill(0, $capacity, []);
        $this->size = 0;
    }

    /**
     * Hash function using djb2 algorithm
     */
    private function _hash($key) {
        $hash = 5381;
        $keyStr = (string)$key;

        for ($i = 0; $i < strlen($keyStr); $i++) {
            $hash = (($hash << 5) + $hash) + ord($keyStr[$i]);
        }

        return abs($hash) % $this->capacity;
    }

    /**
     * Insert key-value pair - O(1) average
     */
    public function put($key, $value) {
        $index = $this->_hash($key);
        $bucket = &$this->buckets[$index];

        // Check if key already exists
        foreach ($bucket as &$pair) {
            if ($pair['key'] === $key) {
                $pair['value'] = $value;
                return $this;
            }
        }

        // Key doesn't exist, add new pair
        $bucket[] = ['key' => $key, 'value' => $value];
        $this->size++;

        // Resize if load factor is too high
        if ($this->size / $this->capacity > 0.75) {
            $this->_resize($this->capacity * 2);
        }

        return $this;
    }

    /**
     * Get value by key - O(1) average
     */
    public function get($key) {
        $index = $this->_hash($key);
        $bucket = $this->buckets[$index];

        foreach ($bucket as $pair) {
            if ($pair['key'] === $key) {
                return $pair['value'];
            }
        }

        throw new OutOfBoundsException("Key not found: $key");
    }

    /**
     * Check if key exists - O(1) average
     */
    public function has($key) {
        $index = $this->_hash($key);
        $bucket = $this->buckets[$index];

        foreach ($bucket as $pair) {
            if ($pair['key'] === $key) {
                return true;
            }
        }

        return false;
    }

    /**
     * Remove key-value pair - O(1) average
     */
    public function remove($key) {
        $index = $this->_hash($key);
        $bucket = &$this->buckets[$index];

        foreach ($bucket as $i => $pair) {
            if ($pair['key'] === $key) {
                unset($bucket[$i]);
                $bucket = array_values($bucket); // Reindex array
                $this->size--;

                // Resize if load factor is too low
                if ($this->capacity > 16 && $this->size / $this->capacity < 0.25) {
                    $this->_resize($this->capacity / 2);
                }

                return $pair['value'];
            }
        }

        throw new OutOfBoundsException("Key not found: $key");
    }

    /**
     * Get all keys - O(n)
     */
    public function keys() {
        $keys = [];

        foreach ($this->buckets as $bucket) {
            foreach ($bucket as $pair) {
                $keys[] = $pair['key'];
            }
        }

        return $keys;
    }

    /**
     * Get all values - O(n)
     */
    public function values() {
        $values = [];

        foreach ($this->buckets as $bucket) {
            foreach ($bucket as $pair) {
                $values[] = $pair['value'];
            }
        }

        return $values;
    }

    /**
     * Get all key-value pairs - O(n)
     */
    public function entries() {
        $entries = [];

        foreach ($this->buckets as $bucket) {
            foreach ($bucket as $pair) {
                $entries[] = $pair;
            }
        }

        return $entries;
    }

    /**
     * Get current size
     */
    public function size() {
        return $this->size;
    }

    /**
     * Get current capacity
     */
    public function capacity() {
        return $this->capacity;
    }

    /**
     * Calculate load factor
     */
    public function loadFactor() {
        return $this->size / $this->capacity;
    }

    /**
     * Get bucket sizes for analysis
     */
    public function bucketSizes() {
        return array_map('count', $this->buckets);
    }

    /**
     * Resize the hash table
     */
    private function _resize($newCapacity) {
        $oldBuckets = $this->buckets;
        $this->capacity = $newCapacity;
        $this->buckets = array_fill(0, $newCapacity, []);
        $this->size = 0;

        // Rehash all existing entries
        foreach ($oldBuckets as $bucket) {
            foreach ($bucket as $pair) {
                $this->put($pair['key'], $pair['value']);
            }
        }
    }

    /**
     * Clear all entries
     */
    public function clear() {
        $this->buckets = array_fill(0, $this->capacity, []);
        $this->size = 0;
    }

    /**
     * Check if hash table is empty
     */
    public function isEmpty() {
        return $this->size === 0;
    }

    public function __toString() {
        $pairs = [];

        foreach ($this->buckets as $bucket) {
            foreach ($bucket as $pair) {
                $pairs[] = $pair['key'] . ' => ' . $pair['value'];
            }
        }

        return '{' . implode(', ', $pairs) . '}';
    }
}

/**
 * HashTable with linear probing collision resolution
 */
class LinearProbingHashTable {
    private $keys;
    private $values;
    private $capacity;
    private $size;
    private $deleted;

    public function __construct($capacity = 16) {
        $this->capacity = $capacity;
        $this->keys = array_fill(0, $capacity, null);
        $this->values = array_fill(0, $capacity, null);
        $this->deleted = array_fill(0, $capacity, false);
        $this->size = 0;
    }

    /**
     * Hash function
     */
    private function _hash($key) {
        $hash = 5381;
        $keyStr = (string)$key;

        for ($i = 0; $i < strlen($keyStr); $i++) {
            $hash = (($hash << 5) + $hash) + ord($keyStr[$i]);
        }

        return abs($hash) % $this->capacity;
    }

    /**
     * Find position for key using linear probing
     */
    private function _findPosition($key) {
        $index = $this->_hash($key);

        while ($this->keys[$index] !== null || $this->deleted[$index]) {
            if ($this->keys[$index] === $key && !$this->deleted[$index]) {
                return $index;
            }
            $index = ($index + 1) % $this->capacity;
        }

        return $index;
    }

    /**
     * Insert key-value pair - O(1) average
     */
    public function put($key, $value) {
        if ($this->size / $this->capacity > 0.75) {
            $this->_resize($this->capacity * 2);
        }

        $index = $this->_findPosition($key);

        if ($this->keys[$index] === null) {
            $this->size++;
        }

        $this->keys[$index] = $key;
        $this->values[$index] = $value;
        $this->deleted[$index] = false;

        return $this;
    }

    /**
     * Get value by key - O(1) average
     */
    public function get($key) {
        $index = $this->_findPosition($key);

        if ($this->keys[$index] === $key && !$this->deleted[$index]) {
            return $this->values[$index];
        }

        throw new OutOfBoundsException("Key not found: $key");
    }

    /**
     * Check if key exists - O(1) average
     */
    public function has($key) {
        $index = $this->_findPosition($key);
        return $this->keys[$index] === $key && !$this->deleted[$index];
    }

    /**
     * Remove key-value pair - O(1) average
     */
    public function remove($key) {
        $index = $this->_findPosition($key);

        if ($this->keys[$index] === $key && !$this->deleted[$index]) {
            $value = $this->values[$index];
            $this->deleted[$index] = true;
            $this->size--;

            if ($this->capacity > 16 && $this->size / $this->capacity < 0.25) {
                $this->_resize($this->capacity / 2);
            }

            return $value;
        }

        throw new OutOfBoundsException("Key not found: $key");
    }

    /**
     * Get all keys - O(n)
     */
    public function keys() {
        $keys = [];

        for ($i = 0; $i < $this->capacity; $i++) {
            if ($this->keys[$i] !== null && !$this->deleted[$i]) {
                $keys[] = $this->keys[$i];
            }
        }

        return $keys;
    }

    /**
     * Get all values - O(n)
     */
    public function values() {
        $values = [];

        for ($i = 0; $i < $this->capacity; $i++) {
            if ($this->keys[$i] !== null && !$this->deleted[$i]) {
                $values[] = $this->values[$i];
            }
        }

        return $values;
    }

    /**
     * Get current size
     */
    public function size() {
        return $this->size;
    }

    /**
     * Get current capacity
     */
    public function capacity() {
        return $this->capacity;
    }

    /**
     * Calculate load factor
     */
    public function loadFactor() {
        return $this->size / $this->capacity;
    }

    /**
     * Resize the hash table
     */
    private function _resize($newCapacity) {
        $oldKeys = $this->keys;
        $oldValues = $this->values;

        $this->capacity = $newCapacity;
        $this->keys = array_fill(0, $newCapacity, null);
        $this->values = array_fill(0, $newCapacity, null);
        $this->deleted = array_fill(0, $newCapacity, false);
        $this->size = 0;

        // Rehash all existing entries
        for ($i = 0; $i < count($oldKeys); $i++) {
            if ($oldKeys[$i] !== null && !$this->deleted[$i]) {
                $this->put($oldKeys[$i], $oldValues[$i]);
            }
        }
    }

    /**
     * Clear all entries
     */
    public function clear() {
        $this->keys = array_fill(0, $this->capacity, null);
        $this->values = array_fill(0, $this->capacity, null);
        $this->deleted = array_fill(0, $this->capacity, false);
        $this->size = 0;
    }

    /**
     * Check if hash table is empty
     */
    public function isEmpty() {
        return $this->size === 0;
    }

    public function __toString() {
        $pairs = [];

        for ($i = 0; $i < $this->capacity; $i++) {
            if ($this->keys[$i] !== null && !$this->deleted[$i]) {
                $pairs[] = $this->keys[$i] . ' => ' . $this->values[$i];
            }
        }

        return '{' . implode(', ', $pairs) . '}';
    }
}

?>
