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
  createdAt: Date;
  updatedAt: Date;
}

// リクエストボディ型
export interface CreateUserRequest {
  name: string;
  email: string;
}

// 環境変数型
export interface Environment {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
} 