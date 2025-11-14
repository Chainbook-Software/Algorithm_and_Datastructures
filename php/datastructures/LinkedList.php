<?php

/**
 * Node class for LinkedList
 */
class ListNode {
    public $data;
    public $next;

    public function __construct($data) {
        $this->data = $data;
        $this->next = null;
    }
}

/**
 * LinkedList implementation with O(1) prepend/append and O(n) insert/delete
 */
class LinkedList {
    private $head;
    private $tail;
    private $size;

    public function __construct() {
        $this->head = null;
        $this->tail = null;
        $this->size = 0;
    }

    /**
     * Add element to the beginning of the list - O(1)
     */
    public function prepend($data) {
        $newNode = new ListNode($data);

        if ($this->head === null) {
            $this->head = $newNode;
            $this->tail = $newNode;
        } else {
            $newNode->next = $this->head;
            $this->head = $newNode;
        }

        $this->size++;
        return $this;
    }

    /**
     * Add element to the end of the list - O(1)
     */
    public function append($data) {
        $newNode = new ListNode($data);

        if ($this->tail === null) {
            $this->head = $newNode;
            $this->tail = $newNode;
        } else {
            $this->tail->next = $newNode;
            $this->tail = $newNode;
        }

        $this->size++;
        return $this;
    }

    /**
     * Insert element at specific index - O(n)
     */
    public function insertAt($data, $index) {
        if ($index < 0 || $index > $this->size) {
            throw new InvalidArgumentException("Index out of bounds");
        }

        if ($index === 0) {
            return $this->prepend($data);
        }

        if ($index === $this->size) {
            return $this->append($data);
        }

        $newNode = new ListNode($data);
        $current = $this->head;

        for ($i = 0; $i < $index - 1; $i++) {
            $current = $current->next;
        }

        $newNode->next = $current->next;
        $current->next = $newNode;
        $this->size++;

        return $this;
    }

    /**
     * Remove element at specific index - O(n)
     */
    public function removeAt($index) {
        if ($index < 0 || $index >= $this->size) {
            throw new InvalidArgumentException("Index out of bounds");
        }

        $removedData = null;

        if ($index === 0) {
            $removedData = $this->head->data;
            $this->head = $this->head->next;

            if ($this->head === null) {
                $this->tail = null;
            }
        } else {
            $current = $this->head;

            for ($i = 0; $i < $index - 1; $i++) {
                $current = $current->next;
            }

            $removedData = $current->next->data;
            $current->next = $current->next->next;

            if ($current->next === null) {
                $this->tail = $current;
            }
        }

        $this->size--;
        return $removedData;
    }

    /**
     * Get element at specific index - O(n)
     */
    public function get($index) {
        if ($index < 0 || $index >= $this->size) {
            throw new InvalidArgumentException("Index out of bounds");
        }

        $current = $this->head;
        for ($i = 0; $i < $index; $i++) {
            $current = $current->next;
        }

        return $current->data;
    }

    /**
     * Reverse the linked list - O(n)
     */
    public function reverse() {
        $prev = null;
        $current = $this->head;
        $this->tail = $this->head;

        while ($current !== null) {
            $next = $current->next;
            $current->next = $prev;
            $prev = $current;
            $current = $next;
        }

        $this->head = $prev;
        return $this;
    }

    /**
     * Check if list contains cycle - O(n)
     */
    public function hasCycle() {
        if ($this->head === null) {
            return false;
        }

        $slow = $this->head;
        $fast = $this->head;

        while ($fast !== null && $fast->next !== null) {
            $slow = $slow->next;
            $fast = $fast->next->next;

            if ($slow === $fast) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get size of the list - O(1)
     */
    public function size() {
        return $this->size;
    }

    /**
     * Check if list is empty - O(1)
     */
    public function isEmpty() {
        return $this->size === 0;
    }

    /**
     * Convert list to array - O(n)
     */
    public function toArray() {
        $array = [];
        $current = $this->head;

        while ($current !== null) {
            $array[] = $current->data;
            $current = $current->next;
        }

        return $array;
    }

    /**
     * Create linked list from array - O(n)
     */
    public static function fromArray($array) {
        $list = new LinkedList();

        foreach ($array as $item) {
            $list->append($item);
        }

        return $list;
    }

    /**
     * Get string representation of the list
     */
    public function __toString() {
        return '[' . implode(' -> ', $this->toArray()) . ']';
    }
}

?>
