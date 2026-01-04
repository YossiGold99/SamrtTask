
import { ITodoService, Todo, Priority } from '../types';
import { db } from './db';

export class MockTodoService implements ITodoService {
  async getTodos(userId: string): Promise<Todo[]> {
    await new Promise(r => setTimeout(r, 300));
    return db.getTodosByUser(userId);
  }

  async addTodo(userId: string, text: string): Promise<Todo> {
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(7),
      userId,
      text,
      completed: false,
      category: 'General',
      priority: 'medium',
      createdAt: Date.now(),
    };
    await db.put('todos', newTodo);
    return newTodo;
  }

  async toggleTodo(id: string): Promise<Todo> {
    const todo = await db.get<Todo>('todos', id);
    if (!todo) throw new Error('Todo not found');
    
    todo.completed = !todo.completed;
    await db.put('todos', todo);
    return todo;
  }

  async deleteTodo(id: string): Promise<void> {
    await db.delete('todos', id);
  }

  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const todo = await db.get<Todo>('todos', id);
    if (!todo) throw new Error('Todo not found');
    
    const updated = { ...todo, ...updates };
    await db.put('todos', updated);
    return updated;
  }
}
