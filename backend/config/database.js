// database.js
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,                      // max clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  console.log('✅ New client connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Simple wrapper for parameterized queries — always use $1, $2... placeholders
export const query = (text, params) => pool.query(text, params);

// For transactions (e.g. INSERT message + broadcast must be consistent)
export const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release.bind(client);

  // Optional: timeout safeguard so a forgotten release() doesn't hang forever
  const timeout = setTimeout(() => {
    console.error('⚠️ A client has been checked out for too long.');
  }, 5000);

  client.release = () => {
    clearTimeout(timeout);
    client.query = originalQuery;
    client.release = originalRelease;
    return originalRelease();
  };

  return client;
};

// Quick health check on boot
export const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('📦 DB connection OK:', res.rows[0].now);
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
};

export { pool };