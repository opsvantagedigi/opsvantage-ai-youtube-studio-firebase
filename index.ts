import * as genkit from "@genkit-ai/firebase/functions";
import {
    getProjectAnalyticsFlow,
    createSubscriptionPayment,
    generateScriptFlow,
    generateContentPlanFlow,
    createProjectFlow,
    renderVideoFlow,
    handlePaymentWebhook
} from "./src/index";

export const genkitFlows = genkit.defineFunctions({
    getProjectAnalyticsFlow,
    createSubscriptionPayment,
    generateScriptFlow,
    generateContentPlanFlow,
    createProjectFlow,
    renderVideoFlow,
    handlePaymentWebhook
});