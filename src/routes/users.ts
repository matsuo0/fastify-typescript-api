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
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
} from '../utils/database';

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
    try {
      const users = getAllUsers();
      sendSuccess(reply, users, 'Users retrieved successfully');
    } catch (error) {
      fastify.log.error(error);
      return sendError(reply, 'Failed to retrieve users', 500);
    }
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
    try {
      const { id } = request.params;
      const user = getUserById(id);
      
      if (!user) {
        return sendError(reply, 'User not found', 404);
      }
      
      sendSuccess(reply, user, 'User retrieved successfully');
    } catch (error) {
      fastify.log.error(error);
      return sendError(reply, 'Failed to retrieve user', 500);
    }
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
    try {
      const userData = request.body;
      
      // カスタムバリデーション
      const validationErrors = validateUserData(userData);
      if (validationErrors.length > 0) {
        return sendValidationError(reply, validationErrors);
      }
      
      // メールアドレスの重複チェック
      const existingUser = getUserByEmail(userData.email);
      if (existingUser) {
        return sendError(reply, 'Email already exists', 409);
      }
      
      const newUser = createUser(userData);
      sendSuccess(reply, newUser, 'User created successfully', 201);
    } catch (error) {
      fastify.log.error(error);
      return sendError(reply, 'Failed to create user', 500);
    }
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
    try {
      const { id } = request.params;
      const updateData = request.body;
      
      // カスタムバリデーション
      const validationErrors = validateUserData(updateData);
      if (validationErrors.length > 0) {
        return sendValidationError(reply, validationErrors);
      }
      
      // メールアドレスの重複チェック（自分以外）
      if (updateData.email) {
        const existingUser = getUserByEmail(updateData.email);
        if (existingUser && existingUser.id !== id) {
          return sendError(reply, 'Email already exists', 409);
        }
      }
      
      const updatedUser = updateUser(id, updateData);
      if (!updatedUser) {
        return sendError(reply, 'User not found', 404);
      }
      
      sendSuccess(reply, updatedUser, 'User updated successfully');
    } catch (error) {
      fastify.log.error(error);
      return sendError(reply, 'Failed to update user', 500);
    }
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
    try {
      const { id } = request.params;
      const deletedUser = deleteUser(id);
      
      if (!deletedUser) {
        return sendError(reply, 'User not found', 404);
      }
      
      sendSuccess(reply, deletedUser, 'User deleted successfully');
    } catch (error) {
      fastify.log.error(error);
      return sendError(reply, 'Failed to delete user', 500);
    }
  });
} 