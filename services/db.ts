
import { Todo, UserRecord } from '../types';

const DB_NAME = 'SmartTaskDB';
const DB_VERSION = 1;

export class SmartTaskDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Fix: During onupgradeneeded, use the store returned by createObjectStore directly.
        // Attempting to access db.transaction fails because it is a method on IDBDatabase, not an object.
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          // Add index for email lookup
          userStore.createIndex('email', 'email', { unique: true });
        }
        if (!db.objectStoreNames.contains('todos')) {
          const todoStore = db.createObjectStore('todos', { keyPath: 'id' });
          todoStore.createIndex('userId', 'userId', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
    });
  }

  private getStore(name: 'users' | 'todos', mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(name, mode);
    return transaction.objectStore(name);
  }

  // Generic CRUD
  async put<T>(storeName: 'users' | 'todos', data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: 'users' | 'todos', key: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getByEmail(email: string): Promise<UserRecord | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('users');
      const index = store.index('email');
      const request = index.get(email);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getTodosByUser(userId: string): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('todos');
      const index = store.index('userId');
      const request = index.getAll(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: 'users' | 'todos', key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new SmartTaskDB();
