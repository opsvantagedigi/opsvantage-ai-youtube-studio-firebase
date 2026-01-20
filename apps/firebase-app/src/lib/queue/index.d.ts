import { Queue, Worker, QueueEvents } from 'bullmq';
export declare function createQueue(name: string): Queue<any, any, string, any, any, string>;
export declare function createWorker(name: string, processor: any): Worker<any, any, string>;
export declare function createQueueEvents(name: string): QueueEvents;
//# sourceMappingURL=index.d.ts.map