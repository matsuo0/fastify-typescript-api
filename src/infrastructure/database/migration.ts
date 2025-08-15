import Database from 'better-sqlite3';
import path from 'path';

// データベースファイルのパス
const dbPath = path.join(__dirname, '../../../data/users.db');
const backupPath = path.join(__dirname, '../../../data/users.db.backup');

export const migrateDatabase = () => {
  try {
    console.log('🔄 データベース移行を開始します...');
    
    // バックアップファイルが存在するかチェック
    const backupDb = new Database(backupPath);
    
    // 新しいデータベースに接続
    const newDb = new Database(dbPath);
    
    // 既存のテーブルを削除
    newDb.exec('DROP TABLE IF EXISTS users');
    
    // 新しいテーブル構造でテーブルを作成
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER,
        phone TEXT,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
      )
    `;
    
    newDb.exec(createUsersTable);
    
    // 既存データを取得
    const oldUsers = backupDb.prepare(`
      SELECT 
        id,
        name,
        email,
        age,
        phone,
        created_at,
        updated_at
      FROM users
    `).all() as any[];
    
    console.log(`📊 ${oldUsers.length}件のユーザーデータを移行します...`);
    
    // データを新しい構造に移行
    const insertStmt = newDb.prepare(`
      INSERT INTO users (id, name, email, age, phone, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    let migratedCount = 0;
    for (const user of oldUsers) {
      try {
        // IDを文字列に変換（既存はINTEGER、新構造はTEXT）
        const newId = user.id.toString();
        
        insertStmt.run(
          newId,
          user.name,
          user.email,
          user.age || null,
          user.phone || null,
          user.created_at,
          user.updated_at
        );
        
        migratedCount++;
      } catch (error) {
        console.error(`❌ ユーザー ${user.id} の移行に失敗:`, error);
      }
    }
    
    console.log(`✅ ${migratedCount}件のユーザーデータを移行しました`);
    
    // データベースをクローズ
    backupDb.close();
    newDb.close();
    
    console.log('✅ データベース移行が完了しました');
    
  } catch (error) {
    console.error('❌ データベース移行エラー:', error);
    throw error;
  }
};

// 移行の実行
if (require.main === module) {
  migrateDatabase();
}
