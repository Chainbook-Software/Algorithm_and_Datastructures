# Final Project: Complete Task Manager System

## 🎯 Objective
Create a comprehensive Task Manager System that combines multiple data structures and algorithms you've learned throughout this tutorial.

## 📋 System Requirements

### Core Features
1. **Task Management**: Add, update, delete, and search tasks
2. **Priority System**: Tasks have priorities (1-5, where 5 is highest)
3. **Processing Queue**: Process tasks in priority order
4. **Search Functionality**: Find tasks by description or tags
5. **Statistics**: Track completion rates and performance metrics

### Technical Requirements
- **Data Structures**: Combine Queue, Priority Queue, Map, and Set
- **Algorithms**: Implement search, sorting, and queue operations
- **Error Handling**: Proper validation and meaningful error messages
- **TypeScript**: Full type safety with interfaces and generics
- **Testing**: Comprehensive test suite

## 🏗️ System Architecture

### Data Models

```typescript
interface Task {
  id: number;
  description: string;
  priority: Priority; // 1-5
  createdAt: Date;
  completed: boolean;
  completedAt?: Date;
  tags: string[];
}

type Priority = 1 | 2 | 3 | 4 | 5;

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  averageCompletionTime: number; // in milliseconds
  completionRate: number; // percentage
}
```

### Interface Definition

```typescript
interface TaskManager {
  // Task CRUD operations
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'completed'>): number;
  updateTask(id: number, updates: Partial<Pick<Task, 'description' | 'priority' | 'tags'>>): boolean;
  deleteTask(id: number): boolean;
  getTask(id: number): Task | undefined;

  // Processing operations
  getNextTask(): Task | undefined;
  completeTask(id: number): boolean;
  processNextTask(): Task | undefined;

  // Search and filtering
  searchTasks(query: string): Task[];
  getTasksByPriority(priority: Priority): Task[];
  getTasksByTag(tag: string): Task[];
  getOverdueTasks(): Task[]; // Tasks older than 7 days

  // Statistics and reporting
  getStats(): TaskStats;
  getCompletionTrend(days: number): Array<{ date: string; completed: number }>;

  // Utility operations
  clearCompleted(): number; // Remove completed tasks, return count
  exportTasks(): Task[]; // Get all tasks for backup
  importTasks(tasks: Task[]): void; // Import tasks from backup
}
```

## 💻 Implementation Guide

### Step 1: Basic Data Structures

```typescript
class AdvancedTaskManager implements TaskManager {
  private tasks: Map<number, Task> = new Map();
  private priorityQueue: Task[] = []; // Sorted by priority (highest first)
  private completedTasks: Set<number> = new Set();
  private nextId = 1;

  // Implementation goes here...
}
```

### Step 2: Core Task Operations

```typescript
addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>): number {
  // Validate input
  if (!taskData.description?.trim()) {
    throw new Error("Task description is required");
  }

  if (taskData.priority < 1 || taskData.priority > 5) {
    throw new Error("Priority must be between 1 and 5");
  }

  // Create task
  const task: Task = {
    id: this.nextId++,
    description: taskData.description.trim(),
    priority: taskData.priority,
    createdAt: new Date(),
    completed: false,
    tags: taskData.tags || []
  };

  // Store task
  this.tasks.set(task.id, task);
  this.insertIntoPriorityQueue(task);

  return task.id;
}

private insertIntoPriorityQueue(task: Task): void {
  // Insert task in priority order (highest priority first)
  let inserted = false;
  for (let i = 0; i < this.priorityQueue.length; i++) {
    if (task.priority > this.priorityQueue[i].priority) {
      this.priorityQueue.splice(i, 0, task);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    this.priorityQueue.push(task);
  }
}
```

### Step 3: Processing Operations

