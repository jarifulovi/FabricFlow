import app from './app.js';
import { connectWithRetry, closePool } from './database/connection.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectWithRetry();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    async function shutdown() {
      console.log('Shutting down gracefully...');
      server.close();
      await closePool();
      process.exit(0);
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    // Ensure process exits if DB never connects
    await closePool().catch(() => {});
    process.exit(1);
  }
}

start();