export class ContextMemoryEngine {
    memory = {
        pastTopics: [],
        performance: [],
        brandRules: [],
        voiceConsistency: '',
    };
    store(context) {
        this.memory = context;
    }
    retrieve() {
        return this.memory;
    }
}
//# sourceMappingURL=contextMemoryEngine.js.map