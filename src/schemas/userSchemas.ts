// ユーザー作成・更新用のリクエストスキーマ
export const createUserSchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^[a-zA-Z\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF\\s]+$',
      description: 'ユーザー名（1-100文字、英数字・ひらがな・カタカナ・漢字のみ）'
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255,
      description: 'メールアドレス'
    },
    age: {
      type: 'number',
      minimum: 0,
      maximum: 150,
      description: '年齢（0-150歳）'
    },
    phone: {
      type: 'string',
      pattern: '^[0-9\\-\\+\\s\\(\\)]+$',
      maxLength: 20,
      description: '電話番号'
    }
  },
  additionalProperties: false
};

// ユーザー更新用のリクエストスキーマ（部分更新対応）
export const updateUserSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^[a-zA-Z\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF\\s]+$',
      description: 'ユーザー名（1-100文字、英数字・ひらがな・カタカナ・漢字のみ）'
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255,
      description: 'メールアドレス'
    },
    age: {
      type: 'number',
      minimum: 0,
      maximum: 150,
      description: '年齢（0-150歳）'
    },
    phone: {
      type: 'string',
      pattern: '^[0-9\\-\\+\\s\\(\\)]+$',
      maxLength: 20,
      description: '電話番号'
    }
  },
  additionalProperties: false,
  minProperties: 1
};

// ユーザー情報のレスポンススキーマ
export const userResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        age: { type: 'number' },
        phone: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'name', 'email', 'createdAt', 'updatedAt']
    },
    message: { type: 'string' }
  },
  required: ['success', 'data']
};

// ユーザー一覧のレスポンススキーマ
export const usersResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          age: { type: 'number' },
          phone: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'name', 'email', 'createdAt', 'updatedAt']
      }
    },
    message: { type: 'string' }
  },
  required: ['success', 'data']
};

// エラーレスポンススキーマ
export const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: { type: 'string' },
    details: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string' },
          message: { type: 'string' }
        }
      }
    }
  },
  required: ['success', 'error']
};

// パラメータバリデーションスキーマ
export const userIdParamSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '^[0-9]+$',
      description: 'ユーザーID（数字のみ）'
    }
  },
  required: ['id']
}; 