/**
 * Script Generator
 * Generates YouTube-ready scripts from prompt.
 */
export interface ScriptSections {
    hook: string;
    intro: string;
    body: string;
    cta: string;
    title: string;
    description: string;
    chapters: string[];
}
export declare function generateScript(prompt: string): ScriptSections;
//# sourceMappingURL=scriptGenerator.d.ts.map