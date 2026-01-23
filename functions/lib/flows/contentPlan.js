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
exports.generateContentPlanFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const googleai_1 = require("@genkit-ai/googleai");
const ai_1 = require("@genkit-ai/ai");
const contentPlan_1 = require("../models/contentPlan");
const admin = __importStar(require("firebase-admin"));
const prompts_1 = require("../prompts");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.generateContentPlanFlow = (0, flow_1.defineFlow)({
    name: 'generateContentPlan',
    inputSchema: z.object({ projectId: z.string() }),
    outputSchema: contentPlan_1.ContentPlanSchema,
    authPolicy: (auth, input) => { },
}, async (input) => {
    const projectDoc = await db.collection('projects').doc(input.projectId).get();
    const projectData = projectDoc.data();
    if (!projectData) {
        throw new Error('Project not found');
    }
    const niche = projectData.niche;
    const prompt = `${prompts_1.GENERATE_CONTENT_PLAN_SYSTEM_PROMPT}\n${prompts_1.GENERATE_CONTENT_PLAN_PROMPT_TEMPLATE.replace('{idea}', niche)}`;
    const llmResponse = await (0, ai_1.generate)({
        model: googleai_1.gemini15Pro,
        prompt: prompt,
        config: { temperature: 0.7 },
    });
    const contentPlanData = JSON.parse(llmResponse.text());
    const planId = db.collection('contentPlans').doc().id;
    const plan = {
        id: planId,
        projectId: input.projectId,
        status: 'active',
        items: contentPlanData.content_plan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await db.collection('contentPlans').doc(planId).set(plan);
    await db.collection('projects').doc(input.projectId).update({ contentPlanId: planId });
    return plan;
});
