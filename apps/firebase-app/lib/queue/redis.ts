import { RedisOptions } from 'ioredis'

const isProd = process.env.NODE_ENV === 'production'

export const redisConnection: RedisOptions = isProd
  ? {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    }
  : {
      host: '127.0.0.1',
      port: 6379,
    }
