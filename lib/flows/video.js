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
exports.renderVideoFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const video_1 = require("../models/video");
const admin = __importStar(require("firebase-admin"));
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Mock Video Generation API call
async function generateVideoFromScript(scriptText) {
    console.log(`Generating video from script: ${scriptText.substring(0, 100)}...`);
    // In a real application, you would make an API call to a video generation service here.
    // This is a mock implementation.
    const videoUrl = `https://example.com/video_${Math.random().toString(36).substring(2, 12)}.mp4`;
    return videoUrl;
}
exports.renderVideoFlow = (0, flow_1.defineFlow)({
    name: 'renderVideo',
    inputSchema: z.object({ scriptId: z.string() }),
    outputSchema: video_1.VideoSchema,
}, async (input) => {
    const scriptDoc = await db.collection('scripts').doc(input.scriptId).get();
    const scriptData = scriptDoc.data();
    if (!scriptData) {
        throw new Error('Script not found');
    }
    const videoUrl = await generateVideoFromScript(scriptData.scriptText);
    const video = {
        projectId: scriptData.projectId,
        planItemId: null,
        title: scriptData.seoMetadata.title,
        status: 'ready',
        scriptId: input.scriptId,
        voiceoverPath: null,
        videoPath: videoUrl,
        thumbnailPath: null,
        youtubeVideoId: null,
        publishedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    // Save the video to Firestore
    await db.collection('videos').add(video);
    return video;
});
//# sourceMappingURL=video.js.map