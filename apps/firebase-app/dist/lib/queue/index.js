import { Queue } from 'bullmq';
import { connection } from './redis.js';
const isProd = process.env.NODE_ENV === 'production';
// A simple mock queue that does nothing.
const mockQueue = {
    add: async (name, data) => {
        console.log(`Mock queue: Adding job '${name}' with data:`, data);
        return Promise.resolve();
    },
    process: async (processor) => {
        console.log('Mock queue: processing job.');
    }
};
export const createQueue = (name) => {
    if (isProd) {
        return new Queue(name, { connection });
    }
    else {
        // Return the mock queue for non-production environments.
        return mockQueue;
    }
};
//# sourceMappingURL=index.js.map