# 技術仕様詳細

## アーキテクチャ概要

### レイヤー構造

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│         (API Routes)               │
├─────────────────────────────────────┤
│           Business Logic           │
│         (Route Handlers)           │
├─────────────────────────────────────┤
│           Data Layer               │
│         (In-Memory Storage)        │
├─────────────────────────────────────┤
│           Infrastructure           │
│         (Fastify, Plugins)         │
└─────────────────────────────────────┘
```

## TypeScript 設定詳細

### tsconfig.json 設定項目

**コンパイラオプション:**

```json
{
  "compilerOptions": {
    "target": "ES2020", // 出力JavaScriptのバージョン
    "module": "commonjs", // モジュールシステム
    "lib": ["ES2020"], // 利用可能なライブラリ
    "outDir": "./dist", // 出力ディレクトリ
    "rootDir": "./src", // ソースディレクトリ
    "strict": true, // 厳密な型チェック
    "esModuleInterop": true, // ESモジュール互換性
    "skipLibCheck": true, // ライブラリの型チェックスキップ
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true, // JSONモジュール解決
    "declaration": true, // 型定義ファイル生成
    "declarationMap": true, // 型定義マップ生成
    "sourceMap": true, // ソースマップ生成
    "removeComments": true, // コメント削除
    "noImplicitAny": true, // 暗黙的any禁止
    "strictNullChecks": true, // null/undefined厳密チェック
    "strictFunctionTypes": true, // 関数型厳密チェック
    "noImplicitThis": true, // 暗黙的this禁止
    "noImplicitReturns": true, // 暗黙的return禁止
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node", // モジュール解決方式
    "baseUrl": "./", // ベースURL
    "paths": {
      // パスマッピング
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Fastify 設定詳細

### インスタンス設定

```typescript
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
});
```

**ログレベル:**

- `debug`: 開発時の詳細ログ
- `info`: 本番時の基本ログ
- `warn`: 警告メッセージ
- `error`: エラーメッセージ

### プラグインシステム

**CORS 設定:**

```typescript
{
  origin: true,                    // すべてのオリジンを許可（開発用）
  credentials: true,               // クレデンシャル送信許可
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

**Helmet 設定:**

```typescript
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}
```

## 型定義システム

### 基本型定義

**API レスポンス型:**

```typescript
export interface ApiResponse<T = any> {
  success: boolean; // 成功フラグ
  data?: T; // レスポンスデータ（ジェネリクス）
  message?: string; // メッセージ
  error?: string; // エラーメッセージ
}
```

**ユーザー型:**

```typescript
export interface User {
  id: string; // ユーザーID
  name: string; // ユーザー名
  email: string; // メールアドレス
  createdAt: Date; // 作成日時
  updatedAt: Date; // 更新日時
}
```

**リクエスト型:**

```typescript
export interface CreateUserRequest {
  name: string; // ユーザー名
  email: string; // メールアドレス
}
```

### ジェネリクスの活用

**レスポンスユーティリティ:**

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

## スキーマバリデーション

### JSON Schema 定義

**ユーザー作成スキーマ:**

```typescript
const createUserSchema = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
    email: {
      type: "string",
      format: "email",
    },
  },
};
```

**レスポンススキーマ:**

```typescript
const userResponseSchema = {
  type: "object",
  properties: {
    success: { type: "boolean" },
    data: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
      },
    },
    message: { type: "string" },
  },
};
```

## エラーハンドリング

### エラー分類

**1. バリデーションエラー**

```typescript
if (error.validation) {
  return reply.status(400).send({
    success: false,
    error: "Validation error",
    details: error.validation,
  });
}
```

**2. ビジネスロジックエラー**

```typescript
if (!user) {
  return sendError(reply, "User not found", 404);
}
```

**3. システムエラー**

```typescript
return reply.status(500).send({
  success: false,
  error: "Internal server error",
});
```

### エラーレスポンス形式

```typescript
{
  success: false,
  error: "エラーメッセージ",
  details?: any  // バリデーションエラーの場合
}
```

## セキュリティ仕様

### CORS 設定

- **Origin**: 開発時はすべて許可、本番時は特定ドメインのみ
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization
- **Credentials**: true（認証情報送信許可）

### Helmet 設定

- **Content Security Policy**: XSS 攻撃防止
- **X-Frame-Options**: クリックジャッキング防止
- **X-Content-Type-Options**: MIME 型推測防止
- **Strict-Transport-Security**: HTTPS 強制

### 入力バリデーション

- **型チェック**: TypeScript によるコンパイル時チェック
- **スキーマバリデーション**: JSON Schema による実行時チェック
- **長さ制限**: 文字列の最小・最大長チェック
- **形式チェック**: メールアドレス形式チェック

## パフォーマンス仕様

### Fastify の最適化

- **高速ルーティング**: 正規表現ベースの高速ルーティング
- **JSON 処理**: 最適化された JSON シリアライゼーション
- **メモリ使用量**: 低メモリフットプリント
- **並行処理**: 非同期 I/O による高並行性

### ログ設定

```typescript
{
  level: 'debug',           // ログレベル
  prettyPrint: false,       // 本番時は無効
  serializers: {            // カスタムシリアライザー
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers
    })
  }
}
```

## 開発環境仕様

### nodemon 設定

```json
{
  "watch": ["src"], // 監視ディレクトリ
  "ext": "ts,js,json", // 監視ファイル拡張子
  "ignore": ["src/**/*.spec.ts"], // 無視ファイル
  "exec": "ts-node ./src/index.ts" // 実行コマンド
}
```

### 環境変数

```bash
NODE_ENV=development    # 環境設定
PORT=3000              # サーバーポート
HOST=localhost         # サーバーホスト
```

### スクリプト設定

```json
{
  "build": "tsc", // TypeScriptコンパイル
  "start": "node dist/index.js", // 本番サーバー起動
  "dev": "nodemon --exec ts-node src/index.ts", // 開発サーバー
  "dev:watch": "nodemon --watch src --exec ts-node src/index.ts"
}
```

## テスト仕様

### テスト対象

- **ユニットテスト**: 個別関数・メソッド
- **統合テスト**: API エンドポイント
- **型テスト**: TypeScript 型チェック

### テストツール

- **Jest**: テストフレームワーク
- **Supertest**: HTTP テスト
- **ts-jest**: TypeScript 対応

## デプロイメント仕様

### ビルドプロセス

1. TypeScript コンパイル
2. 依存関係の最適化
3. 環境変数設定
4. セキュリティチェック

### 本番環境設定

- **ポート**: 環境変数から取得
- **ログレベル**: info
- **CORS**: 特定ドメインのみ許可
- **セキュリティ**: 厳格な CSP 設定
