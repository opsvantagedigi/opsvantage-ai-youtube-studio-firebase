// Type definitions for logUsageEvent.js
// This file allows TypeScript to recognize the module and its exports.

declare type UsageEventType = 'api_call' | 'engine_run' | 'job_trigger' | 'stage_event'

declare function logUsageEvent(
  userId: string,
  eventType: UsageEventType,
  count: number,
  metadata?: Record<string, any>,
): Promise<void>

declare class UsageEventStore {
  addEvent(
    userId: string,
    eventType: UsageEventType,
    count: number,
    metadata?: Record<string, any>,
  ): Promise<void>
}

declare module '../common/logUsageEvent.js' {
  export { logUsageEvent, UsageEventStore }
}
