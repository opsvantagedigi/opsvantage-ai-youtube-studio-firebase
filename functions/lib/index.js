"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genkitFlows = void 0;
// Import all flows individually to avoid module issues
const contentPlan_1 = require("./flows/contentPlan");
const contentStrategy_1 = require("./flows/contentStrategy");
const content_1 = require("./flows/content");
const videoAssets_1 = require("./flows/videoAssets");
const voiceover_1 = require("./flows/voiceover");
const videoAssembly_1 = require("./flows/videoAssembly");
const youtubeConnect_1 = require("./flows/youtubeConnect");
const youtubeCallback_1 = require("./flows/youtubeCallback");
const youtubeUpload_1 = require("./flows/youtubeUpload");
const monetisation_1 = require("./flows/monetisation");
const monetisationProfile_1 = require("./flows/monetisationProfile");
const growthAnalytics_1 = require("./flows/growthAnalytics");
const promotion_1 = require("./flows/promotion");
const project_1 = require("./flows/project");
const video_1 = require("./flows/video");
const billing_1 = require("./flows/billing");
const webhook_1 = require("./flows/webhook");
const analytics_1 = require("./flows/analytics");
// Export all flows as Firebase Functions
exports.genkitFlows = {
    // Analytics flows
    getProjectAnalytics: analytics_1.getProjectAnalyticsFlow,
    // Billing flows
    createSubscriptionPayment: billing_1.createSubscriptionPayment,
    handlePaymentWebhook: webhook_1.handlePaymentWebhook,
    // Content flows
    generateScript: content_1.generateScriptFlow,
    generateContentPlan: contentPlan_1.generateContentPlanFlow,
    generateContentStrategy: contentStrategy_1.generateContentStrategyFlow,
    // Video flows
    generateVideoAssets: videoAssets_1.generateVideoAssetsFlow,
    generateVoiceover: voiceover_1.generateVoiceoverFlow,
    assembleFinalVideo: videoAssembly_1.assembleFinalVideoFlow,
    renderVideo: video_1.renderVideoFlow,
    // YouTube flows
    connectYouTubeAccount: youtubeConnect_1.connectYouTubeAccountFlow,
    handleYouTubeAuthCallback: youtubeCallback_1.handleYouTubeAuthCallbackFlow,
    uploadToYouTube: youtubeUpload_1.uploadToYouTubeFlow,
    // Monetization flows
    generateMonetisationPlan: monetisation_1.generateMonetisationPlanFlow,
    createMonetisationProfile: monetisationProfile_1.createMonetisationProfileFlow,
    getMonetisationProfile: monetisationProfile_1.getMonetisationProfileFlow,
    // Growth & Promotion flows
    runGrowthAnalytics: growthAnalytics_1.runGrowthAnalyticsFlow,
    executePromotionTask: promotion_1.executePromotionTaskFlow,
    schedulePromotionCampaign: promotion_1.schedulePromotionCampaignFlow,
    // Project flows
    createProject: project_1.createProjectFlow,
};
