<?php

/**
 * Queue Interface
 */
interface QueueInterface {
    public function enqueue($item);
    public function dequeue();
    public function peek();
    public function isEmpty();
    public function size();
}

/**
 * Node class for LinkedList-based queues
 */
class QueueNode {
    public $data;
    public $next;

    public function __construct($data) {
        $this->data = $data;
        $this->next = null;
    }
}

/**
 * Array-based Queue implementation - O(1) amortized operations
 */
class ArrayQueue implements QueueInterface {
    private $items;

    public function __construct() {
        $this->items = [];
    }

    /**
     * Add item to the end of queue - O(1)
     */
    public function enqueue($item) {
        $this->items[] = $item;
        return $this;
    }

    /**
     * Remove item from the front of queue - O(1) amortized
     */
    public function dequeue() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Queue is empty");
        }
        return array_shift($this->items);
    }

    /**
     * Peek at front item without removing - O(1)
     */
    public function peek() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Queue is empty");
        }
        return $this->items[0];
    }

    /**
     * Check if queue is empty - O(1)
     */
    public function isEmpty() {
        return empty($this->items);
    }

    /**
     * Get queue size - O(1)
     */
    public function size() {
        return count($this->items);
    }

    /**
     * Convert queue to array (front to back)
     */
    public function toArray() {
        return $this->items;
    }

    public function __toString() {
        return '[' . implode(', ', $this->items) . ']';
    }
}

/**
 * Linked List-based Queue implementation - O(1) operations
 */
class LinkedListQueue implements QueueInterface {
    private $head;
    private $tail;
    private $size;

    public function __construct() {
        $this->head = null;
        $this->tail = null;
        $this->size = 0;
    }

    /**
     * Add item to the end of queue - O(1)
     */
    public function enqueue($item) {
        $newNode = new QueueNode($item);

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
     * Remove item from the front of queue - O(1)
     */
    public function dequeue() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Queue is empty");
        }

        $data = $this->head->data;
        $this->head = $this->head->next;

        if ($this->head === null) {
            $this->tail = null;
        }

        $this->size--;
        return $data;
    }

    /**
     * Peek at front item without removing - O(1)
     */
    public function peek() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Queue is empty");
        }
        return $this->head->data;
    }

    /**
     * Check if queue is empty - O(1)
     */
    public function isEmpty() {
        return $this->head === null;
    }

    /**
     * Get queue size - O(1)
     */
    public function size() {
        return $this->size;
    }

    /**
     * Convert queue to array (front to back)
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

/**
 * Priority Queue implementation using max-heap
 */
class PriorityQueue {
    private $heap;

    public function __construct() {
        $this->heap = [];
    }

    /**
     * Add item with priority - O(log n)
     */
    public function enqueue($item, $priority) {
        $this->heap[] = ['item' => $item, 'priority' => $priority];
        $this->_bubbleUp(count($this->heap) - 1);
        return $this;
    }

    /**
     * Remove highest priority item - O(log n)
     */
    public function dequeue() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Priority queue is empty");
        }

        $root = $this->heap[0];
        $last = array_pop($this->heap);

        if (!$this->isEmpty()) {
            $this->heap[0] = $last;
            $this->_sinkDown(0);
        }

        return $root['item'];
    }

    /**
     * Peek at highest priority item - O(1)
     */
    public function peek() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Priority queue is empty");
        }
        return $this->heap[0]['item'];
    }

    /**
     * Check if priority queue is empty - O(1)
     */
    public function isEmpty() {
        return empty($this->heap);
    }

    /**
     * Get priority queue size - O(1)
     */
    public function size() {
        return count($this->heap);
    }

    /**
     * Bubble up element to maintain heap property
     */
    private function _bubbleUp($index) {
        while ($index > 0) {
            $parentIndex = floor(($index - 1) / 2);

            if ($this->heap[$index]['priority'] <= $this->heap[$parentIndex]['priority']) {
                break;
            }

            $this->_swap($index, $parentIndex);
            $index = $parentIndex;
        }
    }

    /**
     * Sink down element to maintain heap property
     */
    private function _sinkDown($index) {
        $size = count($this->heap);

        while (true) {
            $left = 2 * $index + 1;
            $right = 2 * $index + 2;
            $largest = $index;

            if ($left < $size && $this->heap[$left]['priority'] > $this->heap[$largest]['priority']) {
                $largest = $left;
            }

            if ($right < $size && $this->heap[$right]['priority'] > $this->heap[$largest]['priority']) {
                $largest = $right;
            }

            if ($largest === $index) {
                break;
            }

            $this->_swap($index, $largest);
            $index = $largest;
        }
    }

    /**
     * Swap two elements in heap
     */
    private function _swap($i, $j) {
        $temp = $this->heap[$i];
        $this->heap[$i] = $this->heap[$j];
        $this->heap[$j] = $temp;
    }

    public function __toString() {
        $items = array_map(function($element) {
            return $element['item'] . '(' . $element['priority'] . ')';
        }, $this->heap);

        return '[' . implode(', ', $items) . ']';
    }
}

/**
 * Deque (Double-ended Queue) implementation
 */
class Deque implements QueueInterface {
    private $items;

    public function __construct() {
        $this->items = [];
    }

    /**
     * Add item to the front - O(1) amortized
     */
    public function addFront($item) {
        array_unshift($this->items, $item);
        return $this;
    }

    /**
     * Add item to the end - O(1) amortized
     */
    public function enqueue($item) {
        $this->items[] = $item;
        return $this;
    }

    /**
     * Add item to the end (alias for enqueue)
     */
    public function addRear($item) {
        return $this->enqueue($item);
    }

    /**
     * Remove item from the front - O(1) amortized
     */
    public function dequeue() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Deque is empty");
        }
        return array_shift($this->items);
    }

    /**
     * Remove item from the front (alias for dequeue)
     */
    public function removeFront() {
        return $this->dequeue();
    }

    /**
     * Remove item from the end - O(1) amortized
     */
    public function removeRear() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Deque is empty");
        }
        return array_pop($this->items);
    }

    /**
     * Peek at front item - O(1)
     */
    public function peek() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Deque is empty");
        }
        return $this->items[0];
    }

    /**
     * Peek at front item (alias for peek)
     */
    public function peekFront() {
        return $this->peek();
    }

    /**
     * Peek at rear item - O(1)
     */
    public function peekRear() {
        if ($this->isEmpty()) {
            throw new UnderflowException("Deque is empty");
        }
        return end($this->items);
    }

    /**
     * Check if deque is empty - O(1)
     */
    public function isEmpty() {
        return empty($this->items);
    }

    /**
     * Get deque size - O(1)
     */
    public function size() {
        return count($this->items);
    }

    /**
     * Convert deque to array (front to back)
     */
    public function toArray() {
        return $this->items;
    }

    public function __toString() {
        return '[' . implode(', ', $this->items) . ']';
    }
}

?>
