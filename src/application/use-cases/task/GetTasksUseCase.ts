import { Task, TaskFilters } from '../../../domain/entities/Task';
import { TaskRepository } from '../../../domain/ports/TaskRepository';

export class GetTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(userId: string, filters?: TaskFilters): Promise<Task[]> {
    return await this.taskRepository.findByUserId(userId, filters);
  }
} 