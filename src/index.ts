import { configure } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import { googleAI } from '@genkit-ai/googleai';
import { onFlow } from '@genkit-ai/firebase/functions';

configure({
  plugins: [
    firebase(),
    googleAI({ apiVersion: "v1beta" }),
  ],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

// Import all your flows
import { getProjectAnalyticsFlow } from './flows/analytics';
import { createSubscriptionPayment } from './flows/billing';
import { generateScriptFlow } from './flows/content';
import { generateContentPlanFlow } from './flows/contentPlan';
import { createProjectFlow } from './flows/project';
import { renderVideoFlow } from './flows/video';
import { handlePaymentWebhook } from './flows/webhook';

// Export each flow as an HTTPS function
export const getAnalytics = onFlow(getProjectAnalyticsFlow, {});
export const createCheckoutSession = onFlow(createSubscriptionPayment, {});
export const generateScript = onFlow(generateScriptFlow, {});
export const generateContentPlan = onFlow(generateContentPlanFlow, {});
export const createProject = onFlow(createProjectFlow, {});
export const renderVideo = onFlow(renderVideoFlow, {});
export const nowpaymentsWebhook = onFlow(handlePaymentWebhook, {});
