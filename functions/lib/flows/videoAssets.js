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
exports.generateVideoAssetsFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const admin = __importStar(require("firebase-admin"));
const video_generation_service_1 = require("../services/video-generation.service");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.generateVideoAssetsFlow = (0, flow_1.defineFlow)({
    name: 'generateVideoAssets',
    inputSchema: z.object({
        scriptId: z.string(),
        style: z.string().optional().default('cinematic'),
        provider: z.enum(['pika', 'runway', 'd-id']).optional().default('pika')
    }),
    outputSchema: z.object({
        clipPaths: z.array(z.string()),
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
    // Get video generation configuration from Firestore
    // This could be stored in a global config or per-project config
    const configDoc = await db.collection('integrationConfigs').doc('global').get();
    let videoApiKey = process.env.VIDEO_GENERATION_API_KEY || '';
    let provider = input.provider;
    if (configDoc.exists) {
        const config = configDoc.data();
        if (config?.video?.apiKey) {
            videoApiKey = config.video.apiKey;
        }
        if (config?.video?.provider) {
            provider = config.video.provider;
        }
    }
    // Initialize video generation service
    const videoGenService = new video_generation_service_1.VideoGenerationService({
        provider,
        apiKey: videoApiKey,
    });
    try {
        // Generate video from script
        const videoPath = await videoGenService.generateVideoFromScript(input.scriptId, input.style);
        // In a real implementation, we might split the video into clips
        // For now, we'll return the single video as a clip
        const clipPaths = [videoPath];
        // Update video record with generated asset path
        // We need to find the video associated with this script
        const videoDocs = await db.collection('videos').where('scriptId', '==', input.scriptId).limit(1).get();
        if (!videoDocs.empty) {
            const videoDoc = videoDocs.docs[0];
            await videoDoc.ref.update({
                videoPath: videoPath,
                status: 'assets_generated',
                updatedAt: new Date().toISOString(),
            });
        }
        console.log(`Generated video assets for script: ${input.scriptId}`);
        return {
            clipPaths,
        };
    }
    catch (error) {
        console.error('Error generating video assets:', error);
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