```typescript
getNextTask(): Task | undefined {
  // Return highest priority incomplete task
  return this.priorityQueue.find(task => !task.completed);
}

completeTask(id: number): boolean {
  const task = this.tasks.get(id);
  if (!task || task.completed) {
    return false;
  }

  task.completed = true;
  task.completedAt = new Date();
  this.completedTasks.add(id);

  // Remove from priority queue (will be re-inserted if uncompleted later)
  const index = this.priorityQueue.findIndex(t => t.id === id);
  if (index !== -1) {
    this.priorityQueue.splice(index, 1);
  }

  return true;
}

processNextTask(): Task | undefined {
  const nextTask = this.getNextTask();
  if (nextTask) {
    this.completeTask(nextTask.id);
    return nextTask;
  }
  return undefined;
}
```

### Step 4: Search and Filtering

```typescript
searchTasks(query: string): Task[] {
  const lowercaseQuery = query.toLowerCase();
  const results: Task[] = [];

  for (const task of this.tasks.values()) {
    if (
      task.description.toLowerCase().includes(lowercaseQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    ) {
      results.push(task);
    }
  }

  return results;
}

getTasksByPriority(priority: Priority): Task[] {
  return Array.from(this.tasks.values()).filter(task => task.priority === priority);
}

getTasksByTag(tag: string): Task[] {
  return Array.from(this.tasks.values()).filter(task =>
    task.tags.some(taskTag => taskTag.toLowerCase() === tag.toLowerCase())
  );
}

getOverdueTasks(): Task[] {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return Array.from(this.tasks.values()).filter(task =>
    !task.completed && task.createdAt < oneWeekAgo
  );
}
```

### Step 5: Statistics and Reporting

```typescript
getStats(): TaskStats {
  const allTasks = Array.from(this.tasks.values());
  const completedTasks = allTasks.filter(task => task.completed);
  const pendingTasks = allTasks.filter(task => !task.completed);

  // Calculate average completion time
  const completionTimes = completedTasks
    .filter(task => task.completedAt)
    .map(task => task.completedAt!.getTime() - task.createdAt.getTime());

  const averageCompletionTime = completionTimes.length > 0
    ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
    : 0;

  const completionRate = allTasks.length > 0
    ? (completedTasks.length / allTasks.length) * 100
    : 0;

  return {
    total: allTasks.length,
    completed: completedTasks.length,
    pending: pendingTasks.length,
    averageCompletionTime,
    completionRate
  };
}

getCompletionTrend(days: number): Array<{ date: string; completed: number }> {
  const trend: Array<{ date: string; completed: number }> = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const completedOnDate = Array.from(this.tasks.values()).filter(task =>
      task.completed &&
      task.completedAt &&
      task.completedAt.toISOString().split('T')[0] === dateStr
    ).length;

    trend.push({ date: dateStr, completed: completedOnDate });
  }

  return trend;
}
```

## ✅ Comprehensive Test Suite

```typescript
function testTaskManager() {
  const manager = new AdvancedTaskManager();

  console.log("🧪 Testing Task Manager...");

  // Test adding tasks
  const task1Id = manager.addTask({
    description: "Write unit tests",
    priority: 3,
    tags: ["testing", "development"]
  });

  const task2Id = manager.addTask({
    description: "Fix critical bug",
    priority: 5,
    tags: ["bug", "urgent"]
  });

  const task3Id = manager.addTask({
    description: "Update documentation",
    priority: 2,
    tags: ["docs", "writing"]
  });

  console.assert(manager.getTask(task1Id)?.description === "Write unit tests");
  console.assert(manager.getTask(task2Id)?.priority === 5);

  // Test priority ordering
  const nextTask = manager.getNextTask();
  console.assert(nextTask?.id === task2Id, "Highest priority task should be next");

  // Test completion
  console.assert(manager.completeTask(task2Id) === true);
  console.assert(manager.completeTask(task2Id) === false, "Can't complete already completed task");

  // Test search
  const searchResults = manager.searchTasks("bug");
  console.assert(searchResults.length === 1);
  console.assert(searchResults[0].id === task2Id);

  const tagResults = manager.getTasksByTag("testing");
  console.assert(tagResults.length === 1);
  console.assert(tagResults[0].id === task1Id);

  // Test statistics
  const stats = manager.getStats();
  console.assert(stats.total === 3);
  console.assert(stats.completed === 1);
  console.assert(stats.pending === 2);
  console.assert(stats.completionRate === (1/3) * 100);

  // Test processing
  const processed = manager.processNextTask();
  console.assert(processed?.id === task1Id, "Should process highest remaining priority");

  // Test trend (basic check)
  const trend = manager.getCompletionTrend(7);
  console.assert(trend.length === 7, "Should return 7 days of data");
  console.assert(typeof trend[0].completed === 'number');

  console.log("✅ All TaskManager tests passed!");
  console.log("🎉 Task Manager implementation complete!");
}

// Run comprehensive tests
testTaskManager();
```

