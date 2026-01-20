export type JobStatus = 'created' | 'processing' | 'rendered' | 'uploaded' | 'failed';
export interface VideoJobCreate {
    prompt: string;
    tone?: string;
    length?: string;
    audience?: string;
    callToAction?: string;
}
export interface ScriptSegment {
    id: string;
    start: number;
    end: number;
    text: string;
}
export interface VideoJob {
    id: string;
    status: JobStatus;
    prompt: VideoJobCreate;
    script?: ScriptSegment[];
    audioSegments?: string[];
    visuals?: string[];
    renderPath?: string;
    youtubeId?: string;
    createdAt: string;
}
export interface UsageEvent {
    event: string;
    details: any;
}
//# sourceMappingURL=models.d.ts.map