import { Queue, Worker, QueueEvents } from 'bullmq';
import { redisConnection } from './redis';
export function createQueue(name) {
    return new Queue(name, { connection: redisConnection });
}
export function createWorker(name, processor) {
    return new Worker(name, processor, { connection: redisConnection });
}
export function createQueueEvents(name) {
    return new QueueEvents(name, { connection: redisConnection });
}
//# sourceMappingURL=index.js.map