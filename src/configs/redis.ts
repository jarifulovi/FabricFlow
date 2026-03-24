import { RedisStore } from 'connect-redis';
import type { Store } from 'express-session';
import { createClient, type RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';
const REDIS_URL = process.env.REDIS_URL;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
const REDIS_DB = Number(process.env.REDIS_DB || 0);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_PREFIX = process.env.REDIS_PREFIX || 'sess:';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getRedisClient(): RedisClientType {
  if (REDIS_URL) {
    return createClient({
      url: REDIS_URL,
    });
  }

  return createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
    password: REDIS_PASSWORD,
    database: REDIS_DB,
  });
}

export async function createRedisSessionStore(): Promise<Store | undefined> {
  return connectRedisWithRetry();
}

export async function connectRedisWithRetry(
  retries = 5,
  delayMs = 3000
): Promise<Store | undefined> {
  if (!REDIS_ENABLED) {
    console.warn('Redis session store is disabled by REDIS_ENABLED=false');
    return undefined;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    const client = getRedisClient();
    client.on('error', (error) => {
      console.error('Redis client error:', error);
    });

    try {
      await client.connect();
      await client.ping();
      redisClient = client;
      console.log('Redis connected for session store');

      return new RedisStore({
        client: redisClient,
        prefix: REDIS_PREFIX,
      });
    } catch (error) {
      console.error(
        `Redis connection failed (attempt ${attempt}/${retries})`
      );

      if (client.isOpen) {
        await client.quit().catch(() => {});
      } else {
        client.destroy();
      }

      if (attempt === retries) {
        throw error;
      }

      await wait(delayMs);
    }
  }

  return undefined;
}

export async function closeRedisClient(): Promise<void> {
  if (!redisClient || !redisClient.isOpen) {
    return;
  }

  await redisClient.quit();
}
