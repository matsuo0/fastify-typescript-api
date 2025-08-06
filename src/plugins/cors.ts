import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export default async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN === 'true' ? true : process.env.CORS_ORIGIN || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
} 