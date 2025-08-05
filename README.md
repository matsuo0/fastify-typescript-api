# Fastify TypeScript API

Fastify と TypeScript を使用した学習用 API プロジェクトです。

## 🚀 機能

- **Fastify**: 高速な Node.js Web フレームワーク
- **TypeScript**: 型安全性を提供
- **CORS**: クロスオリジンリクエストのサポート
- **Helmet**: セキュリティヘッダーの設定
- **スキーマバリデーション**: リクエスト/レスポンスの自動バリデーション
- **エラーハンドリング**: 包括的なエラー処理

## 📁 プロジェクト構造

```
src/
├── index.ts          # メインアプリケーションファイル
├── types/            # TypeScript型定義
│   └── index.ts
├── utils/            # ユーティリティ関数
│   └── response.ts
├── routes/           # APIルート
│   ├── health.ts     # ヘルスチェック
│   └── users.ts      # ユーザー管理
└── plugins/          # Fastifyプラグイン
    ├── cors.ts       # CORS設定
    └── helmet.ts     # セキュリティ設定
```

## 🛠️ セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

### 本番用ビルド

```bash
npm run build
npm start
```

## 📡 API エンドポイント

### ヘルスチェック

- `GET /api/health` - 基本的なヘルスチェック
- `GET /api/health/detailed` - 詳細なヘルスチェック

### ユーザー管理

- `GET /api/users` - ユーザー一覧取得
- `GET /api/users/:id` - 特定ユーザー取得
- `POST /api/users` - ユーザー作成
- `PUT /api/users/:id` - ユーザー更新
- `DELETE /api/users/:id` - ユーザー削除

## 📝 使用例

### ユーザー作成

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "田中太郎",
    "email": "tanaka@example.com"
  }'
```

### ユーザー一覧取得

```bash
curl http://localhost:3000/api/users
```

### ヘルスチェック

```bash
curl http://localhost:3000/api/health
```

## 🔧 開発

### スクリプト

- `npm run dev` - 開発サーバー起動（ホットリロード）
- `npm run build` - TypeScript コンパイル
- `npm start` - 本番サーバー起動

### 環境変数

- `PORT` - サーバーポート（デフォルト: 3000）
- `HOST` - サーバーホスト（デフォルト: localhost）
- `NODE_ENV` - 環境設定（development/production）

## 🎯 学習ポイント

このプロジェクトでは以下の概念を学習できます：

1. **Fastify の基本設定**

   - プラグインシステム
   - ルート定義
   - スキーマバリデーション

2. **TypeScript の活用**

   - 型定義
   - インターフェース
   - ジェネリクス

3. **API 設計**

   - RESTful API
   - エラーハンドリング
   - レスポンス形式の統一

4. **セキュリティ**
   - CORS 設定
   - セキュリティヘッダー
   - 入力バリデーション

## 📚 次のステップ

学習を進めるために以下の機能を追加してみてください：

- データベース連携（PostgreSQL、MongoDB）
- 認証・認可（JWT、OAuth）
- ファイルアップロード
- テスト（Jest、Supertest）
- Docker 化
- CI/CD 設定

## 🤝 貢献

このプロジェクトは学習目的で作成されています。改善提案やバグ報告は歓迎します。
