import { Task } from '../../../domain/entities/Task';
import { TaskRepository } from '../../../domain/ports/TaskRepository';

export class GetTaskByIdUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }
} 