import { db } from '../../infrastructure/firebase.config';
import { doc, getDoc, setDoc, runTransaction, serverTimestamp, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { getLocalToday, getLocalYesterday, getSystemTimezone } from '../../utils/dateHelpers';

const COLLECTION_USERS = 'users';
const SUBCOLLECTION_CHECKINS = 'checkins';

/**
 * Server-Authoritative Retention Service
 * Uses Firestore as the source of truth.
 * Validates check-ins against server timestamp constraints using Rules (to be added)
 * or via strict client-side checks before write.
 */
class FirebaseRetentionService {

    /**
     * Records a check-in for the current user.
     * Uses a specific document ID {YYYY-MM-DD} to ensure idempotency.
     * @param {string} userId 
     * @param {'trained' | 'rest'} status 
     * @returns {Promise<void>}
     */
    async checkIn(userId, status = 'trained') {
        const timezone = getSystemTimezone();
        const today = getLocalToday(timezone);

        const checkInRef = doc(db, COLLECTION_USERS, userId, SUBCOLLECTION_CHECKINS, today);
        const userRef = doc(db, COLLECTION_USERS, userId);

        try {
            return await runTransaction(db, async (transaction) => {
                // 1. Read current user stats
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) {
                    throw new Error("User does not exist");
                }

                const userData = userDoc.data();
                const currentStreak = userData.currentStreak || 0;
                const lastCheckInDate = userData.lastCheckInDate || null;
                const longestStreak = userData.longestStreak || 0;

                // 2. Check Idempotency & Upgrades
                const checkInDoc = await transaction.get(checkInRef);

                if (checkInDoc.exists()) {
                    const existingData = checkInDoc.data();

                    // SCENARIO: UPGRADE (Rest -> Trained)
                    if (existingData.status === 'rest' && status === 'trained') {
                        // Allow overwrite
                        transaction.update(checkInRef, {
                            status: 'trained',
                            timestamp: serverTimestamp(),
                            isUpgrade: true
                        });
                        // User stats don't change (streak already counted for today)
                        // But strictly updating lastCheckInTime might be good
                        transaction.update(userRef, {
                            lastCheckInTime: serverTimestamp()
                        });
                        return { status: 'upgraded' };
                    }

                    // SCENARIO: DUPLICATE or DOWNGRADE
                    console.log("Already checked in explicitly today.");
                    return { status: 'ignored' };
                }

                // 3. New Check-In logic (same as before)
                const yesterday = getLocalYesterday(timezone);
                let newStreak = 1;

                if (lastCheckInDate === yesterday) {
                    newStreak = currentStreak + 1;
                } else if (lastCheckInDate === today) {
                    // Desync handling
                    newStreak = currentStreak;
                }

                // 4. Update Stats
                const newLongest = Math.max(longestStreak, newStreak);

                transaction.set(checkInRef, {
                    status,
                    timestamp: serverTimestamp(),
                    timezone,
                    dateId: today
                });

                transaction.update(userRef, {
                    currentStreak: newStreak,
                    longestStreak: newLongest,
                    lastCheckInDate: today,
                    lastCheckInTime: serverTimestamp()
                });

                return { status: 'success' };
            });

        } catch (e) {
            console.error("Firestore Check-in failed", e);
            throw e;
        }
    }

    /**
     * Syncs persistence. In this version, it's a no-op or a fetch.
     * @param {string} userId 
     */
    async syncHistory(userId) {
        // Fetch latest stats to ensure UI is up to date
        const ref = doc(db, COLLECTION_USERS, userId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            return snap.data();
        }
        return null;
    }

    /**
     * Gets check-in history for calendar.
     */
    async getHistory(userId, days = 30) {
        const historyRef = collection(db, COLLECTION_USERS, userId, SUBCOLLECTION_CHECKINS);
        // Simple query for now
        const q = query(historyRef, orderBy('dateId', 'desc'), limit(days));
        const snapshot = await getDocs(q);

        const history = {};
        snapshot.forEach(doc => {
            history[doc.id] = doc.data().status;
        });
        return history;
    }
}

export const firebaseRetentionService = new FirebaseRetentionService();
