import express, { Request, Response } from 'express';
import pool from './database/connection';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Database test endpoint
app.get('/api/test', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'FabricFlow API is running!',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      dbTime: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
