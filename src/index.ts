import * as genkit from '@genkit-ai/firebase/functions';
import { getProjectAnalyticsFlow } from './flows/analytics';
import { createSubscriptionPayment } from './flows/billing';
import { generateScriptFlow } from './flows/content';
import { generateContentPlanFlow } from './flows/contentPlan';
import { createProjectFlow } from './flows/project';
import { renderVideoFlow } from './flows/video';
import { handlePaymentWebhook } from './flows/webhook';

export const genkitFlows = genkit.defineFunctions({
  getProjectAnalyticsFlow,
  createSubscriptionPayment,
  generateScriptFlow,
  generateContentPlanFlow,
  createProjectFlow,
  renderVideoFlow,
  handlePaymentWebhook,
});
