import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

export class FirestoreService {
  private collection: string;

  constructor(collectionName: string) {
    this.collection = collectionName;
  }

  async create<T extends { id?: string }>(data: T): Promise<T> {
    const docRef = data.id 
      ? db.collection(this.collection).doc(data.id)
      : db.collection(this.collection).doc();
    
    const newData = {
      ...data,
      id: docRef.id,
      createdAt: new Date()
    };

    await docRef.set(newData);
    return newData as T;
  }

  async findById<T>(id: string): Promise<T | null> {
    const doc = await db.collection(this.collection).doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data()
    } as T;
  }

  async findByField<T>(field: string, value: any): Promise<T[]> {
    const snapshot = await db
      .collection(this.collection)
      .where(field, '==', value)
      .get();

    const results: T[] = [];
    snapshot.docs.forEach((docSnapshot) => {
      results.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as T);
    });

    return results;
  }

  async update<T>(id: string, data: Partial<T>): Promise<T> {
    const docRef = db.collection(this.collection).doc(id);
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as T;
  }

  async delete(id: string): Promise<void> {
    await db.collection(this.collection).doc(id).delete();
  }

  async list<T>(limit = 10, startAfter?: any): Promise<T[]> {
    let query = db.collection(this.collection).limit(limit);

    if (startAfter) {
      query = query.startAfter(startAfter);
    }

    const snapshot = await query.get();
    const results: T[] = [];
    
    snapshot.docs.forEach((docSnapshot) => {
      results.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as T);
    });

    return results;
  }

  async query<T>(conditions: { field: string; operator: string; value: any }[]): Promise<T[]> {
    let query: admin.firestore.Query = db.collection(this.collection);

    conditions.forEach(condition => {
      query = query.where(condition.field, condition.operator as any, condition.value);
    });

    const snapshot = await query.get();
    const results: T[] = [];
    
    snapshot.docs.forEach((docSnapshot) => {
      results.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as T);
    });

    return results;
  }

  async queryWithOptions<T>(options: {
    conditions?: { field: string; operator: admin.firestore.WhereFilterOp; value: any }[];
    orderBy?: { field: string; direction: admin.firestore.OrderByDirection };
    limit?: number;
    startAfter?: any;
  }): Promise<{ data: T[]; lastDoc?: any }> {
    let query: admin.firestore.Query = db.collection(this.collection);

    // Aplicar condiciones de filtro
    if (options.conditions) {
      options.conditions.forEach(condition => {
        query = query.where(condition.field, condition.operator, condition.value);
      });
    }

    // Aplicar ordenamiento
    if (options.orderBy) {
      query = query.orderBy(options.orderBy.field, options.orderBy.direction);
    }

    // Aplicar límite
    if (options.limit) {
      query = query.limit(options.limit);
    }

    // Aplicar paginación
    if (options.startAfter) {
      query = query.startAfter(options.startAfter);
    }

    const snapshot = await query.get();
    const data: T[] = [];
    
    snapshot.docs.forEach((docSnapshot) => {
      data.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as T);
    });
    
    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined;

    return { data, lastDoc };
  }
} 