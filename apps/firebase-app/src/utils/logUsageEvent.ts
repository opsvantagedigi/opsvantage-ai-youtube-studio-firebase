import type { UsageEvent } from '../models.js';

export function logUsageEvent(event: UsageEvent) {
  // In a real app, this would send data to a logging service
  console.log('Usage Event:', event);
}
