import { getDatabase } from '../config/database';
import { User, CreateUserRequest, UpdateUserRequest } from '../types';

// ユーザー関連のデータベース操作

// 全ユーザーを取得
export const getAllUsers = (): User[] => {
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
  
  return rows.map(row => ({
    id: row.id.toString(),
    name: row.name,
    email: row.email,
    age: row.age,
    phone: row.phone,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  }));
};

// IDでユーザーを取得
export const getUserById = (id: string): User | null => {
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
  
  return {
    id: row.id.toString(),
    name: row.name,
    email: row.email,
    age: row.age,
    phone: row.phone,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  };
};

// メールアドレスでユーザーを取得
export const getUserByEmail = (email: string): User | null => {
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
  
  const row = stmt.get(email) as any;
  
  if (!row) {
    return null;
  }
  
  return {
    id: row.id.toString(),
    name: row.name,
    email: row.email,
    age: row.age,
    phone: row.phone,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  };
};

// ユーザーを作成
export const createUser = (userData: CreateUserRequest): User => {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO users (name, email, age, phone)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    userData.name,
    userData.email,
    userData.age || null,
    userData.phone || null
  );
  
  // 作成されたユーザーを取得
  const createdUser = getUserById(result.lastInsertRowid.toString());
  
  if (!createdUser) {
    throw new Error('ユーザーの作成に失敗しました');
  }
  
  return createdUser;
};

// ユーザーを更新
export const updateUser = (id: string, updateData: UpdateUserRequest): User | null => {
  const db = getDatabase();
  
  // 更新するフィールドを動的に構築
  const updateFields: string[] = [];
  const values: any[] = [];
  
  if (updateData.name !== undefined) {
    updateFields.push('name = ?');
    values.push(updateData.name);
  }
  
  if (updateData.email !== undefined) {
    updateFields.push('email = ?');
    values.push(updateData.email);
  }
  
  if (updateData.age !== undefined) {
    updateFields.push('age = ?');
    values.push(updateData.age);
  }
  
  if (updateData.phone !== undefined) {
    updateFields.push('phone = ?');
    values.push(updateData.phone);
  }
  
  // updated_atを更新
  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  
  if (updateFields.length === 1) {
    // updated_atのみの更新の場合は何もしない
    return getUserById(id);
  }
  
  const stmt = db.prepare(`
    UPDATE users 
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `);
  
  values.push(id);
  const result = stmt.run(...values);
  
  if (result.changes === 0) {
    return null; // ユーザーが見つからない
  }
  
  return getUserById(id);
};

// ユーザーを削除
export const deleteUser = (id: string): User | null => {
  const db = getDatabase();
  
  // 削除前にユーザー情報を取得
  const user = getUserById(id);
  if (!user) {
    return null;
  }
  
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(id);
  
  if (result.changes === 0) {
    return null;
  }
  
  return user;
};

// データベースの統計情報を取得
export const getDatabaseStats = () => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const result = stmt.get() as { count: number };
  
  return {
    totalUsers: result.count,
    databasePath: db.name
  };
}; 