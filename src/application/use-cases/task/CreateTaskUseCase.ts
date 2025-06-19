import { Task, TaskEntity } from '../../../domain/entities/Task';
import { TaskRepository } from '../../../domain/ports/TaskRepository';

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const task = TaskEntity.create(taskData);
    return await this.taskRepository.create(task);
  }
} 