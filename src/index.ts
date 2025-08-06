import Fastify from 'fastify';
import helmetPlugin from './plugins/helmet';
import corsPlugin from './plugins/cors';
import healthRoutes from './routes/health';
import userRoutes from './routes/users';
import databaseRoutes from './routes/database';
import { initializeDatabase, closeDatabase } from './config/database';

// 環境変数の設定
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST || 'localhost';

// Fastifyインスタンスの作成
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }
});

// プラグインの登録
async function registerPlugins() {
  await fastify.register(helmetPlugin);
  await fastify.register(corsPlugin);
}

// ルートの登録
async function registerRoutes() {
  await fastify.register(healthRoutes, { prefix: '/api' });
  await fastify.register(userRoutes, { prefix: '/api' });
  await fastify.register(databaseRoutes, { prefix: '/api' });
}

// エラーハンドラーの設定
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  // バリデーションエラーの処理
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: 'Validation error',
      details: error.validation
    });
  }
  
  // その他のエラー
  return reply.status(500).send({
    success: false,
    error: 'Internal server error'
  });
});

// 404ハンドラー
fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    error: 'Route not found'
  });
});

// アプリケーションの起動
async function start() {
  try {
    // データベースの初期化
    initializeDatabase();
    
    // プラグインとルートを登録
    await registerPlugins();
    await registerRoutes();
    
    // サーバーの起動
    await fastify.listen({ port: PORT, host: HOST });
    
    console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/api/health`);
    console.log(`👥 Users API: http://${HOST}:${PORT}/api/users`);
    console.log(`🗄️  Database: data/users.db`);
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// プロセス終了時の処理
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await fastify.close();
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await fastify.close();
  closeDatabase();
  process.exit(0);
});

// アプリケーション開始
start(); 