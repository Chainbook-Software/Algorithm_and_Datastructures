/**
 * Complete Task Manager System
 *
 * A comprehensive task management system that combines multiple data structures
 * and algorithms to provide efficient task management with priority handling,
 * search capabilities, and statistics tracking.
 */

import { PriorityQueue } from '../../datastructures/queue';
import { HashTable } from '../../datastructures/hashTable';
import { BinarySearchTree } from '../../datastructures/binarySearchTree';

// Task and system interfaces
export interface Task {
  id: number;
  description: string;
  priority: Priority;
  createdAt: Date;
  completed: boolean;
  completedAt?: Date;
  tags: string[];
  dueDate?: Date;
  assignee?: string;
  estimatedHours?: number;
}

export type Priority = 1 | 2 | 3 | 4 | 5;

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  averageCompletionTime: number;
  completionRate: number;
  priorityDistribution: Record<Priority, number>;
  tagUsage: Record<string, number>;
}

export interface TaskManager {
  // Core CRUD operations
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'completed'>): number;
  updateTask(id: number, updates: Partial<Pick<Task, 'description' | 'priority' | 'tags' | 'dueDate' | 'assignee' | 'estimatedHours'>>): boolean;
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
  getTasksByAssignee(assignee: string): Task[];
  getOverdueTasks(): Task[];
  getTasksDueSoon(days: number): Task[];

  // Statistics and reporting
  getStats(): TaskStats;
  getCompletionTrend(days: number): Array<{ date: string; completed: number }>;
  getProductivityReport(startDate: Date, endDate: Date): {
    tasksCompleted: number;
    averageCompletionTime: number;
    mostProductiveDay: string;
    priorityCompletionRates: Record<Priority, number>;
  };

  // Utility operations
  clearCompleted(): number;
  exportTasks(): Task[];
  importTasks(tasks: Task[]): void;
  bulkUpdate(ids: number[], updates: Partial<Pick<Task, 'priority' | 'assignee' | 'tags'>>): number;
}

// Main Task Manager Implementation
export class AdvancedTaskManager implements TaskManager {
  private tasks: HashTable<number, Task> = new HashTable();
  private priorityQueue: PriorityQueue<Task> = new PriorityQueue();
  private tagIndex: HashTable<string, number[]> = new HashTable();
  private assigneeIndex: HashTable<string, number[]> = new HashTable();
  private completedTasks: Set<number> = new Set();
  private nextId = 1;

