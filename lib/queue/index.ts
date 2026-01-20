import Bull from 'bull';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const createQueue = (name: string) => new Bull(name, redisUrl);
