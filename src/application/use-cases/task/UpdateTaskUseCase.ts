import { Task } from '../../../domain/entities/Task';
import { TaskRepository } from '../../../domain/ports/TaskRepository';

export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string, taskData: Partial<Task>): Promise<Task> {
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    return await this.taskRepository.update(id, taskData);
  }
} 