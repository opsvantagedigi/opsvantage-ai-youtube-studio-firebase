import { Queue } from 'bullmq';
import { connection } from './redis.js';

const isProd = process.env.NODE_ENV === 'production';

// A simple mock queue that does nothing.
const mockQueue = {
  add: async (name: string, data: any) => {
    console.log(`Mock queue: Adding job '${name}' with data:`, data);
    return Promise.resolve();
  },
  process: async (processor: any) => {
    console.log('Mock queue: processing job.');
  }
};

export const createQueue = (name: string) => {
  if (isProd) {
    return new Queue(name, { connection });
  } else {
    // Return the mock queue for non-production environments.
    return mockQueue as any;
  }
};
