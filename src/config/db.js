import mysql from 'mysql2/promise';
import { readFileSync } from 'node:fs';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
});

// to handle the case when the app starts before the DB is ready, we can add a retry mechanism.
export async function initDB() {
  const maxRetries = 10;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const schema = readFileSync('./src/schema/schema.sql', 'utf8');
      const statements = schema
        .split('\n')
        .filter((line) => !line.trim().startsWith('--') && line.trim() !== '')
        .join('\n')
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        await pool.query(statement);
      }

      console.log('Database schema initialized');
      return;
    } catch (err) {
      if (err.code === 'ECONNREFUSED' && attempt < maxRetries) {
        console.log(`DB not ready, retrying in 3s... (attempt ${attempt}/${maxRetries})`);
        await delay(3000);
      } else {
        throw err;
      }
    }
  }
}

export default pool;
