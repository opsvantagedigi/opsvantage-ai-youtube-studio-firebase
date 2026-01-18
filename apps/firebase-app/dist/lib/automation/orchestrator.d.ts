/**
 * Automation Orchestrator
 * Coordinates the full flow: prompt → script → voice → visuals → render → upload → analytics.
 */
import { type PromptInput } from './promptEngine.js';
export declare function runVideoAutomationPipeline(input: PromptInput): Promise<{
    prompt: string;
    script: import("./scriptGenerator.js").ScriptSections;
    audio: Buffer<ArrayBufferLike>;
    visuals: import("./visualComposer.js").VisualAsset[];
    video: Buffer<ArrayBufferLike>;
    uploadResult: boolean;
    analytics: Record<string, any>;
}>;
//# sourceMappingURL=orchestrator.d.ts.map