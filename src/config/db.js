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

export async function initDB() {
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
}

export default pool;
