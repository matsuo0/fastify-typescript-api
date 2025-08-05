# ドキュメント一覧

このディレクトリには、Fastify TypeScript API プロジェクトの詳細なドキュメントが含まれています。

## 📚 ドキュメント構成

### 1. [プロジェクト概要](./01-project-overview.md)

- プロジェクトの目的と特徴
- 技術スタックの詳細
- 学習目標とプロジェクト構造
- 開発環境の要件

### 2. [実装手順詳細](./02-implementation-steps.md)

- ステップバイステップの実装手順
- 各設定ファイルの詳細説明
- コード実装のポイント
- 動作確認の方法

### 3. [技術仕様詳細](./03-technical-specifications.md)

- アーキテクチャの詳細
- TypeScript 設定の完全な説明
- Fastify 設定の詳細
- セキュリティとパフォーマンス仕様

### 4. [API 仕様書](./04-api-specification.md)

- 全エンドポイントの詳細仕様
- リクエスト・レスポンス形式
- エラーコード一覧
- 使用例とセキュリティ情報

### 5. [開発ガイド](./05-development-guide.md)

- 開発環境のセットアップ
- コーディング規約
- デバッグとトラブルシューティング
- テストとデプロイメント

## 🎯 学習の流れ

### 初心者向け

1. **プロジェクト概要** - プロジェクトの全体像を理解
2. **実装手順詳細** - 実際の実装手順を確認
3. **API 仕様書** - API の使用方法を学習

### 中級者向け

1. **技術仕様詳細** - 技術的な詳細を理解
2. **開発ガイド** - 開発のベストプラクティスを学習

### 上級者向け

- すべてのドキュメントを参照
- カスタマイズと拡張の実装
- 本番環境への適用

## 🔧 クイックスタート

### 1. プロジェクトのセットアップ

```bash
# リポジトリのクローン
git clone <repository-url>
cd fastify-typescript-api

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 2. API のテスト

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

### 3. 開発の開始

- [開発ガイド](./05-development-guide.md)を参照
- 新しい機能の追加方法を学習
- テストの作成方法を理解

## 📖 ドキュメントの活用方法

### 学習目的別

#### Fastify の学習

- [実装手順詳細](./02-implementation-steps.md)のステップ 7-8
- [技術仕様詳細](./03-technical-specifications.md)の Fastify 設定詳細
- [開発ガイド](./05-development-guide.md)の Fastify 規約

#### TypeScript の学習

- [実装手順詳細](./02-implementation-steps.md)のステップ 2, 4-5
- [技術仕様詳細](./03-technical-specifications.md)の TypeScript 設定詳細
- [開発ガイド](./05-development-guide.md)の TypeScript 規約

#### API 設計の学習

- [API 仕様書](./04-api-specification.md)全体
- [実装手順詳細](./02-implementation-steps.md)のステップ 7
- [開発ガイド](./05-development-guide.md)のセキュリティ

#### セキュリティの学習

- [技術仕様詳細](./03-technical-specifications.md)のセキュリティ仕様
- [API 仕様書](./04-api-specification.md)のセキュリティセクション
- [開発ガイド](./05-development-guide.md)のセキュリティ

### 実装段階別

#### 初期設定

1. [プロジェクト概要](./01-project-overview.md)
2. [実装手順詳細](./02-implementation-steps.md)のステップ 1-3

#### 基本実装

1. [実装手順詳細](./02-implementation-steps.md)のステップ 4-8
2. [API 仕様書](./04-api-specification.md)の確認

#### 拡張開発

1. [開発ガイド](./05-development-guide.md)の参照
2. [技術仕様詳細](./03-technical-specifications.md)の理解

#### 本番運用

1. [開発ガイド](./05-development-guide.md)のデプロイメント
2. [技術仕様詳細](./03-technical-specifications.md)の本番環境設定

## 🚀 次のステップ

このプロジェクトを基盤として、以下の機能を追加することで学習を深めることができます：

### データベース連携

- PostgreSQL + Prisma
- MongoDB + Mongoose
- Redis + キャッシュ

### 認証・認可

- JWT 認証
- OAuth2.0
- Role-based Access Control

### テスト

- Jest + Supertest
- E2E テスト
- パフォーマンステスト

### インフラ

- Docker 化
- CI/CD 設定
- クラウドデプロイ

## 📝 ドキュメントの更新

このドキュメントは継続的に更新されます。新しい機能や改善点があれば、対応するドキュメントを更新してください。

### 更新のポイント

- 実装内容とドキュメントの整合性
- 最新のベストプラクティスの反映
- 学習者のフィードバックの反映

## 🤝 貢献

このドキュメントの改善提案やバグ報告は歓迎します。以下の点についてフィードバックをお寄せください：

- 分かりにくい部分
- 不足している情報
- 技術的な誤り
- 改善提案

---

**Happy Coding! 🎉**
