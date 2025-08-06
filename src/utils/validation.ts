import { FastifyReply } from 'fastify';

// カスタムバリデーション関数
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9\-\+\s\(\)]+$/;
  return phoneRegex.test(phone);
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]+$/;
  return nameRegex.test(name);
};

export const validateAge = (age: number): boolean => {
  return age >= 0 && age <= 150;
};

// エラーメッセージの生成
export const generateValidationError = (field: string, message: string) => {
  return {
    field,
    message
  };
};

// 複合バリデーション
export const validateUserData = (data: any) => {
  const errors: Array<{ field: string; message: string }> = [];

  // 名前のバリデーション
  if (data.name) {
    if (!validateName(data.name)) {
      errors.push(generateValidationError('name', '名前は英数字・ひらがな・カタカナ・漢字のみ使用可能です'));
    }
    if (data.name.length > 100) {
      errors.push(generateValidationError('name', '名前は100文字以内で入力してください'));
    }
  }

  // メールアドレスのバリデーション
  if (data.email) {
    if (!validateEmail(data.email)) {
      errors.push(generateValidationError('email', '有効なメールアドレスを入力してください'));
    }
    if (data.email.length > 255) {
      errors.push(generateValidationError('email', 'メールアドレスは255文字以内で入力してください'));
    }
  }

  // 年齢のバリデーション
  if (data.age !== undefined) {
    if (!validateAge(data.age)) {
      errors.push(generateValidationError('age', '年齢は0-150歳の範囲で入力してください'));
    }
  }

  // 電話番号のバリデーション
  if (data.phone) {
    if (!validatePhone(data.phone)) {
      errors.push(generateValidationError('phone', '電話番号は数字・ハイフン・括弧・スペースのみ使用可能です'));
    }
    if (data.phone.length > 20) {
      errors.push(generateValidationError('phone', '電話番号は20文字以内で入力してください'));
    }
  }

  return errors;
};

// バリデーションエラーの送信
export const sendValidationError = (reply: FastifyReply, errors: Array<{ field: string; message: string }>) => {
  return reply.status(400).send({
    success: false,
    error: 'Validation error',
    details: errors
  });
}; 