import { Queue, Worker, QueueEvents } from 'bullmq'
import { redisConnection } from './redis'

export function createQueue(name: string) {
  return new Queue(name, { connection: redisConnection })
}

export function createWorker(name: string, processor: any) {
  return new Worker(name, processor, { connection: redisConnection })
}

export function createQueueEvents(name: string) {
  return new QueueEvents(name, { connection: redisConnection })
}
