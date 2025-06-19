import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';
import { FirestoreService } from '../services/FirestoreService';

export class FirebaseUserRepository implements UserRepository {
  private firestoreService: FirestoreService;

  constructor() {
    this.firestoreService = new FirestoreService('users');
  }

  async create(user: User): Promise<User> {
    return await this.firestoreService.create<User>(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.firestoreService.findByField<User>('email', email);
    return users.length > 0 ? users[0] : null;
  }

  async findById(id: string): Promise<User | null> {
    return await this.firestoreService.findById<User>(id);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    return await this.firestoreService.update<User>(id, user);
  }

  async delete(id: string): Promise<void> {
    await this.firestoreService.delete(id);
  }
} 