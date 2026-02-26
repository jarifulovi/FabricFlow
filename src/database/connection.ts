import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export type Pool = pg.Pool;
export type PoolClient = pg.PoolClient;

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});


/**
 * Test the database connection with retry logic.
 */
export async function connectWithRetry(
  retries = 5,
  delayMs = 3000
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connected');
      return;
    } catch (err) {
      console.error(
        `DB connection failed (attempt ${attempt}/${retries})`
      );

      if (attempt === retries) {
        throw err;
      }

      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

/**
 * Gracefully close the pool
 */
export async function closePool() {
  await pool.end();
  console.log('Database pool closed');
}

export default pool;

