import { Request, Response } from 'express';
import { CreateTaskUseCase } from '../../application/use-cases/task/CreateTaskUseCase';
import { GetTasksUseCase } from '../../application/use-cases/task/GetTasksUseCase';
import { GetTaskByIdUseCase } from '../../application/use-cases/task/GetTaskByIdUseCase';
import { UpdateTaskUseCase } from '../../application/use-cases/task/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../application/use-cases/task/DeleteTaskUseCase';
import { FirebaseTaskRepository } from '../repositories/FirebaseTaskRepository';
import { TaskFilters } from '../../domain/entities/Task';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
  };
}

// Función para serializar fechas correctamente
function serializeTask(task: any) {
  return {
    ...task,
    createdAt: task.createdAt instanceof Date ? task.createdAt.toISOString() : task.createdAt,
    updatedAt: task.updatedAt instanceof Date ? task.updatedAt.toISOString() : task.updatedAt
  };
}

export class TaskController {
  private createTaskUseCase: CreateTaskUseCase;
  private getTasksUseCase: GetTasksUseCase;
  private getTaskByIdUseCase: GetTaskByIdUseCase;
  private updateTaskUseCase: UpdateTaskUseCase;
  private deleteTaskUseCase: DeleteTaskUseCase;

  constructor() {
    const taskRepository = new FirebaseTaskRepository();
    this.createTaskUseCase = new CreateTaskUseCase(taskRepository);
    this.getTasksUseCase = new GetTasksUseCase(taskRepository);
    this.getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
    this.updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
    this.deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
  }

  async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;
      const userId = req.user?.uid || 'anonymous';

      if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      const task = await this.createTaskUseCase.execute({
        title,
        description: description || '',
        completed: false,
        userId
      });

      res.status(201).json(serializeTask(task));
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid || 'anonymous';
      
      // Extraer filtros de los parámetros de query
      const filters: TaskFilters = {};
      
      if (req.query.dateOrder && (req.query.dateOrder === 'asc' || req.query.dateOrder === 'desc')) {
        filters.dateOrder = req.query.dateOrder;
      }
      
      if (req.query.statusFilter && (req.query.statusFilter === 'all' || req.query.statusFilter === 'completed' || req.query.statusFilter === 'pending')) {
        filters.statusFilter = req.query.statusFilter;
      }
      
      if (req.query.searchTerm && typeof req.query.searchTerm === 'string') {
        filters.searchTerm = req.query.searchTerm;
      }

      // Agregar parámetros de paginación
      if (req.query.limit && typeof req.query.limit === 'string') {
        const limit = parseInt(req.query.limit);
        if (!isNaN(limit) && limit > 0 && limit <= 100) {
          filters.limit = limit;
        }
      }

      if (req.query.page && typeof req.query.page === 'string') {
        const page = parseInt(req.query.page);
        if (!isNaN(page) && page > 0) {
          filters.page = page;
        }
      }

      const tasks = await this.getTasksUseCase.execute(userId, Object.keys(filters).length > 0 ? filters : undefined);
      
      // Serializar las fechas antes de enviar la respuesta
      const serializedTasks = tasks.map(serializeTask);
      res.status(200).json(serializedTasks);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.getTaskByIdUseCase.execute(id);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(serializeTask(task));
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (completed !== undefined) updateData.completed = completed;

      const task = await this.updateTaskUseCase.execute(id, updateData);
      res.status(200).json(serializeTask(task));
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Task not found') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteTaskUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Task not found') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 