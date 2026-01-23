// subscription.utils.ts
import * as admin from 'firebase-admin';

const db = admin.firestore();

export interface UserSubscription {
  userId: string;
  plan: string;
  status: string;
  videoCredits: number;
  renewsAt?: string;
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
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
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

export async function hasVideoCredit(userId: string): Promise<boolean> {
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
  } catch (error) {
    console.error('Error checking video credit:', error);
    return false;
  }
}

export async function deductVideoCredit(userId: string): Promise<boolean> {
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
      } else {
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
  } catch (error) {
    console.error('Error deducting video credit:', error);
    return false;
  }
}

export async function getUserUsageForCurrentMonth(userId: string) {
  const monthKey = new Date().toISOString().slice(0, 7);
  const usageDoc = await db.collection('usage').doc(`${userId}_${monthKey}`).get();
  
  if (!usageDoc.exists) {
    return null;
  }
  
  return usageDoc.data();
}