/**
 * Context Memory Engine
 * Stores and retrieves past topics, performance, brand rules, and voice consistency.
 */
export interface ContextMemory {
    pastTopics: string[];
    performance: Record<string, any>[];
    brandRules: string[];
    voiceConsistency: string;
}
export declare class ContextMemoryEngine {
    private memory;
    store(context: ContextMemory): void;
    retrieve(): ContextMemory;
}
//# sourceMappingURL=contextMemoryEngine.d.ts.map