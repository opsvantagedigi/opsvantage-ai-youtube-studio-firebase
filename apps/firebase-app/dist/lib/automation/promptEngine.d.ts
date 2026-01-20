/**
 * Prompt Engine
 * Accepts structured input for video automation.
 */
export interface PromptInput {
    topic: string;
    tone: string;
    audience: string;
    length: string;
    cta: string;
    style: string;
    brandVoice: string;
}
export declare function createPrompt(input: PromptInput): string;
//# sourceMappingURL=promptEngine.d.ts.map