  // Core CRUD operations
  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>): number {
    this.validateTaskData(taskData);

    const task: Task = {
      id: this.nextId++,
      description: taskData.description.trim(),
      priority: taskData.priority,
      createdAt: new Date(),
      completed: false,
      tags: taskData.tags || [],
      dueDate: taskData.dueDate,
      assignee: taskData.assignee,
      estimatedHours: taskData.estimatedHours
    };

    this.tasks.set(task.id, task);

    // Add to priority queue if not completed
    if (!task.completed) {
      this.priorityQueue.enqueue(task, task.priority);
    }

    // Update indices
    this.updateIndices(task);

    return task.id;
  }

  updateTask(id: number, updates: Partial<Pick<Task, 'description' | 'priority' | 'tags' | 'dueDate' | 'assignee' | 'estimatedHours'>>): boolean {
    const task = this.tasks.get(id);
    if (!task) return false;

    const oldTask = { ...task };

    // Validate updates
    if (updates.description !== undefined && !updates.description.trim()) {
      throw new Error("Task description cannot be empty");
    }

    if (updates.priority !== undefined && (updates.priority < 1 || updates.priority > 5)) {
      throw new Error("Priority must be between 1 and 5");
    }

    // Apply updates
    if (updates.description !== undefined) {
      task.description = updates.description.trim();
    }

    if (updates.priority !== undefined) {
      task.priority = updates.priority;
      // Re-queue if not completed
      if (!task.completed) {
        this.rebuildPriorityQueue();
      }
    }

    if (updates.tags !== undefined) {
      task.tags = updates.tags;
      this.updateTagIndex(task, oldTask.tags);
    }

    if (updates.dueDate !== undefined) {
      task.dueDate = updates.dueDate;
    }

    if (updates.assignee !== undefined) {
      task.assignee = updates.assignee;
      this.updateAssigneeIndex(task, oldTask.assignee);
    }

    if (updates.estimatedHours !== undefined) {
      task.estimatedHours = updates.estimatedHours;
    }

    return true;
  }

  deleteTask(id: number): boolean {
    const task = this.tasks.get(id);
    if (!task) return false;

    this.tasks.delete(id);
    this.completedTasks.delete(id);

    // Remove from indices
    this.removeFromIndices(task);

    // Rebuild priority queue
    this.rebuildPriorityQueue();

    return true;
  }

  getTask(id: number): Task | undefined {
    return this.tasks.get(id);
  }

  // Processing operations
  getNextTask(): Task | undefined {
    // Find highest priority incomplete task
    const allTasks = this.tasks.values();
    let highestPriorityTask: Task | undefined;

    for (const task of allTasks) {
      if (!task.completed &&
          (!highestPriorityTask || task.priority > highestPriorityTask.priority)) {
        highestPriorityTask = task;
      }
    }

    return highestPriorityTask;
  }

  completeTask(id: number): boolean {
    const task = this.tasks.get(id);
    if (!task || task.completed) return false;

    task.completed = true;
    task.completedAt = new Date();
    this.completedTasks.add(id);

    // Rebuild priority queue to exclude completed tasks
    this.rebuildPriorityQueue();

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

  // Search and filtering
  searchTasks(query: string): Task[] {
    if (!query.trim()) return [];

    const lowercaseQuery = query.toLowerCase();
    const results: Task[] = [];

    for (const task of this.tasks.values()) {
      if (
        task.description.toLowerCase().includes(lowercaseQuery) ||
        task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        (task.assignee && task.assignee.toLowerCase().includes(lowercaseQuery))
      ) {
        results.push(task);
      }
    }

    return results;
  }

  getTasksByPriority(priority: Priority): Task[] {
    return (this.tasks.values() as Task[]).filter(task => task.priority === priority);
  }

  getTasksByTag(tag: string): Task[] {
    const lowercaseTag = tag.toLowerCase();
    const taskIds = this.tagIndex.get(lowercaseTag) || [];
    return taskIds.map(id => this.tasks.get(id)!).filter(Boolean) as Task[];
  }

  getTasksByAssignee(assignee: string): Task[] {
    const lowercaseAssignee = assignee.toLowerCase();
    const taskIds = this.assigneeIndex.get(lowercaseAssignee) || [];
    return taskIds.map(id => this.tasks.get(id)!).filter(Boolean) as Task[];
  }

  getOverdueTasks(): Task[] {
    const now = new Date();
    return (this.tasks.values() as Task[]).filter(task =>
      !task.completed && task.dueDate && task.dueDate < now
    );
  }

  getTasksDueSoon(days: number): Task[] {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return (this.tasks.values() as Task[]).filter(task =>
      !task.completed && task.dueDate &&
      task.dueDate > now && task.dueDate <= futureDate
    );
  }

  // Statistics and reporting
  getStats(): TaskStats {
    const allTasks = this.tasks.values() as Task[];
    const completedTasks = allTasks.filter(task => task.completed);
    const pendingTasks = allTasks.filter(task => !task.completed);
    const overdueTasks = this.getOverdueTasks();

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

    // Priority distribution
    const priorityDistribution: Record<Priority, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allTasks.forEach(task => {
      priorityDistribution[task.priority]++;
    });

    // Tag usage
    const tagUsage: Record<string, number> = {};
    allTasks.forEach(task => {
      task.tags.forEach(tag => {
        tagUsage[tag] = (tagUsage[tag] || 0) + 1;
      });
    });

    return {
      total: allTasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      overdue: overdueTasks.length,
      averageCompletionTime,
      completionRate,
      priorityDistribution,
      tagUsage
    };
  }

  getCompletionTrend(days: number): Array<{ date: string; completed: number }> {
    if (days <= 0) throw new Error("Days must be positive");

    const trend: Array<{ date: string; completed: number }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const completedOnDate = (this.tasks.values() as Task[]).filter(task =>
        task.completed &&
        task.completedAt &&
        task.completedAt.toISOString().split('T')[0] === dateStr
      ).length;

      trend.push({ date: dateStr, completed: completedOnDate });
    }

    return trend;
  }

  getProductivityReport(startDate: Date, endDate: Date): {
    tasksCompleted: number;
    averageCompletionTime: number;
    mostProductiveDay: string;
    priorityCompletionRates: Record<Priority, number>;
  } {
    const completedTasks = (this.tasks.values() as Task[]).filter(task =>
      task.completed && task.completedAt &&
      task.completedAt >= startDate && task.completedAt <= endDate
    );

    const tasksCompleted = completedTasks.length;

    const completionTimes = completedTasks.map(task =>
      task.completedAt!.getTime() - task.createdAt.getTime()
    );

    const averageCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
      : 0;

    // Find most productive day
    const dailyCounts: Record<string, number> = {};
    completedTasks.forEach(task => {
      const dateStr = task.completedAt!.toISOString().split('T')[0];
      dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
    });

    const mostProductiveDay = Object.entries(dailyCounts)
      .reduce((max, [date, count]) => count > max.count ? { date, count } : max,
              { date: '', count: 0 }).date;

    // Priority completion rates
    const priorityCompletionRates: Record<Priority, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const totalByPriority: Record<Priority, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    (this.tasks.values() as Task[]).forEach(task => {
      totalByPriority[task.priority]++;
      if (task.completed && task.completedAt &&
          task.completedAt >= startDate && task.completedAt <= endDate) {
        priorityCompletionRates[task.priority]++;
      }
    });

    Object.keys(priorityCompletionRates).forEach(priority => {
      const p = parseInt(priority) as Priority;
      priorityCompletionRates[p] = totalByPriority[p] > 0
        ? (priorityCompletionRates[p] / totalByPriority[p]) * 100
        : 0;
    });

    return {
      tasksCompleted,
      averageCompletionTime,
      mostProductiveDay,
      priorityCompletionRates
    };
  }

  // Utility operations
  clearCompleted(): number {
    const completedIds = Array.from(this.completedTasks);
    completedIds.forEach(id => {
      const task = this.tasks.get(id);
      if (task) {
        this.removeFromIndices(task);
        this.tasks.delete(id);
      }
    });
    this.completedTasks.clear();
    return completedIds.length;
  }

  exportTasks(): Task[] {
    return this.tasks.values() as Task[];
  }

  importTasks(tasks: Task[]): void {
    if (!Array.isArray(tasks)) {
      throw new Error("Tasks must be an array");
    }

    // Validate all tasks before importing
    tasks.forEach(task => this.validateImportedTask(task));

    // Clear existing data
    this.tasks.clear();
    this.tagIndex.clear();
    this.assigneeIndex.clear();
    this.completedTasks.clear();
    this.nextId = 1;

    // Import tasks
    tasks.forEach(task => {
      this.tasks.set(task.id, task);
      if (task.completed) {
        this.completedTasks.add(task.id);
      }
      this.updateIndices(task);
      if (task.id >= this.nextId) {
        this.nextId = task.id + 1;
      }
    });

    // Rebuild priority queue
    this.rebuildPriorityQueue();
  }

  bulkUpdate(ids: number[], updates: Partial<Pick<Task, 'priority' | 'assignee' | 'tags'>>): number {
    let updatedCount = 0;

    ids.forEach(id => {
      if (this.updateTask(id, updates)) {
        updatedCount++;
      }
    });

    return updatedCount;
  }

  // Private helper methods
  private validateTaskData(taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>): void {
    if (!taskData.description || !taskData.description.trim()) {
      throw new Error("Task description is required");
    }

    if (taskData.priority < 1 || taskData.priority > 5) {
      throw new Error("Priority must be between 1 and 5");
    }

    if (taskData.tags && !Array.isArray(taskData.tags)) {
      throw new Error("Tags must be an array of strings");
    }

    if (taskData.dueDate && !(taskData.dueDate instanceof Date)) {
      throw new Error("Due date must be a valid Date object");
    }

    if (taskData.estimatedHours !== undefined &&
        (typeof taskData.estimatedHours !== 'number' || taskData.estimatedHours < 0)) {
      throw new Error("Estimated hours must be a non-negative number");
    }
  }

  private validateImportedTask(task: Task): void {
    if (typeof task.id !== 'number' || task.id <= 0) {
      throw new Error("Task ID must be a positive number");
    }

    if (!task.description || typeof task.description !== 'string') {
      throw new Error("Task description is required and must be a string");
    }

    if (task.priority < 1 || task.priority > 5) {
      throw new Error("Priority must be between 1 and 5");
    }

    if (typeof task.completed !== 'boolean') {
      throw new Error("Completed status must be a boolean");
    }

    if (!Array.isArray(task.tags)) {
      throw new Error("Tags must be an array");
    }

    if (!(task.createdAt instanceof Date)) {
      throw new Error("Created date must be a valid Date object");
    }

    if (task.completedAt && !(task.completedAt instanceof Date)) {
      throw new Error("Completed date must be a valid Date object");
    }
  }

  private updateIndices(task: Task): void {
    // Update tag index
    task.tags.forEach(tag => {
      const lowercaseTag = tag.toLowerCase();
      const existing = this.tagIndex.get(lowercaseTag) || [];
      if (!existing.includes(task.id)) {
        existing.push(task.id);
        this.tagIndex.set(lowercaseTag, existing);
      }
    });

    // Update assignee index
    if (task.assignee) {
      const lowercaseAssignee = task.assignee.toLowerCase();
      const existing = this.assigneeIndex.get(lowercaseAssignee) || [];
      if (!existing.includes(task.id)) {
        existing.push(task.id);
        this.assigneeIndex.set(lowercaseAssignee, existing);
      }
    }
  }

  private updateTagIndex(task: Task, oldTags: string[]): void {
    // Remove from old tags
    oldTags.forEach(tag => {
      const lowercaseTag = tag.toLowerCase();
      const existing = this.tagIndex.get(lowercaseTag) || [];
      const filtered = existing.filter(id => id !== task.id);
      if (filtered.length > 0) {
        this.tagIndex.set(lowercaseTag, filtered);
      } else {
        this.tagIndex.delete(lowercaseTag);
      }
    });

    // Add to new tags
    task.tags.forEach(tag => {
      const lowercaseTag = tag.toLowerCase();
      const existing = this.tagIndex.get(lowercaseTag) || [];
      if (!existing.includes(task.id)) {
        existing.push(task.id);
        this.tagIndex.set(lowercaseTag, existing);
      }
    });
  }

  private updateAssigneeIndex(task: Task, oldAssignee?: string): void {
    // Remove from old assignee
    if (oldAssignee) {
      const lowercaseAssignee = oldAssignee.toLowerCase();
      const existing = this.assigneeIndex.get(lowercaseAssignee) || [];
      const filtered = existing.filter(id => id !== task.id);
      if (filtered.length > 0) {
        this.assigneeIndex.set(lowercaseAssignee, filtered);
      } else {
        this.assigneeIndex.delete(lowercaseAssignee);
      }
    }

    // Add to new assignee
    if (task.assignee) {
      const lowercaseAssignee = task.assignee.toLowerCase();
      const existing = this.assigneeIndex.get(lowercaseAssignee) || [];
      if (!existing.includes(task.id)) {
        existing.push(task.id);
        this.assigneeIndex.set(lowercaseAssignee, existing);
      }
    }
  }

  private removeFromIndices(task: Task): void {
    // Remove from tag index
    task.tags.forEach(tag => {
      const lowercaseTag = tag.toLowerCase();
      const existing = this.tagIndex.get(lowercaseTag) || [];
      const filtered = existing.filter(id => id !== task.id);
      if (filtered.length > 0) {
        this.tagIndex.set(lowercaseTag, filtered);
      } else {
        this.tagIndex.delete(lowercaseTag);
      }
    });

    // Remove from assignee index
    if (task.assignee) {
      const lowercaseAssignee = task.assignee.toLowerCase();
      const existing = this.assigneeIndex.get(lowercaseAssignee) || [];
      const filtered = existing.filter(id => id !== task.id);
      if (filtered.length > 0) {
        this.assigneeIndex.set(lowercaseAssignee, filtered);
      } else {
        this.assigneeIndex.delete(lowercaseAssignee);
      }
    }
  }

  private rebuildPriorityQueue(): void {
    // Clear and rebuild priority queue with only incomplete tasks
    this.priorityQueue = new PriorityQueue();

    for (const task of this.tasks.values()) {
      if (!task.completed) {
        this.priorityQueue.enqueue(task, task.priority);
      }
    }
  }
}

