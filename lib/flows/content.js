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
exports.generateScriptFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const googleai_1 = require("@genkit-ai/googleai");
const ai_1 = require("@genkit-ai/ai");
const script_1 = require("../models/script");
exports.generateScriptFlow = (0, flow_1.defineFlow)({
    name: 'generateScript',
    inputSchema: z.object({ topic: z.string(), projectId: z.string() }),
    outputSchema: script_1.ScriptSchema,
}, async (input) => {
    const prompt = `Generate a video script about ${input.topic}.`;
    const llmResponse = await (0, ai_1.generate)({
        model: googleai_1.gemini15Pro,
        prompt: prompt,
        config: { temperature: 0.7 },
    });
    const scriptText = llmResponse.text();
    // TODO: Implement the logic to parse the scriptText and generate the other fields of the Script schema.
    const script = {
        projectId: input.projectId,
        videoId: 'video_' + Math.random().toString(36).substring(7),
        scriptText: scriptText,
        sceneBreakdown: [],
        seoMetadata: {
            title: `Video about ${input.topic}`,
            description: `A video about ${input.topic}`,
            tags: [input.topic],
            chapters: [],
            hashtags: [input.topic],
        },
        thumbnailConcepts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    return script;
});
//# sourceMappingURL=content.js.map