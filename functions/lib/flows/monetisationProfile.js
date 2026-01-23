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
exports.getMonetisationProfileFlow = exports.createMonetisationProfileFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const admin = __importStar(require("firebase-admin"));
const monetisationProfile_1 = require("../models/monetisationProfile");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.createMonetisationProfileFlow = (0, flow_1.defineFlow)({
    name: 'createMonetisationProfile',
    inputSchema: monetisationProfile_1.MonetisationProfileSchema.omit({ createdAt: true, updatedAt: true }), // Exclude timestamps since they'll be set by the server
    outputSchema: monetisationProfile_1.MonetisationProfileSchema,
    authPolicy: (auth, input) => { },
}, async (input) => {
    const { projectId, affiliatePrograms, digitalProducts, emailProvider, emailListId, } = input;
    // Verify project exists and belongs to user
    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
        throw new Error(`Project with ID ${projectId} not found`);
    }
    // In a real implementation, you would verify that the authenticated user owns this project
    // For now, we'll skip this check
    // const projectData = projectDoc.data();
    // Create or update the monetization profile
    const profileRef = db.collection('monetisationProfiles').doc(projectId);
    const now = new Date().toISOString();
    const profileData = {
        projectId,
        affiliatePrograms: affiliatePrograms || [],
        digitalProducts: digitalProducts || [],
        emailProvider: emailProvider || 'none',
        emailListId: emailListId || null,
        createdAt: now,
        updatedAt: now,
    };
    await profileRef.set(profileData);
    console.log(`Created/updated monetization profile for project: ${projectId}`);
    return profileData;
});
exports.getMonetisationProfileFlow = (0, flow_1.defineFlow)({
    name: 'getMonetisationProfile',
    inputSchema: z.object({
        projectId: z.string(),
    }),
    outputSchema: monetisationProfile_1.MonetisationProfileSchema.optional(), // Optional since profile might not exist
    authPolicy: (auth, input) => { },
}, async (input) => {
    const { projectId } = input;
    const profileDoc = await db.collection('monetisationProfiles').doc(projectId).get();
    if (!profileDoc.exists) {
        console.log(`No monetization profile found for project: ${projectId}`);
        return undefined;
    }
    const profileData = profileDoc.data();
    console.log(`Retrieved monetization profile for project: ${projectId}`);
    // Return the data in the expected format
    if (profileData) {
        return {
            projectId: profileData.projectId,
            affiliatePrograms: profileData.affiliatePrograms || [],
            digitalProducts: profileData.digitalProducts || [],
            emailProvider: profileData.emailProvider || 'none',
            emailListId: profileData.emailListId || null,
            createdAt: profileData.createdAt,
            updatedAt: profileData.updatedAt,
        };
    }
    else {
        return undefined;
    }
});
