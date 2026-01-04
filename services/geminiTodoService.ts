
import { GoogleGenAI, Type } from "@google/genai";
import { ITodoService, Todo, Priority } from '../types';
import { db } from './db';

export class GeminiTodoService implements ITodoService {
  // Client instance should be created right before use to ensure the latest API key is used.

  async getTodos(userId: string): Promise<Todo[]> {
    await new Promise(r => setTimeout(r, 600));
    return db.getTodosByUser(userId);
  }

  async addTodo(userId: string, text: string): Promise<Todo> {
    // Always use process.env.API_KEY directly and initialize right before making a call.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this task and return a JSON object with priority (low, medium, high) and a short category name: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
            category: { type: Type.STRING }
          },
          required: ['priority', 'category']
        }
      }
    });

    const metadata = JSON.parse(response.text || '{"priority":"medium", "category":"General"}');
    
    const newTodo: Todo = {
      id: `ai_${Math.random().toString(36).substring(7)}`,
      userId,
      text,
      completed: false,
      category: metadata.category || 'General',
      priority: (metadata.priority as Priority) || 'medium',
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
