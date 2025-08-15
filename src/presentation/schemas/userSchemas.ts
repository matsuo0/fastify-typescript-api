// ユーザー作成スキーマ
export const createUserSchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100
    },
    email: {
      type: 'string',
      format: 'email'
    },
    age: {
      type: 'number',
      minimum: 0,
      maximum: 150
    },
    phone: {
      type: 'string',
      pattern: '^[\\+]?[1-9][\\d]{0,15}$'
    }
  }
};

// ユーザー更新スキーマ
export const updateUserSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100
    },
    email: {
      type: 'string',
      format: 'email'
    },
    age: {
      type: 'number',
      minimum: 0,
      maximum: 150
    },
    phone: {
      type: 'string',
      pattern: '^[\\+]?[1-9][\\d]{0,15}$'
    }
  }
};

// ユーザーIDパラメータスキーマ
export const userIdParamSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      minLength: 1
    }
  }
};

// ユーザーレスポンススキーマ
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
  required: ['success']
};

// ユーザー一覧レスポンススキーマ
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
  required: ['success']
};

// エラーレスポンススキーマ
export const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: { type: 'string' },
    details: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['success', 'error']
};
