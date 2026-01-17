import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10
});

try {
  const connection = await db.getConnection();
  console.log('✅ Terhubung ke MySQL Railway');
  connection.release();
} catch (error) {
  console.error('❌ Gagal konek ke MySQL Railway:', error);
}

export default db;