import { User } from '../entities/User';

// ユーザーリポジトリのインターフェース
export interface IUserRepository {
  // 基本的なCRUD操作
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, user: User): Promise<User | null>;
  delete(id: string): Promise<User | null>;
  
  // 統計情報
  count(): Promise<number>;
  
  // 高度なクエリ（将来的な拡張用）
  findByName(name: string): Promise<User[]>;
  findByAgeRange(minAge: number, maxAge: number): Promise<User[]>;
}
