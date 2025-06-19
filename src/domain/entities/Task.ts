export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
}

export class TaskEntity implements Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  userId: string;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.completed = task.completed;
    this.createdAt = task.createdAt;
    this.userId = task.userId;
  }

  static create(task: Omit<Task, 'id' | 'createdAt'>): TaskEntity {
    return new TaskEntity({
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date()
    });
  }
}

export interface TaskFilters {
  dateOrder?: 'asc' | 'desc';
  statusFilter?: 'all' | 'completed' | 'pending';
  searchTerm?: string;
  limit?: number;
  page?: number;
} 