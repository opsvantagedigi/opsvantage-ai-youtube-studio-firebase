/**
 * Context Memory Engine
 * Stores and retrieves past topics, performance, brand rules, and voice consistency.
 */
export interface ContextMemory {
  pastTopics: string[]
  performance: Record<string, any>[]
  brandRules: string[]
  voiceConsistency: string
}

export class ContextMemoryEngine {
  private memory: ContextMemory = {
    pastTopics: [],
    performance: [],
    brandRules: [],
    voiceConsistency: '',
  }

  store(context: ContextMemory) {
    this.memory = context
  }

  retrieve(): ContextMemory {
    return this.memory
  }
}
