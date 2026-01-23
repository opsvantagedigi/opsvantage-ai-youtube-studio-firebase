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
exports.handleYouTubeAuthCallbackFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const admin = __importStar(require("firebase-admin"));
const youtube_service_1 = require("../services/youtube.service");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.handleYouTubeAuthCallbackFlow = (0, flow_1.defineFlow)({
    name: 'handleYouTubeAuthCallback',
    inputSchema: z.object({
        code: z.string(),
        state: z.string(), // userId
    }),
    outputSchema: z.void(),
    authPolicy: (auth, input) => { },
}, async (input) => {
    const { code, state: userId } = input;
    const youtubeService = new youtube_service_1.YouTubeService();
    await youtubeService.processOAuthCallback(code, userId);
    // Update project with connected YouTube channel ID
    // First, get the user's default project
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    if (userData?.defaultProjectId) {
        const channelInfo = await youtubeService.getChannelInfo(userId);
        if (channelInfo?.id) {
            await db.collection('projects').doc(userData.defaultProjectId).update({
                connectedYouTubeChannelId: channelInfo.id,
            });
        }
    }
});
