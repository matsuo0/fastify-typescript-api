// 基本的なAPIレスポンス型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ユーザー型（学習用）
export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ユーザー作成リクエスト型
export interface CreateUserRequest {
  name: string;
  email: string;
  age?: number;
  phone?: string;
}

// ユーザー更新リクエスト型
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
  phone?: string;
}

// 環境変数型
export interface Environment {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
} 