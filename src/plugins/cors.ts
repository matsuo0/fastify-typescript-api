import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export default async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: true, // 開発用：すべてのオリジンを許可
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
} 