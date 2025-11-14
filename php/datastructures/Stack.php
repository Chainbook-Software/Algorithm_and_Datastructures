<?php
/**
 * Node class for LinkedListStack
 */
class LinkedListStackNode {
    public $data;
    public $next;

    public function __construct($data) {
        $this->data = $data;
        $this->next = null;
    }
}

/**
 * Stack Interface
 */
interface StackInterface {
    public function push($item);
    public function pop();
    public function peek();
    public function isEmpty();
    public function size();
}

/**
 * Array-based Stack implementation - O(1) operations
 */
class ArrayStack implements StackInterface {
    private $items;

    public function __construct() {
        $this->items = [];
    }

    /**
     * Push item onto stack - O(1)
     */
    public function push($item) {
        array_push($this->items, $item);
        return $this;
    }

    /**
     * Pop item from stack - O(1)
     */
    public function pop() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Stack is empty");
        }
        return array_pop($this->items);
    }

    /**
     * Peek at top item without removing - O(1)
     */
    public function peek() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Stack is empty");
        }
        return end($this->items);
    }

    /**
     * Check if stack is empty - O(1)
     */
    public function isEmpty() {
        return empty($this->items);
    }

    /**
     * Get stack size - O(1)
     */
    public function size() {
        return count($this->items);
    }

    /**
     * Convert stack to array (top to bottom)
     */
    public function toArray() {
        return array_reverse($this->items);
    }

    public function __toString() {
        return '[' . implode(', ', $this->toArray()) . ']';
    }
}

/**
 * Linked List-based Stack implementation - O(1) operations
 */
class LinkedListStack implements StackInterface {
    private $head;
    private $size;

    public function __construct() {
        $this->head = null;
        $this->size = 0;
    }

    /**
     * Push item onto stack - O(1)
     */
    public function push($item) {
        $newNode = new LinkedListStackNode($item);
        $newNode->next = $this->head;
        $this->head = $newNode;
        $this->size++;
        return $this;
    }

    /**
     * Pop item from stack - O(1)
     */
    public function pop() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Stack is empty");
        }

        $data = $this->head->data;
        $this->head = $this->head->next;
        $this->size--;

        return $data;
    }

    /**
     * Peek at top item without removing - O(1)
     */
    public function peek() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Stack is empty");
        }
        return $this->head->data;
    }

    /**
     * Check if stack is empty - O(1)
     */
    public function isEmpty() {
        return $this->head === null;
    }

    /**
     * Get stack size - O(1)
     */
    public function size() {
        return $this->size;
    }

    /**
     * Convert stack to array (top to bottom)
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

    public function __toString() {
        return '[' . implode(', ', $this->toArray()) . ']';
    }
}
?>
