import { FastifyReply } from 'fastify';
import { ApiResponse } from '../types';

// 成功レスポンスを送信
export const sendSuccess = <T>(
  reply: FastifyReply,
  data: T,
  message: string = "Success",
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  reply.status(statusCode).send(response);
};

// エラーレスポンスを送信
export const sendError = (
  reply: FastifyReply,
  error: string,
  statusCode: number = 400
): void => {
  const response: ApiResponse = {
    success: false,
    error,
  };
  reply.status(statusCode).send(response);
};
