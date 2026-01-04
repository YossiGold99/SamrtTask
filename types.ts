
export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  category: string;
  priority: Priority;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserRecord extends User {
  passwordHash: string;
}

export enum BackendType {
  MOCK = 'MOCK',
  REAL = 'REAL'
}

export interface ITodoService {
  getTodos(userId: string): Promise<Todo[]>;
  addTodo(userId: string, text: string): Promise<Todo>;
  toggleTodo(id: string): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
  updateTodo(id: string, updates: Partial<Todo>): Promise<Todo>;
}
