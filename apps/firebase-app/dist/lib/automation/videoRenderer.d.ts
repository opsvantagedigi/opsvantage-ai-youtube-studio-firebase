/**
 * Video Renderer
 * Assembles timeline: voice, visuals, transitions, captions, music (stub).
 */
export interface RenderInput {
    script: string;
    visuals: any[];
    audio: Buffer;
}
export declare function renderVideo(input: RenderInput): Buffer;
//# sourceMappingURL=videoRenderer.d.ts.map