import { Task, TaskFilters } from '../entities/Task';

export interface TaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string, filters?: TaskFilters): Promise<Task[]>;
  update(id: string, task: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
} 