import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess, sendError } from '../utils/response';
import { User, CreateUserRequest, UpdateUserRequest } from '../types';
import { validateUserData, sendValidationError } from '../utils/validation';
import {
  createUserSchema,
  updateUserSchema,
  userResponseSchema,
  usersResponseSchema,
  userIdParamSchema,
  errorResponseSchema
} from '../schemas/userSchemas';

// メモリ内のユーザーストレージ（学習用）
const users: User[] = [];

export default async function userRoutes(fastify: FastifyInstance) {
  // GET /users - ユーザー一覧取得
  fastify.get('/users', {
    schema: {
      response: {
        200: usersResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    sendSuccess(reply, users, 'Users retrieved successfully');
  });

  // GET /users/:id - 特定ユーザー取得
  fastify.get('/users/:id', {
    schema: {
      params: userIdParamSchema,
      response: {
        200: userResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request: FastifyRequest<{
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
        201: userResponseSchema,
        400: errorResponseSchema,
        409: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request: FastifyRequest<{
    Body: CreateUserRequest
  }>, reply: FastifyReply) => {
    const userData = request.body;
    
    // カスタムバリデーション
    const validationErrors = validateUserData(userData);
    if (validationErrors.length > 0) {
      return sendValidationError(reply, validationErrors);
    }
    
    // メールアドレスの重複チェック
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return sendError(reply, 'Email already exists', 409);
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phone: userData.phone,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(newUser);
    sendSuccess(reply, newUser, 'User created successfully', 201);
  });

  // PUT /users/:id - ユーザー更新
  fastify.put('/users/:id', {
    schema: {
      params: userIdParamSchema,
      body: updateUserSchema,
      response: {
        200: userResponseSchema,
        400: errorResponseSchema,
        404: errorResponseSchema,
        409: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request: FastifyRequest<{
    Params: { id: string },
    Body: UpdateUserRequest
  }>, reply: FastifyReply) => {
    const { id } = request.params;
    const updateData = request.body;
    
    // カスタムバリデーション
    const validationErrors = validateUserData(updateData);
    if (validationErrors.length > 0) {
      return sendValidationError(reply, validationErrors);
    }
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return sendError(reply, 'User not found', 404);
    }
    
    // メールアドレスの重複チェック（自分以外）
    if (updateData.email) {
      const existingUser = users.find(u => u.email === updateData.email && u.id !== id);
      if (existingUser) {
        return sendError(reply, 'Email already exists', 409);
      }
    }
    
    // 部分更新
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    sendSuccess(reply, users[userIndex], 'User updated successfully');
  });

  // DELETE /users/:id - ユーザー削除
  fastify.delete('/users/:id', {
    schema: {
      params: userIdParamSchema,
      response: {
        200: userResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema
      }
    }
  }, async (request: FastifyRequest<{
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