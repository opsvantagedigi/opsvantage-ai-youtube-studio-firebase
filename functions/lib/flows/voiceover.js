"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVoiceoverFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const admin = __importStar(require("firebase-admin"));
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
class TTSService {
    constructor(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
        if (!this.apiKey) {
            throw new Error(`${this.provider.toUpperCase()} API key is required`);
        }
    }
    async generateSpeech(text, voiceId) {
        switch (this.provider) {
            case 'elevenlabs':
                return this.generateWithElevenLabs(text, voiceId);
            case 'playht':
                return this.generateWithPlayHT(text, voiceId);
            case 'openai':
                return this.generateWithOpenAI(text, voiceId);
            default:
                throw new Error(`Unsupported TTS provider: ${this.provider}`);
        }
    }
    async generateWithElevenLabs(text, voiceId = 'default') {
        // In a real implementation, we would call ElevenLabs API
        console.log(`Generating speech with ElevenLabs for text: ${text.substring(0, 50)}...`);
        // Mock API call to ElevenLabs
        // const response = await axios.post(
        //   `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        //   {
        //     text: text,
        //     voice_settings: {
        //       stability: 0.5,
        //       similarity_boost: 0.5,
        //     },
        //   },
        //   {
        //     headers: {
        //       'xi-api-key': this.apiKey,
        //       'Content-Type': 'application/json',
        //     },
        //     responseType: 'stream',
        //   }
        // );
        // For demo purposes, return a mock audio URL
        return {
            audioUrl: `gs://mock-bucket/elevenlabs-${Date.now()}.mp3`,
            duration: text.split(' ').length / 3, // Rough estimate: 3 words per second
        };
    }
    async generateWithPlayHT(text, voiceId = 'default') {
        // In a real implementation, we would call Play.ht API
        console.log(`Generating speech with Play.ht for text: ${text.substring(0, 50)}...`);
        // Mock API call to Play.ht
        // const response = await axios.post(
        //   'https://play.ht/api/v2/tts/stream',
        //   {
        //     text: text,
        //     voice: voiceId,
        //     speed: 1.0,
        //     preset: 'balanced',
        //   },
        //   {
        //     headers: {
        //       'Authorization': `Bearer ${this.apiKey}`,
        //       'Content-Type': 'application/json',
        //     },
        //   }
        // );
        // For demo purposes, return a mock audio URL
        return {
            audioUrl: `gs://mock-bucket/playht-${Date.now()}.mp3`,
            duration: text.split(' ').length / 3, // Rough estimate: 3 words per second
        };
    }
    async generateWithOpenAI(text, voiceId = 'default') {
        // In a real implementation, we would call OpenAI TTS API
        console.log(`Generating speech with OpenAI for text: ${text.substring(0, 50)}...`);
        // Mock API call to OpenAI
        // const response = await axios.post(
        //   'https://api.openai.com/v1/audio/speech',
        //   {
        //     model: 'tts-1',
        //     input: text,
        //     voice: voiceId || 'alloy',
        //   },
        //   {
        //     headers: {
        //       'Authorization': `Bearer ${this.apiKey}`,
        //       'Content-Type': 'application/json',
        //     },
        //     responseType: 'stream',
        //   }
        // );
        // For demo purposes, return a mock audio URL
        return {
            audioUrl: `gs://mock-bucket/openai-tts-${Date.now()}.mp3`,
            duration: text.split(' ').length / 3, // Rough estimate: 3 words per second
        };
    }
}
exports.generateVoiceoverFlow = (0, flow_1.defineFlow)({
    name: 'generateVoiceover',
    inputSchema: z.object({
        scriptId: z.string(),
        voiceProfile: z.string().optional().default('default'),
        provider: z.enum(['elevenlabs', 'playht', 'openai']).optional().default('openai')
    }),
    outputSchema: z.object({
        audioPath: z.string(),
        duration: z.number(),
    }),
    authPolicy: (auth, input) => { },
}, async (input) => {
    // Fetch script from Firestore
    const scriptDoc = await db.collection('scripts').doc(input.scriptId).get();
    if (!scriptDoc.exists) {
        throw new Error(`Script with ID ${input.scriptId} not found`);
    }
    const scriptData = scriptDoc.data();
    if (!scriptData) {
        throw new Error(`Script data not found for ID ${input.scriptId}`);
    }
    // Get TTS configuration from Firestore
    const configDoc = await db.collection('integrationConfigs').doc('global').get();
    let ttsApiKey = process.env.TTS_API_KEY || '';
    let provider = input.provider;
    if (configDoc.exists) {
        const config = configDoc.data();
        if (config?.tts?.apiKey) {
            ttsApiKey = config.tts.apiKey;
        }
        if (config?.tts?.provider) {
            provider = config.tts.provider;
        }
    }
    // Initialize TTS service
    const ttsService = new TTSService(provider, ttsApiKey);
    try {
        // Extract the voice text from the script
        // For now, we'll use the entire script text
        // In a real implementation, we might use the scene breakdown
        const scriptText = scriptData.scriptText;
        // Generate voiceover
        const ttsResult = await ttsService.generateSpeech(scriptText, input.voiceProfile);
        // Update video record with voiceover path
        // We need to find the video associated with this script
        const videoDocs = await db.collection('videos').where('scriptId', '==', input.scriptId).limit(1).get();
        if (!videoDocs.empty) {
            const videoDoc = videoDocs.docs[0];
            await videoDoc.ref.update({
                voiceoverPath: ttsResult.audioUrl,
                status: 'voiceover_generated',
                updatedAt: new Date().toISOString(),
            });
        }
        console.log(`Generated voiceover for script: ${input.scriptId}`);
        return {
            audioPath: ttsResult.audioUrl,
            duration: ttsResult.duration,
        };
    }
    catch (error) {
        console.error('Error generating voiceover:', error);
        // Update video status to failed
        const videoDocs = await db.collection('videos').where('scriptId', '==', input.scriptId).limit(1).get();
        if (!videoDocs.empty) {
            const videoDoc = videoDocs.docs[0];
            await videoDoc.ref.update({
                status: 'failed',
                updatedAt: new Date().toISOString(),
            });
        }
        throw error;
    }
});
