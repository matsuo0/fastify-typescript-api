import { SqliteUserRepository } from '../infrastructure/database/SqliteUserRepository';
import { User } from '../domain/entities/User';
import { CreateUserRequest, UpdateUserRequest } from '../shared/types';

// 新しいリポジトリパターンを使用したデータベースユーティリティ
const userRepository = new SqliteUserRepository();

// 全ユーザーを取得
export const getAllUsers = async (): Promise<User[]> => {
  return userRepository.findAll();
};

// IDでユーザーを取得
export const getUserById = async (id: string): Promise<User | null> => {
  return userRepository.findById(id);
};

// メールアドレスでユーザーを取得
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return userRepository.findByEmail(email);
};

// ユーザーを作成
export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const user = User.create(
    userData.name,
    userData.email,
    userData.age,
    userData.phone
  );
  
  return userRepository.save(user);
};

// ユーザーを更新
export const updateUser = async (id: string, updateData: UpdateUserRequest): Promise<User | null> => {
  const existingUser = await userRepository.findById(id);
  if (!existingUser) {
    return null;
  }

  // 更新データを適用
  if (updateData.name !== undefined) {
    existingUser.updateName(updateData.name);
  }
  if (updateData.email !== undefined) {
    existingUser.updateEmail(updateData.email);
  }
  if (updateData.age !== undefined) {
    existingUser.updateAge(updateData.age);
  }
  if (updateData.phone !== undefined) {
    existingUser.updatePhone(updateData.phone);
  }

  return userRepository.update(id, existingUser);
};

// ユーザーを削除
export const deleteUser = async (id: string): Promise<User | null> => {
  return userRepository.delete(id);
};

// データベースの統計情報を取得
export const getDatabaseStats = async () => {
  const count = await userRepository.count();
  return {
    totalUsers: count,
    databasePath: 'data/users.db'
  };
}; 