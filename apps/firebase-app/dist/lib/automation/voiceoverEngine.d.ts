/**
 * Voiceover Engine
 * Abstraction for TTS providers (stub).
 */
export interface VoiceoverConfig {
    provider: 'elevenlabs' | 'playht' | 'azure' | 'mock';
    voice: string;
    pace?: string;
    emotion?: string;
    pronunciation?: Record<string, string>;
}
export declare function synthesizeVoice(text: string, config: VoiceoverConfig): Buffer;
//# sourceMappingURL=voiceoverEngine.d.ts.map