## 🚀 Extension Ideas

### Advanced Features
- **Due Dates**: Add deadline tracking and overdue notifications
- **Dependencies**: Tasks that depend on other tasks
- **Categories**: Group tasks by project or area
- **Time Tracking**: Track time spent on tasks
- **Recurring Tasks**: Automatically create repeating tasks

### Performance Optimizations
- **Indexing**: Add more efficient search indices
- **Caching**: Cache frequently accessed data
- **Pagination**: Handle large numbers of tasks efficiently
- **Database Integration**: Persist data to a real database

### User Interface
- **Web Interface**: Create a React/Vue frontend
- **CLI Tool**: Command-line interface for task management
- **Mobile App**: React Native or Flutter implementation
- **API**: RESTful API for integration with other tools

## 📊 Performance Analysis

### Time Complexity
- **addTask**: O(n) - priority queue insertion
- **getNextTask**: O(n) - scanning for incomplete tasks
- **completeTask**: O(n) - queue removal
- **searchTasks**: O(n) - linear search
- **getStats**: O(n) - scanning all tasks

### Space Complexity
- **tasks Map**: O(n) - all tasks
- **priorityQueue**: O(n) - all incomplete tasks
- **completedTasks Set**: O(n) - completed task IDs

### Optimization Opportunities
1. **Priority Queue**: Use a proper heap data structure (O(log n) operations)
2. **Search Index**: Build inverted index for tags and descriptions
3. **Completion Tracking**: Use a more efficient data structure

## 🎯 Learning Objectives

By completing this final project, you will demonstrate mastery of:

- ✅ **Multiple Data Structures**: Maps, Arrays, Sets, Queues
- ✅ **Algorithm Implementation**: Search, sorting, priority handling
- ✅ **System Design**: Planning and implementing complex systems
- ✅ **Error Handling**: Validation and meaningful error messages
- ✅ **Testing**: Comprehensive test coverage
- ✅ **Performance Analysis**: Understanding and optimizing efficiency

## 🏆 Achievement Unlocked!

Completing this Task Manager System means you have successfully:

1. **Integrated Multiple Concepts**: Combined data structures and algorithms
2. **Built a Complete System**: From design to implementation to testing
3. **Applied Best Practices**: Error handling, documentation, testing
4. **Created Something Useful**: A practical task management tool

**Congratulations! You are now proficient in algorithms and data structures!** 🎉

## 📚 Next Steps

- **Deploy It**: Host your task manager as a web application
- **Add Features**: Implement the extension ideas
- **Open Source**: Share your implementation on GitHub
- **Teach Others**: Help others learn by explaining your code
- **Build More**: Create other systems using what you've learned

---

**Ready to start coding?** Implement the TaskManager class and bring this comprehensive system to life! 🚀</content>
<parameter name="filePath">/Users/macbookpro/GUSKI/Algorithms_and_Datastructures/algorithms-tutorial/exercises/03-final-project.md
