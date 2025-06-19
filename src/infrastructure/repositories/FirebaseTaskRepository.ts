import { Task, TaskFilters } from '../../domain/entities/Task';
import { TaskRepository } from '../../domain/ports/TaskRepository';
import { FirestoreService } from '../services/FirestoreService';
import * as admin from 'firebase-admin';

export class FirebaseTaskRepository implements TaskRepository {
  private firestoreService: FirestoreService;

  constructor() {
    this.firestoreService = new FirestoreService('tasks');
  }

  async create(task: Task): Promise<Task> {
    return await this.firestoreService.create<Task>(task);
  }

  async findById(id: string): Promise<Task | null> {
    return await this.firestoreService.findById<Task>(id);
  }

  async findByUserId(userId: string, filters?: TaskFilters): Promise<Task[]> {
    // Construir condiciones para Firestore
    const conditions: { field: string; operator: admin.firestore.WhereFilterOp; value: any }[] = [
      { field: 'userId', operator: '==', value: userId }
    ];
    if (filters?.statusFilter && filters.statusFilter !== 'all') {
      const isCompleted = filters.statusFilter === 'completed';
      conditions.push({ field: 'completed', operator: '==', value: isCompleted });
    }

    // Si hay searchTerm, traer más tareas para filtrar y paginar en memoria
    const pageSize = filters?.limit && filters.limit > 0 ? filters.limit : 50;
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const fetchLimit = filters?.searchTerm ? 500 : page * pageSize;

    // Opciones de la query
    const options: any = {
      conditions,
      orderBy: {
        field: 'createdAt',
        direction: (filters?.dateOrder || 'desc') as admin.firestore.OrderByDirection
      },
      limit: fetchLimit
    };

    // Obtener datos de Firestore
    const result = await this.firestoreService.queryWithOptions<Task>(options);
    let tasks = result.data;

    // Convertir fechas Firestore Timestamp a Date
    tasks = tasks.map(task => {
      let createdAt = task.createdAt;
      if (createdAt && typeof createdAt === 'object' && '_seconds' in createdAt) {
        createdAt = new Date((createdAt as any)._seconds * 1000);
      } else if (typeof createdAt === 'string' || typeof createdAt === 'number') {
        createdAt = new Date(createdAt);
      }
      return {
        ...task,
        createdAt
      };
    });

    // Búsqueda de texto en memoria
    if (filters?.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      tasks = tasks.filter(task =>
        (task.title && task.title.toLowerCase().includes(searchTerm)) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }

    // Paginación en memoria (si hay searchTerm, siempre; si no, solo si page > 1)
    const startIndex = (page - 1) * pageSize;
    tasks = tasks.slice(startIndex, startIndex + pageSize);

    return tasks;
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    return await this.firestoreService.update<Task>(id, task);
  }

  async delete(id: string): Promise<void> {
    await this.firestoreService.delete(id);
  }
} 
