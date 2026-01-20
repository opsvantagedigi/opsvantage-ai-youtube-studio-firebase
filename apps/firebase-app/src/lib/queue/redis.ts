import type { RedisOptions } from 'ioredis';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST is not defined in the environment variables.');
  }
  if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT is not defined in the environment variables.');
  }
  if (!process.env.REDIS_PASSWORD) {
    throw new Error('REDIS_PASSWORD is not defined in the environment variables.');
  }
}

export const connection: RedisOptions = isProd
  ? {
      host: process.env.REDIS_HOST!,
      port: Number(process.env.REDIS_PORT!),
      password: process.env.REDIS_PASSWORD!,
    }
  : {};
