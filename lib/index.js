"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowpaymentsWebhook = exports.renderVideo = exports.createProject = exports.generateContentPlan = exports.generateScript = exports.createCheckoutSession = exports.getAnalytics = void 0;
const core_1 = require("@genkit-ai/core");
const firebase_1 = require("@genkit-ai/firebase");
const googleai_1 = require("@genkit-ai/googleai");
const functions_1 = require("@genkit-ai/firebase/functions");
(0, core_1.configure)({
    plugins: [
        (0, firebase_1.firebase)(),
        (0, googleai_1.googleAI)({ apiVersion: "v1beta" }),
    ],
    logLevel: "debug",
    enableTracingAndMetrics: true,
});
// Import all your flows
const analytics_1 = require("./flows/analytics");
const billing_1 = require("./flows/billing");
const content_1 = require("./flows/content");
const contentPlan_1 = require("./flows/contentPlan");
const project_1 = require("./flows/project");
const video_1 = require("./flows/video");
const webhook_1 = require("./flows/webhook");
// Export each flow as an HTTPS function
exports.getAnalytics = (0, functions_1.onFlow)(analytics_1.getProjectAnalyticsFlow, {});
exports.createCheckoutSession = (0, functions_1.onFlow)(billing_1.createSubscriptionPayment, {});
exports.generateScript = (0, functions_1.onFlow)(content_1.generateScriptFlow, {});
exports.generateContentPlan = (0, functions_1.onFlow)(contentPlan_1.generateContentPlanFlow, {});
exports.createProject = (0, functions_1.onFlow)(project_1.createProjectFlow, {});
exports.renderVideo = (0, functions_1.onFlow)(video_1.renderVideoFlow, {});
exports.nowpaymentsWebhook = (0, functions_1.onFlow)(webhook_1.handlePaymentWebhook, {});
//# sourceMappingURL=index.js.map