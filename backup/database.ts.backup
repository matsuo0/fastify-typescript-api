import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess, sendError } from '../utils/response';
import { getDatabaseStats } from '../utils/database';

// データベース統計情報のレスポンススキーマ
const databaseStatsSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        totalUsers: { type: 'number' },
        databasePath: { type: 'string' },
        timestamp: { type: 'string' }
      }
    },
    message: { type: 'string' }
  },
  required: ['success', 'data']
};

export default async function databaseRoutes(fastify: FastifyInstance) {
  // GET /database/stats - データベース統計情報
  fastify.get('/database/stats', {
    schema: {
      response: {
        200: databaseStatsSchema,
        500: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = getDatabaseStats();
      const responseData = {
        ...stats,
        timestamp: new Date().toISOString()
      };
      
      sendSuccess(reply, responseData, 'Database statistics retrieved successfully');
    } catch (error) {
      fastify.log.error(error);
      return sendError(reply, 'Failed to retrieve database statistics', 500);
    }
  });
} 