// Factory function for creating task managers
export function createTaskManager(): TaskManager {
  return new AdvancedTaskManager();
}

// Utility functions for task analysis
export class TaskAnalytics {
  static calculateEfficiency(tasks: Task[]): {
    completionRate: number;
    averageTimeToComplete: number;
    bottleneckPriorities: Priority[];
    peakProductivityHours: number[];
  } {
    const completedTasks = tasks.filter(task => task.completed && task.completedAt);

    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

    const completionTimes = completedTasks.map(task =>
      task.completedAt!.getTime() - task.createdAt.getTime()
    );

    const averageTimeToComplete = completionTimes.length > 0
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
      : 0;

    // Find bottleneck priorities (lowest completion rates)
    const priorityStats: Record<Priority, { total: number; completed: number }> = {
      1: { total: 0, completed: 0 },
      2: { total: 0, completed: 0 },
      3: { total: 0, completed: 0 },
      4: { total: 0, completed: 0 },
      5: { total: 0, completed: 0 }
    };

    tasks.forEach(task => {
      priorityStats[task.priority].total++;
      if (task.completed) {
        priorityStats[task.priority].completed++;
      }
    });

    const bottleneckPriorities = Object.entries(priorityStats)
      .filter(([, stats]) => stats.total > 0)
      .map(([priority, stats]) => ({
        priority: parseInt(priority) as Priority,
        rate: stats.completed / stats.total
      }))
      .sort((a, b) => a.rate - b.rate)
      .slice(0, 2)
      .map(item => item.priority);

    // Find peak productivity hours
    const hourlyStats: number[] = new Array(24).fill(0);
    completedTasks.forEach(task => {
      if (task.completedAt) {
        const hour = task.completedAt.getHours();
        hourlyStats[hour]++;
      }
    });

    const maxCompletions = Math.max(...hourlyStats);
    const peakProductivityHours = hourlyStats
      .map((count, hour) => ({ hour, count }))
      .filter(item => item.count === maxCompletions)
      .map(item => item.hour);

    return {
      completionRate,
      averageTimeToComplete,
      bottleneckPriorities,
      peakProductivityHours
    };
  }

