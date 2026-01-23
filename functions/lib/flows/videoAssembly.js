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
exports.assembleFinalVideoFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const admin = __importStar(require("firebase-admin"));
const video_editing_service_1 = require("../services/video-editing.service");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.assembleFinalVideoFlow = (0, flow_1.defineFlow)({
    name: 'assembleFinalVideo',
    inputSchema: z.object({
        videoId: z.string()
    }),
    outputSchema: z.object({
        finalVideoPath: z.string(),
    }),
    authPolicy: (auth, input) => { },
}, async (input) => {
    // Fetch video record from Firestore
    const videoDoc = await db.collection('videos').doc(input.videoId).get();
    if (!videoDoc.exists) {
        throw new Error(`Video with ID ${input.videoId} not found`);
    }
    const videoData = videoDoc.data();
    if (!videoData) {
        throw new Error(`Video data not found for ID ${input.videoId}`);
    }
    // Get the video clips and audio path
    // In a real implementation, these would be stored in the video record
    const clips = videoData.clipPaths || [];
    const audioPath = videoData.voiceoverPath; // Assuming this is where the voiceover is stored
    if (!audioPath) {
        throw new Error(`Audio path not found for video ${input.videoId}`);
    }
    // Initialize video editing service
    const videoEditService = new video_editing_service_1.VideoEditingService();
    try {
        // Assemble the final video
        const outputPath = `gs://final-videos-bucket/${input.videoId}_final.mp4`;
        const finalVideoPath = await videoEditService.assembleVideo(clips, audioPath, outputPath);
        // Update video record with final video path
        await videoDoc.ref.update({
            videoPath: finalVideoPath, // Update the main video path to the final version
            status: 'ready',
            updatedAt: new Date().toISOString(),
        });
        console.log(`Assembled final video for video ID: ${input.videoId}`);
        return {
            finalVideoPath,
        };
    }
    catch (error) {
        console.error('Error assembling final video:', error);
        // Update video status to failed
        await videoDoc.ref.update({
            status: 'failed',
            updatedAt: new Date().toISOString(),
        });
        throw error;
    }
});
