import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { getDatabase } from '../config/database';

export class SqliteUserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT 
        id,
        name,
        email,
        age,
        phone,
        created_at as createdAt,
        updated_at as updatedAt
      FROM users
      ORDER BY created_at DESC
    `);
    
    const rows = stmt.all() as any[];
    
    return rows.map(row => User.fromData({
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      age: row.age,
      phone: row.phone,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));
  }

  async findById(id: string): Promise<User | null> {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT 
        id,
        name,
        email,
        age,
        phone,
        created_at as createdAt,
        updated_at as updatedAt
      FROM users
      WHERE id = ?
    `);
    
    const row = stmt.get(id) as any;
    
    if (!row) {
      return null;
    }
    
    return User.fromData({
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      age: row.age,
      phone: row.phone,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT 
        id,
        name,
        email,
        age,
        phone,
        created_at as createdAt,
        updated_at as updatedAt
      FROM users
      WHERE email = ?
    `);
    
    const row = stmt.get(email.toLowerCase()) as any;
    
    if (!row) {
      return null;
    }
    
    return User.fromData({
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      age: row.age,
      phone: row.phone,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    });
  }

  async save(user: User): Promise<User> {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, age, phone, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const userData = user.toJSON();
    
    stmt.run(
      userData.id,
      userData.name,
      userData.email,
      userData.age || null,
      userData.phone || null,
      userData.createdAt.toISOString(),
      userData.updatedAt.toISOString()
    );
    
    return user;
  }

  async update(id: string, user: User): Promise<User | null> {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE users 
      SET name = ?, email = ?, age = ?, phone = ?, updated_at = ?
      WHERE id = ?
    `);
    
    const userData = user.toJSON();
    
    const result = stmt.run(
      userData.name,
      userData.email,
      userData.age || null,
      userData.phone || null,
      userData.updatedAt.toISOString(),
      id
    );
    
    if (result.changes === 0) {
      return null;
    }
    
    return user;
  }

  async delete(id: string): Promise<User | null> {
    // 削除前にユーザー情報を取得
    const user = await this.findById(id);
    if (!user) {
      return null;
    }
    
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return null;
    }
    
    return user;
  }

  async count(): Promise<number> {
    const db = getDatabase();
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
    const result = stmt.get() as { count: number };
    
    return result.count;
  }

  async findByName(name: string): Promise<User[]> {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT 
        id,
        name,
        email,
        age,
        phone,
        created_at as createdAt,
        updated_at as updatedAt
      FROM users
      WHERE name LIKE ?
      ORDER BY created_at DESC
    `);
    
    const rows = stmt.all(`%${name}%`) as any[];
    
    return rows.map(row => User.fromData({
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      age: row.age,
      phone: row.phone,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));
  }

  async findByAgeRange(minAge: number, maxAge: number): Promise<User[]> {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT 
        id,
        name,
        email,
        age,
        phone,
        created_at as createdAt,
        updated_at as updatedAt
      FROM users
      WHERE age BETWEEN ? AND ?
      ORDER BY age ASC
    `);
    
    const rows = stmt.all(minAge, maxAge) as any[];
    
    return rows.map(row => User.fromData({
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      age: row.age,
      phone: row.phone,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));
  }
}
