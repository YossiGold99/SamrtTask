
import { db } from './db';
import { User, UserRecord } from '../types';

export class UserService {
  // Simple "hash" for demo purposes
  private hashPassword(password: string): string {
    return btoa(password).split('').reverse().join('');
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const existing = await db.getByEmail(email);
    if (existing) throw new Error('Email already registered');

    const user: UserRecord = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      passwordHash: this.hashPassword(password)
    };

    await db.put('users', user);
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await db.getByEmail(email);
    if (!user) throw new Error('User not found');

    if (user.passwordHash !== this.hashPassword(password)) {
      throw new Error('Invalid credentials');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async seedDemoUser(): Promise<void> {
    const demoEmail = 'demo@example.com';
    const existing = await db.getByEmail(demoEmail);
    if (!existing) {
      await this.register('Demo User', demoEmail, 'password');
    }
  }
}

export const userService = new UserService();
