/**
 * Uploader
 * Abstraction for YouTube upload (stub).
 */
export interface UploadConfig {
    apiKey: string;
    metadata: Record<string, any>;
    thumbnail: string;
    schedule?: string;
}
export declare function uploadToYouTube(video: Buffer, config: UploadConfig): boolean;
//# sourceMappingURL=uploader.d.ts.map