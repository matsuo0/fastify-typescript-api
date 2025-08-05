import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess } from '../utils/response';

// ヘルスチェック用のスキーマ
const healthResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' },
        uptime: { type: 'number' }
      }
    },
    message: { type: 'string' }
  }
};

export default async function healthRoutes(fastify: FastifyInstance) {
  // GET /health - ヘルスチェック
  fastify.get('/health', {
    schema: {
      response: {
        200: healthResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
    
    sendSuccess(reply, healthData, 'Health check successful');
  });

  // GET /health/detailed - 詳細ヘルスチェック
  fastify.get('/health/detailed', {
    schema: {
      response: {
        200: healthResponseSchema
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const detailedHealthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform
    };
    
    sendSuccess(reply, detailedHealthData, 'Detailed health check successful');
  });
} 