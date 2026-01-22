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
exports.ScriptSchema = void 0;
const z = __importStar(require("zod"));
exports.ScriptSchema = z.object({
    projectId: z.string(),
    videoId: z.string(),
    scriptText: z.string(),
    sceneBreakdown: z.array(z.object({
        timestamp: z.string(),
        description: z.string(),
        voiceText: z.string(),
    })),
    seoMetadata: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        chapters: z.array(z.object({
            timestamp: z.string(),
            title: z.string(),
        })),
        hashtags: z.array(z.string()),
    }),
    thumbnailConcepts: z.array(z.object({
        headline: z.string(),
        visualDescription: z.string(),
        emotion: z.string(),
        colors: z.string(),
    })),
    createdAt: z.string(),
    updatedAt: z.string(),
});
//# sourceMappingURL=script.js.map