# 実装手順詳細

## ステップ 1: プロジェクト初期化

### 1.1 package.json の作成

```bash
npm init -y
```

**設定内容:**

- プロジェクト名: `fastify-typescript-api`
- バージョン: `1.0.0`
- メインファイル: `dist/index.js`
- スクリプト: 開発用と本番用の設定

### 1.2 依存関係のインストール

**本番依存関係:**

```bash
npm install fastify @fastify/cors @fastify/helmet
```

**開発依存関係:**

```bash
npm install -D typescript @types/node ts-node nodemon
```

## ステップ 2: TypeScript 設定

### 2.1 tsconfig.json の作成

**主要設定:**

- `target`: ES2020（最新の JavaScript 機能）
- `module`: commonjs（Node.js 標準）
- `strict`: true（厳密な型チェック）
- `outDir`: ./dist（コンパイル出力先）
- `rootDir`: ./src（ソースコードディレクトリ）

**型安全性の設定:**

- `noImplicitAny`: true
- `strictNullChecks`: true
- `strictFunctionTypes`: true

## ステップ 3: プロジェクト構造の作成

### 3.1 ディレクトリ構造

```bash
mkdir -p src/routes src/plugins src/types src/utils
```

**各ディレクトリの役割:**

- `src/routes/`: API ルート定義
- `src/plugins/`: Fastify プラグイン
- `src/types/`: TypeScript 型定義
- `src/utils/`: ユーティリティ関数

## ステップ 4: 型定義の実装

### 4.1 基本型定義（src/types/index.ts）

**API レスポンス型:**

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

**ユーザー型:**

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**リクエスト型:**

```typescript
export interface CreateUserRequest {
  name: string;
  email: string;
}
```

## ステップ 5: ユーティリティ関数の実装

### 5.1 レスポンスユーティリティ（src/utils/response.ts）

**成功レスポンス関数:**

```typescript
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
```

**エラーレスポンス関数:**

```typescript
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
```

## ステップ 6: プラグインの実装

### 6.1 CORS 設定（src/plugins/cors.ts）

```typescript
export default async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: true, // 開発用：すべてのオリジンを許可
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
}
```

### 6.2 Helmet 設定（src/plugins/helmet.ts）

```typescript
export default async function helmetPlugin(fastify: FastifyInstance) {
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  });
}
```

## ステップ 7: ルートの実装

### 7.1 ヘルスチェック（src/routes/health.ts）

**スキーマ定義:**

```typescript
const healthResponseSchema = {
  type: "object",
  properties: {
    success: { type: "boolean" },
    data: {
      type: "object",
      properties: {
        status: { type: "string" },
        timestamp: { type: "string" },
        uptime: { type: "number" },
      },
    },
    message: { type: "string" },
  },
};
```

**ルート実装:**

```typescript
fastify.get(
  "/health",
  {
    schema: {
      response: {
        200: healthResponseSchema,
      },
    },
  },
  async (request, reply) => {
    const healthData = {
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
    sendSuccess(reply, healthData, "Health check successful");
  }
);
```

### 7.2 ユーザー管理（src/routes/users.ts）

**バリデーションスキーマ:**

```typescript
const createUserSchema = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
  },
};
```

**CRUD 操作:**

- GET /users - ユーザー一覧取得
- GET /users/:id - 特定ユーザー取得
- POST /users - ユーザー作成
- PUT /users/:id - ユーザー更新
- DELETE /users/:id - ユーザー削除

## ステップ 8: メインアプリケーション

### 8.1 アプリケーション設定（src/index.ts）

**Fastify インスタンス作成:**

```typescript
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
});
```

**プラグイン登録:**

```typescript
async function registerPlugins() {
  await fastify.register(helmetPlugin);
  await fastify.register(corsPlugin);
}
```

**ルート登録:**

```typescript
async function registerRoutes() {
  await fastify.register(healthRoutes, { prefix: "/api" });
  await fastify.register(userRoutes, { prefix: "/api" });
}
```

### 8.2 エラーハンドリング

**グローバルエラーハンドラー:**

```typescript
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);

  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: "Validation error",
      details: error.validation,
    });
  }

  return reply.status(500).send({
    success: false,
    error: "Internal server error",
  });
});
```

**404 ハンドラー:**

```typescript
fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    error: "Route not found",
  });
});
```

## ステップ 9: 開発環境の設定

### 9.1 package.json スクリプト

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon --exec ts-node src/index.ts",
    "dev:watch": "nodemon --watch src --exec ts-node src/index.ts"
  }
}
```

### 9.2 nodemon 設定

```json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node ./src/index.ts"
}
```

## ステップ 10: 動作確認

### 10.1 サーバー起動

```bash
npm run dev
```

### 10.2 API テスト

```bash
# ヘルスチェック
curl http://localhost:3000/api/health

# ユーザー作成
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "田中太郎", "email": "tanaka@example.com"}'

# ユーザー一覧取得
curl http://localhost:3000/api/users
```

## 実装のポイント

### 1. 型安全性の確保

- すべての API レスポンスに型定義
- リクエストボディのバリデーション
- 厳密な TypeScript 設定

### 2. エラーハンドリング

- グローバルエラーハンドラー
- バリデーションエラーの適切な処理
- 統一されたエラーレスポンス形式

### 3. セキュリティ

- CORS 設定によるクロスオリジン制御
- Helmet によるセキュリティヘッダー
- 入力バリデーション

### 4. 開発体験

- ホットリロード対応
- 詳細なログ出力
- 構造化されたプロジェクト
