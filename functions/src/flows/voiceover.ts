import { defineFlow } from '@genkit-ai/flow';
import * as z from 'zod';
import * as admin from 'firebase-admin';
import axios from 'axios';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// TTS Service interfaces
interface TTSAudioResponse {
  audioUrl: string;
  duration: number;
}

class TTSService {
  private apiKey: string;
  private provider: 'elevenlabs' | 'playht' | 'openai';

  constructor(provider: 'elevenlabs' | 'playht' | 'openai', apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;

    if (!this.apiKey) {
      throw new Error(`${this.provider.toUpperCase()} API key is required`);
    }
  }

  async generateSpeech(text: string, voiceId?: string): Promise<TTSAudioResponse> {
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

  private async generateWithElevenLabs(text: string, voiceId: string = 'default'): Promise<TTSAudioResponse> {
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

  private async generateWithPlayHT(text: string, voiceId: string = 'default'): Promise<TTSAudioResponse> {
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

  private async generateWithOpenAI(text: string, voiceId: string = 'default'): Promise<TTSAudioResponse> {
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

export const generateVoiceoverFlow = defineFlow(
  {
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
    authPolicy: (auth: any, input: any) => {},
  },
  async (input) => {
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
    let provider: 'elevenlabs' | 'playht' | 'openai' = input.provider;
    
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
    } catch (error) {
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
  }
);