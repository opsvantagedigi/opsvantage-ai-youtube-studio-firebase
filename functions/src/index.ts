// Import all flows individually to avoid module issues
import { generateContentPlanFlow } from "./flows/contentPlan";
import { generateContentStrategyFlow } from "./flows/contentStrategy";
import { generateScriptFlow } from "./flows/content";
import { generateVideoAssetsFlow } from "./flows/videoAssets";
import { generateVoiceoverFlow } from "./flows/voiceover";
import { assembleFinalVideoFlow } from "./flows/videoAssembly";
import { connectYouTubeAccountFlow } from "./flows/youtubeConnect";
import { handleYouTubeAuthCallbackFlow } from "./flows/youtubeCallback";
import { uploadToYouTubeFlow } from "./flows/youtubeUpload";
import { generateMonetisationPlanFlow } from "./flows/monetisation";
import { createMonetisationProfileFlow, getMonetisationProfileFlow } from "./flows/monetisationProfile";
import { runGrowthAnalyticsFlow } from "./flows/growthAnalytics";
import { executePromotionTaskFlow, schedulePromotionCampaignFlow } from "./flows/promotion";
import { createProjectFlow } from "./flows/project";
import { renderVideoFlow } from "./flows/video";
import { createSubscriptionPayment } from "./flows/billing";
import { handlePaymentWebhook } from "./flows/webhook";
import { getProjectAnalyticsFlow } from "./flows/analytics";

import { defineFlow } from "@genkit-ai/flow";

// Export all flows as Firebase Functions
export const genkitFlows = {
  // Analytics flows
  getProjectAnalytics: getProjectAnalyticsFlow,

  // Billing flows
  createSubscriptionPayment: createSubscriptionPayment,
  handlePaymentWebhook: handlePaymentWebhook,

  // Content flows
  generateScript: generateScriptFlow,
  generateContentPlan: generateContentPlanFlow,
  generateContentStrategy: generateContentStrategyFlow,

  // Video flows
  generateVideoAssets: generateVideoAssetsFlow,
  generateVoiceover: generateVoiceoverFlow,
  assembleFinalVideo: assembleFinalVideoFlow,
  renderVideo: renderVideoFlow,

  // YouTube flows
  connectYouTubeAccount: connectYouTubeAccountFlow,
  handleYouTubeAuthCallback: handleYouTubeAuthCallbackFlow,
  uploadToYouTube: uploadToYouTubeFlow,

  // Monetization flows
  generateMonetisationPlan: generateMonetisationPlanFlow,
  createMonetisationProfile: createMonetisationProfileFlow,
  getMonetisationProfile: getMonetisationProfileFlow,

  // Growth & Promotion flows
  runGrowthAnalytics: runGrowthAnalyticsFlow,
  executePromotionTask: executePromotionTaskFlow,
  schedulePromotionCampaign: schedulePromotionCampaignFlow,

  // Project flows
  createProject: createProjectFlow,
};