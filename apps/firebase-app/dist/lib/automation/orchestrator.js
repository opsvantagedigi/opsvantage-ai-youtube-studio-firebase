/**
 * Automation Orchestrator
 * Coordinates the full flow: prompt → script → voice → visuals → render → upload → analytics.
 */
import { createPrompt } from './promptEngine.js';
import { generateScript } from './scriptGenerator.js';
import { synthesizeVoice } from './voiceoverEngine.js';
import { composeVisuals } from './visualComposer.js';
import { renderVideo } from './videoRenderer.js';
import { uploadToYouTube } from './uploader.js';
import { getAnalytics } from './analyticsTracker.js';
export async function runVideoAutomationPipeline(input) {
    console.log('Starting pipeline...');
    const prompt = createPrompt(input);
    const script = generateScript(prompt);
    const audio = synthesizeVoice(script.body, { provider: 'mock', voice: 'default' });
    const visuals = composeVisuals(script.body);
    const video = renderVideo({ script: script.body, visuals, audio });
    const uploadResult = uploadToYouTube(video, {
        apiKey: 'YOUTUBE_API_KEY',
        metadata: {},
        thumbnail: '',
    });
    const analytics = getAnalytics('mockVideoId');
    return { prompt, script, audio, visuals, video, uploadResult, analytics };
}
//# sourceMappingURL=orchestrator.js.map