  static generateWorkloadReport(tasks: Task[], assignees: string[]): {
    assigneeWorkload: Record<string, { total: number; completed: number; pending: number }>;
    overallUtilization: number;
    recommendations: string[];
  } {
    const assigneeWorkload: Record<string, { total: number; completed: number; pending: number }> = {};

    assignees.forEach(assignee => {
      assigneeWorkload[assignee] = { total: 0, completed: 0, pending: 0 };
    });

    tasks.forEach(task => {
      if (task.assignee) {
        assigneeWorkload[task.assignee].total++;
        if (task.completed) {
          assigneeWorkload[task.assignee].completed++;
        } else {
          assigneeWorkload[task.assignee].pending++;
        }
      }
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const overallUtilization = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const recommendations: string[] = [];

    // Generate recommendations based on workload analysis
    Object.entries(assigneeWorkload).forEach(([assignee, workload]) => {
      if (workload.pending > workload.completed * 2) {
        recommendations.push(`${assignee} has a high pending task ratio. Consider redistributing tasks.`);
      }
      if (workload.total === 0) {
        recommendations.push(`${assignee} has no assigned tasks. Consider assigning work.`);
      }
    });

    if (overallUtilization < 50) {
      recommendations.push('Overall team utilization is low. Consider taking on more tasks or improving processes.');
    }

    return {
      assigneeWorkload,
      overallUtilization,
      recommendations
    };
  }
}
