# 開発ガイド

## 開発環境のセットアップ

### 前提条件

- Node.js 18.x 以上
- npm 9.x 以上
- Git

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd fastify-typescript-api
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

## 開発ワークフロー

### 1. 新しい機能の追加

#### 1.1 型定義の追加

```typescript
// src/types/index.ts
export interface NewFeature {
  id: string;
  name: string;
  // 他のプロパティ
}
```

#### 1.2 ルートの作成

```typescript
// src/routes/new-feature.ts
import { FastifyInstance } from "fastify";
import { sendSuccess, sendError } from "../utils/response";

export default async function newFeatureRoutes(fastify: FastifyInstance) {
  fastify.get("/new-feature", async (request, reply) => {
    // 実装
  });
}
```

#### 1.3 メインアプリケーションへの登録

```typescript
// src/index.ts
import newFeatureRoutes from "./routes/new-feature";

// ルート登録部分に追加
await fastify.register(newFeatureRoutes, { prefix: "/api" });
```

### 2. テストの追加

#### 2.1 テストファイルの作成

```typescript
// src/routes/__tests__/new-feature.test.ts
import { test } from "tap";
import { build } from "../../index";

test("GET /api/new-feature", async (t) => {
  const app = await build();

  const response = await app.inject({
    method: "GET",
    url: "/api/new-feature",
  });

  t.equal(response.statusCode, 200);
  t.same(JSON.parse(response.payload), {
    success: true,
    data: {
      /* expected data */
    },
    message: "Success",
  });
});
```

### 3. ドキュメントの更新

- API 仕様書の更新
- README の更新
- 技術仕様書の更新

## コーディング規約

### TypeScript 規約

#### 1. 型定義

```typescript
// インターフェース名は大文字で始める
export interface User {
  id: string;
  name: string;
}

// 型エイリアスは大文字で始める
export type UserId = string;

// ジェネリクスを使用
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
}
```

#### 2. 関数定義

```typescript
// アロー関数を使用
export const createUser = async (
  userData: CreateUserRequest
): Promise<User> => {
  // 実装
};

// 非同期関数は明示的にPromiseを返す
export async function updateUser(
  id: string,
  data: UpdateUserRequest
): Promise<User> {
  // 実装
}
```

#### 3. エラーハンドリング

```typescript
try {
  const result = await someAsyncOperation();
  return sendSuccess(reply, result);
} catch (error) {
  fastify.log.error(error);
  return sendError(reply, "Operation failed", 500);
}
```

### Fastify 規約

#### 1. ルート定義

```typescript
// スキーマを定義
const routeSchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        data: { type: "object" },
      },
    },
  },
};

// ルートハンドラー
fastify.post(
  "/route",
  {
    schema: routeSchema,
  },
  async (request, reply) => {
    // 実装
  }
);
```

#### 2. プラグイン定義

```typescript
// プラグインは関数として定義
export default async function myPlugin(fastify: FastifyInstance) {
  // プラグインの実装
}
```

### ファイル命名規約

#### 1. ファイル名

- ケバブケース: `user-routes.ts`
- またはキャメルケース: `userRoutes.ts`

#### 2. ディレクトリ名

- ケバブケース: `user-management/`
- またはキャメルケース: `userManagement/`

## デバッグ

### 1. ログの活用

```typescript
// 開発時のログ
fastify.log.debug("Debug message");
fastify.log.info("Info message");
fastify.log.warn("Warning message");
fastify.log.error("Error message");
```

### 2. エラーハンドリング

```typescript
// グローバルエラーハンドラーでログ出力
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  // エラーレスポンス
});
```

### 3. 開発ツール

- **nodemon**: ファイル変更時の自動再起動
- **ts-node**: TypeScript の直接実行
- **VS Code**: デバッグ設定

## パフォーマンス最適化

### 1. データベースクエリ

```typescript
// 効率的なクエリ
const users = await fastify.db.users.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
  where: {
    active: true,
  },
});
```

### 2. キャッシュの活用

```typescript
// キャッシュの実装
const cache = new Map();

const getCachedData = async (key: string) => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = await fetchData(key);
  cache.set(key, data);
  return data;
};
```

### 3. 非同期処理

```typescript
// 並列処理
const [users, posts] = await Promise.all([getUsers(), getPosts()]);
```

## セキュリティ

### 1. 入力バリデーション

```typescript
// 厳密なバリデーション
const userSchema = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 100,
    },
    email: {
      type: "string",
      format: "email",
    },
  },
};
```

### 2. 認証・認可

```typescript
// JWT認証の例
const authenticate = async (request, reply) => {
  const token = request.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    throw new Error("No token provided");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  request.user = decoded;
};
```

### 3. セキュリティヘッダー

```typescript
// Helmet設定のカスタマイズ
await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
});
```

## テスト

### 1. ユニットテスト

```typescript
// src/utils/__tests__/response.test.ts
import { test } from "tap";
import { sendSuccess, sendError } from "../response";

test("sendSuccess", async (t) => {
  const mockReply = {
    status: (code: number) => ({
      send: (data: any) => data,
    }),
  };

  const result = sendSuccess(mockReply as any, { test: "data" });
  t.ok(result);
});
```

### 2. 統合テスト

```typescript
// src/routes/__tests__/users.test.ts
import { test } from "tap";
import { build } from "../../index";

test("POST /api/users", async (t) => {
  const app = await build();

  const response = await app.inject({
    method: "POST",
    url: "/api/users",
    payload: {
      name: "Test User",
      email: "test@example.com",
    },
  });

  t.equal(response.statusCode, 201);
});
```

### 3. テスト実行

```bash
# すべてのテストを実行
npm test

# 特定のテストファイルを実行
npm test -- src/routes/__tests__/users.test.ts

# カバレッジ付きで実行
npm run test:coverage
```

## デプロイメント

### 1. 本番ビルド

```bash
# TypeScriptコンパイル
npm run build

# 依存関係の最適化
npm ci --only=production
```

### 2. 環境変数設定

```bash
# .env.production
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

### 3. プロセス管理

```bash
# PM2使用例
pm2 start dist/index.js --name "fastify-api"
pm2 save
pm2 startup
```

## トラブルシューティング

### 1. よくある問題

#### TypeScript エラー

```bash
# 型チェックのみ実行
npx tsc --noEmit

# 特定ファイルの型チェック
npx tsc --noEmit src/index.ts
```

#### サーバーが起動しない

```bash
# ポートの確認
lsof -i :3000

# プロセスの確認
ps aux | grep node
```

#### ホットリロードが動作しない

```bash
# nodemonの再起動
pkill -f nodemon
npm run dev
```

### 2. ログの確認

```bash
# アプリケーションログ
tail -f logs/app.log

# エラーログ
tail -f logs/error.log
```

### 3. パフォーマンス問題

```bash
# メモリ使用量の確認
node --inspect src/index.ts

# CPU使用量の確認
top -p $(pgrep -f "node.*index")
```

## ベストプラクティス

### 1. コード品質

- ESLint と Prettier の使用
- 型安全性の確保
- エラーハンドリングの徹底

### 2. パフォーマンス

- データベースクエリの最適化
- キャッシュの活用
- 非同期処理の適切な使用

### 3. セキュリティ

- 入力バリデーションの徹底
- 認証・認可の実装
- セキュリティヘッダーの設定

### 4. 保守性

- 適切なコメント
- 関数の単一責任
- テストカバレッジの確保
