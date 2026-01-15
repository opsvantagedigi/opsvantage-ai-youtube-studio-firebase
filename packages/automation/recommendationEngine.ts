/**
 * Recommendation Engine
 * Suggests next topics, series ideas, thumbnail/script improvements (stub).
 */

import { logUsageEvent } from '../common/logUsageEvent.js'

export function getRecommendations(history: any[]): string[] {
  void history
  return ['Try a new series on AI', 'Experiment with thumbnails']
}

export async function getRecommendationsWithLogging(
  history: any[],
  userId?: string,
): Promise<string[]> {
  const recs = getRecommendations(history)
  if (userId) {
    await logUsageEvent(userId, 'recommendation_generation', 1)
  }
  return recs
}
