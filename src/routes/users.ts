import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess, sendError } from '../utils/response';
import { User, CreateUserRequest } from '../types';

// リクエストスキーマ
const createUserSchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' }
  }
};

// レスポンススキーマ
const userResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    },
    message: { type: 'string' }
  }
};

// メモリ内のユーザーストレージ（学習用）
const users: User[] = [];

export default async function userRoutes(fastify: FastifyInstance) {
  // GET /users - ユーザー一覧取得
  fastify.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    sendSuccess(reply, users, 'Users retrieved successfully');
  });

  // GET /users/:id - 特定ユーザー取得
  fastify.get('/users/:id', async (request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) => {
    const { id } = request.params;
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return sendError(reply, 'User not found', 404);
    }
    
    sendSuccess(reply, user, 'User retrieved successfully');
  });

  // POST /users - ユーザー作成
  fastify.post('/users', {
    schema: {
      body: createUserSchema,
      response: {
        201: userResponseSchema
      }
    }
  }, async (request: FastifyRequest<{
    Body: CreateUserRequest
  }>, reply: FastifyReply) => {
    const { name, email } = request.body;
    
    // メールアドレスの重複チェック
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return sendError(reply, 'Email already exists', 409);
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    sendSuccess(reply, newUser, 'User created successfully', 201);
  });

  // PUT /users/:id - ユーザー更新
  fastify.put('/users/:id', {
    schema: {
      body: createUserSchema,
      response: {
        200: userResponseSchema
      }
    }
  }, async (request: FastifyRequest<{
    Params: { id: string },
    Body: CreateUserRequest
  }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { name, email } = request.body;
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return sendError(reply, 'User not found', 404);
    }
    
    // メールアドレスの重複チェック（自分以外）
    const existingUser = users.find(u => u.email === email && u.id !== id);
    if (existingUser) {
      return sendError(reply, 'Email already exists', 409);
    }
    
    users[userIndex] = {
      ...users[userIndex],
      name,
      email,
      updatedAt: new Date()
    };
    
    sendSuccess(reply, users[userIndex], 'User updated successfully');
  });

  // DELETE /users/:id - ユーザー削除
  fastify.delete('/users/:id', async (request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) => {
    const { id } = request.params;
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return sendError(reply, 'User not found', 404);
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    sendSuccess(reply, deletedUser, 'User deleted successfully');
  });
} 