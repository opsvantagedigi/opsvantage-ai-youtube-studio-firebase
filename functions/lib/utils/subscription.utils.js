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
exports.getUserSubscription = getUserSubscription;
exports.hasVideoCredit = hasVideoCredit;
exports.deductVideoCredit = deductVideoCredit;
exports.getUserUsageForCurrentMonth = getUserUsageForCurrentMonth;
// subscription.utils.ts
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
async function getUserSubscription(userId) {
    try {
        // Find active subscription for the user
        const subscriptionsSnapshot = await db
            .collection('subscriptions')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
        if (subscriptionsSnapshot.empty) {
            return null;
        }
        const subscriptionDoc = subscriptionsSnapshot.docs[0];
        return {
            userId: subscriptionDoc.data().userId,
            plan: subscriptionDoc.data().plan,
            status: subscriptionDoc.data().status,
            videoCredits: subscriptionDoc.data().videoCredits,
            renewsAt: subscriptionDoc.data().renewsAt,
        };
    }
    catch (error) {
        console.error('Error getting user subscription:', error);
        return null;
    }
}
async function hasVideoCredit(userId) {
    try {
        const subscription = await getUserSubscription(userId);
        if (!subscription) {
            // Free tier - check if user has already used their monthly limit (1 video)
            const usage = await getUserUsageForCurrentMonth(userId);
            return !usage || usage.videosGenerated < 1;
        }
        if (subscription.status !== 'active') {
            return false;
        }
        return subscription.videoCredits > 0;
    }
    catch (error) {
        console.error('Error checking video credit:', error);
        return false;
    }
}
async function deductVideoCredit(userId) {
    try {
        const subscription = await getUserSubscription(userId);
        if (!subscription) {
            // For free tier users, we'll track usage differently
            const usage = await getUserUsageForCurrentMonth(userId);
            const monthKey = new Date().toISOString().slice(0, 7);
            const usageRef = db.collection('usage').doc(`${userId}_${monthKey}`);
            if (!usage) {
                // Create new usage record
                await usageRef.set({
                    userId,
                    month: monthKey,
                    videosGenerated: 1,
                    charactersUsed: 0,
                    storageUsedMB: 0,
                    lastUpdatedAt: new Date().toISOString(),
                });
            }
            else {
                // Update existing usage record
                await usageRef.update({
                    videosGenerated: admin.firestore.FieldValue.increment(1),
                    lastUpdatedAt: new Date().toISOString(),
                });
            }
            return true;
        }
        if (subscription.status !== 'active' || subscription.videoCredits <= 0) {
            return false;
        }
        // Deduct credit from subscription
        // Query for the active subscription
        const subscriptionsSnapshot = await db
            .collection('subscriptions')
            .where('userId', '==', userId)
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
        if (subscriptionsSnapshot.empty) {
            return false;
        }
        const subscriptionDoc = subscriptionsSnapshot.docs[0];
        const subscriptionDocRef = subscriptionDoc.ref;
        await subscriptionDocRef.update({
            videoCredits: admin.firestore.FieldValue.increment(-1),
            updatedAt: new Date().toISOString(),
        });
        return true;
    }
    catch (error) {
        console.error('Error deducting video credit:', error);
        return false;
    }
}
async function getUserUsageForCurrentMonth(userId) {
    const monthKey = new Date().toISOString().slice(0, 7);
    const usageDoc = await db.collection('usage').doc(`${userId}_${monthKey}`).get();
    if (!usageDoc.exists) {
        return null;
    }
    return usageDoc.data();
}
