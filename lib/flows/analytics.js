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
exports.getProjectAnalyticsFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const z = __importStar(require("zod"));
const analytics_1 = require("../models/analytics");
exports.getProjectAnalyticsFlow = (0, flow_1.defineFlow)({
    name: 'getProjectAnalytics',
    inputSchema: z.object({ projectId: z.string() }),
    outputSchema: analytics_1.AnalyticsSchema,
}, async (input) => {
    // In a real application, you would fetch and calculate this data from your database.
    // This is a mock implementation.
    const analytics = {
        projectId: input.projectId,
        totalViews: 10000,
        totalLikes: 500,
        totalComments: 100,
        subscribers: 1000,
        watchTimeHours: 4000,
        averageViewDuration: 240,
        impressions: 100000,
        ctr: 5,
    };
    return analytics;
});
//# sourceMappingURL=analytics.js.map