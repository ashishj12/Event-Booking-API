import pool from './config/db.js';

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('DB Connected Successfully!');
    connection.release();
  } catch (err) {
    console.error('DB Connection Error:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
