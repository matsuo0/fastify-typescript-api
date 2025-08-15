import { FastifyReply } from 'fastify';
import { CreateUserRequest, UpdateUserRequest } from '../types';

// メールアドレスの妥当性チェック
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 電話番号の妥当性チェック
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
  return phoneRegex.test(phone);
};

// ユーザーデータのバリデーション
export const validateUserData = (userData: CreateUserRequest | UpdateUserRequest): string[] => {
  const errors: string[] = [];
  
  // 名前のチェック
  if (userData.name !== undefined) {
    if (!userData.name || userData.name.trim().length === 0) {
      errors.push('Name is required and cannot be empty');
    }
  }
  
  // メールアドレスのチェック
  if (userData.email !== undefined) {
    if (!userData.email || !isValidEmail(userData.email)) {
      errors.push('Valid email is required');
    }
  }
  
  // 年齢のチェック
  if (userData.age !== undefined) {
    if (userData.age < 0 || userData.age > 150) {
      errors.push('Age must be between 0 and 150');
    }
  }
  
  // 電話番号のチェック
  if (userData.phone !== undefined && userData.phone) {
    if (!isValidPhone(userData.phone)) {
      errors.push('Invalid phone format');
    }
  }
  
  return errors;
};

// バリデーションエラーを送信
export const sendValidationError = (
  reply: FastifyReply,
  errors: string[]
): void => {
  reply.status(400).send({
    success: false,
    error: 'Validation error',
    details: errors
  });
};
