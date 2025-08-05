import { FastifyReply } from 'fastify';
import { ApiResponse } from '../types';

// 成功レスポンス
export const sendSuccess = <T>(
  reply: FastifyReply,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  
  reply.status(statusCode).send(response);
};

// エラーレスポンス
export const sendError = (
  reply: FastifyReply,
  error: string,
  statusCode: number = 400
): void => {
  const response: ApiResponse = {
    success: false,
    error
  };
  
  reply.status(statusCode).send(response);
};

// ページネーション用レスポンス
export const sendPaginatedResponse = <T>(
  reply: FastifyReply,
  data: T[],
  page: number,
  limit: number,
  total: number
): void => {
  const response: ApiResponse<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> = {
    success: true,
    data: {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  };
  
  reply.send(response);
}; 