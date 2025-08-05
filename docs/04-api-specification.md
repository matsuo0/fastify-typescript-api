# API 仕様書

## 概要

この API は、Fastify と TypeScript を使用した学習用 RESTful API です。ユーザー管理機能とヘルスチェック機能を提供します。

## ベース URL

```
http://localhost:3000/api
```

## 共通レスポンス形式

### 成功レスポンス

```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  },
  "message": "操作が成功しました"
}
```

### エラーレスポンス

```json
{
  "success": false,
  "error": "エラーメッセージ",
  "details": {
    // バリデーションエラーの詳細（オプション）
  }
}
```

## エンドポイント一覧

### ヘルスチェック

#### GET /health

基本的なヘルスチェックを実行します。

**レスポンス:**

```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-08-05T12:15:06.138Z",
    "uptime": 5.89613975
  },
  "message": "Health check successful"
}
```

**ステータスコード:** 200

---

#### GET /health/detailed

詳細なヘルスチェックを実行します。

**レスポンス:**

```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-08-05T12:15:06.138Z",
    "uptime": 5.89613975,
    "memory": {
      "rss": 12345678,
      "heapTotal": 9876543,
      "heapUsed": 5432109,
      "external": 123456
    },
    "version": "v18.17.0",
    "platform": "darwin"
  },
  "message": "Detailed health check successful"
}
```

**ステータスコード:** 200

---

### ユーザー管理

#### GET /users

ユーザー一覧を取得します。

**レスポンス:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1754396125867",
      "name": "田中太郎",
      "email": "tanaka@example.com",
      "createdAt": "2025-08-05T12:15:25.867Z",
      "updatedAt": "2025-08-05T12:15:25.867Z"
    }
  ],
  "message": "Users retrieved successfully"
}
```

**ステータスコード:** 200

---

#### GET /users/:id

特定のユーザーを取得します。

**パラメータ:**

- `id` (string): ユーザー ID

**レスポンス:**

```json
{
  "success": true,
  "data": {
    "id": "1754396125867",
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "createdAt": "2025-08-05T12:15:25.867Z",
    "updatedAt": "2025-08-05T12:15:25.867Z"
  },
  "message": "User retrieved successfully"
}
```

**ステータスコード:** 200

**エラーケース:**

```json
{
  "success": false,
  "error": "User not found"
}
```

**ステータスコード:** 404

---

#### POST /users

新しいユーザーを作成します。

**リクエストボディ:**

```json
{
  "name": "田中太郎",
  "email": "tanaka@example.com"
}
```

**バリデーション:**

- `name`: 必須、文字列、最小長 1 文字
- `email`: 必須、有効なメールアドレス形式

**レスポンス:**

```json
{
  "success": true,
  "data": {
    "id": "1754396125867",
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "createdAt": "2025-08-05T12:15:25.867Z",
    "updatedAt": "2025-08-05T12:15:25.867Z"
  },
  "message": "User created successfully"
}
```

**ステータスコード:** 201

**エラーケース:**

```json
{
  "success": false,
  "error": "Email already exists"
}
```

**ステータスコード:** 409

**バリデーションエラー:**

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "keyword": "required",
      "dataPath": "",
      "schemaPath": "#/required",
      "params": {
        "missingProperty": "name"
      },
      "message": "should have required property 'name'"
    }
  ]
}
```

**ステータスコード:** 400

---

#### PUT /users/:id

ユーザー情報を更新します。

**パラメータ:**

- `id` (string): ユーザー ID

**リクエストボディ:**

```json
{
  "name": "田中次郎",
  "email": "tanaka2@example.com"
}
```

**バリデーション:**

- `name`: 必須、文字列、最小長 1 文字
- `email`: 必須、有効なメールアドレス形式

**レスポンス:**

```json
{
  "success": true,
  "data": {
    "id": "1754396125867",
    "name": "田中次郎",
    "email": "tanaka2@example.com",
    "createdAt": "2025-08-05T12:15:25.867Z",
    "updatedAt": "2025-08-05T12:15:30.123Z"
  },
  "message": "User updated successfully"
}
```

**ステータスコード:** 200

**エラーケース:**

```json
{
  "success": false,
  "error": "User not found"
}
```

**ステータスコード:** 404

```json
{
  "success": false,
  "error": "Email already exists"
}
```

**ステータスコード:** 409

---

#### DELETE /users/:id

ユーザーを削除します。

**パラメータ:**

- `id` (string): ユーザー ID

**レスポンス:**

```json
{
  "success": true,
  "data": {
    "id": "1754396125867",
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "createdAt": "2025-08-05T12:15:25.867Z",
    "updatedAt": "2025-08-05T12:15:25.867Z"
  },
  "message": "User deleted successfully"
}
```

**ステータスコード:** 200

**エラーケース:**

```json
{
  "success": false,
  "error": "User not found"
}
```

**ステータスコード:** 404

---

## エラーコード一覧

| ステータスコード | エラー種別            | 説明                   |
| ---------------- | --------------------- | ---------------------- |
| 200              | Success               | 正常なレスポンス       |
| 201              | Created               | リソース作成成功       |
| 400              | Bad Request           | リクエスト形式エラー   |
| 404              | Not Found             | リソースが見つからない |
| 409              | Conflict              | リソース競合           |
| 500              | Internal Server Error | サーバー内部エラー     |

## 使用例

### cURL コマンド例

**ヘルスチェック:**

```bash
curl http://localhost:3000/api/health
```

**ユーザー作成:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "田中太郎",
    "email": "tanaka@example.com"
  }'
```

**ユーザー一覧取得:**

```bash
curl http://localhost:3000/api/users
```

**特定ユーザー取得:**

```bash
curl http://localhost:3000/api/users/1754396125867
```

**ユーザー更新:**

```bash
curl -X PUT http://localhost:3000/api/users/1754396125867 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "田中次郎",
    "email": "tanaka2@example.com"
  }'
```

**ユーザー削除:**

```bash
curl -X DELETE http://localhost:3000/api/users/1754396125867
```

### JavaScript/TypeScript 例

**fetch API 使用:**

```javascript
// ユーザー作成
const createUser = async (userData) => {
  const response = await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// 使用例
const newUser = await createUser({
  name: "田中太郎",
  email: "tanaka@example.com",
});
```

## セキュリティ

### CORS 設定

- 開発環境: すべてのオリジンを許可
- 本番環境: 特定ドメインのみ許可

### セキュリティヘッダー

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

### 入力バリデーション

- JSON Schema による型チェック
- 文字列長制限
- メールアドレス形式チェック
- 必須フィールドチェック

## パフォーマンス

### レスポンス時間

- ヘルスチェック: < 10ms
- ユーザー操作: < 50ms

### 同時接続数

- 開発環境: 制限なし
- 本番環境: 設定による制限

## 制限事項

### データ永続化

- 現在はメモリ内ストレージ
- サーバー再起動時にデータが消失
- 本番環境ではデータベース連携が必要

### 認証・認可

- 現在は認証機能なし
- 本番環境では JWT 等の認証が必要

### レート制限

- 現在はレート制限なし
- 本番環境では適切な制限が必要
