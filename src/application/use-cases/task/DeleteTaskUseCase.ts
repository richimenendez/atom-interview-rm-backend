import { TaskRepository } from '../../../domain/ports/TaskRepository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    await this.taskRepository.delete(id);
  }
} 