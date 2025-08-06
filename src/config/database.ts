import Database from 'better-sqlite3';
import path from 'path';

// データベースファイルのパス
const dbPath = path.join(__dirname, '../../data/users.db');

// データベースインスタンス
let db: Database.Database;

// データベースの初期化
export const initializeDatabase = () => {
  try {
    // データベースファイルを作成（存在しない場合）
    db = new Database(dbPath);
    
    // テーブルの作成
    createTables();
    
    console.log('✅ データベースが正常に初期化されました');
    return db;
  } catch (error) {
    console.error('❌ データベース初期化エラー:', error);
    throw error;
  }
};

// テーブルの作成
const createTables = () => {
  // ユーザーテーブルの作成
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INTEGER,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.exec(createUsersTable);
  console.log('✅ ユーザーテーブルが作成されました');
};

// データベースインスタンスの取得
export const getDatabase = () => {
  if (!db) {
    throw new Error('データベースが初期化されていません');
  }
  return db;
};

// データベースのクローズ
export const closeDatabase = () => {
  if (db) {
    db.close();
    console.log('✅ データベースが正常にクローズされました');
  }
}; 