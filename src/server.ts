import { createApp } from './app.js';
import { connectWithRetry, closePool } from './database/connection.js';
import { connectRedisWithRetry, closeRedisClient } from './configs/redis.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectWithRetry();
    const redisSessionStore = await connectRedisWithRetry();
    const app = createApp(redisSessionStore);

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    async function shutdown() {
      console.log('Shutting down gracefully...');
      server.close();
      await closeRedisClient();
      await closePool();
      process.exit(0);
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    // Ensure process exits if DB never connects
    await closeRedisClient().catch(() => {});
    await closePool().catch(() => {});
    process.exit(1);
  }
}

start();