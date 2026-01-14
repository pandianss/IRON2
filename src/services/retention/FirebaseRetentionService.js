import { db } from '../../infrastructure/firebase.config';
import { doc, getDoc, setDoc, runTransaction, serverTimestamp, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { getLocalToday, getLocalYesterday, getSystemTimezone, getDateId } from '../../utils/dateHelpers';
import { EngineService } from '../engine/EngineService.js';
import { InstitutionalLedger } from '../../core/ledger/LedgerService.js';

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
     * NOW DELEGATED TO ENGINE SERVICE (SOVEREIGN LEDGER).
     * @param {string} userId 
     * @param {'trained' | 'rest'} status 
     * @returns {Promise<Object>}
     */
    async checkIn(userId, status = 'trained') {
        try {
            console.log("Creating Sovereign Check-in Event...");
            const newState = await EngineService.processAction(userId, {
                type: 'CHECK_IN',
                status: status
            });

            // Map result to legacy return format if needed, or just return success
            // The UI likely expects { status: 'success' } or throws.
            return { status: 'success', state: newState };

        } catch (error) {
            console.error("Check-in Failed via Engine:", error);
            throw error;
        }
    }

    /**
     * Syncs persistence. In this version, it's a no-op or a fetch.
     * @param {string} userId 
     */
    async syncHistory(userId) {
        // Fetch latest stats to ensure UI is up to date
        // Delegate to EngineService for consistency? 
        // Or keep direct read since it's just a cache read.
        return await EngineService.getUserState(userId);
    }

    /**
     * Gets check-in history for calendar.
     */
    async getHistory(userId, days = 30) {
        // This likely still needs to read from a collection.
        // Since we are writing to 'user_state' (cache) and 'ledger_blocks', 
        // the old 'users/{uid}/checkins' collection might NOT be updated anymore!
        // CRITICAL: We need to either:
        // A) Update EngineService to ALSO write to the legacy 'checkins' subcollection (Double Write)
        // B) Update this method to read from 'ledger_blocks' or the 'user_state.today.action_log' or similar.

        // For Phase 1 (Sovereign):
        // We verified EngineService writes to 'user_state'. 
        // Does it write to 'checkins' subcollection? NO.
        // So `getHistory` here will break for new check-ins unless we fix it.

        // Option B is better: Read from Ledger blocks.
        // But Ledger blocks are heavy.
        // Let's use LedgerService.getHistory(uid) and map it.

        const events = await InstitutionalLedger.getHistory(userId);

        // Filter and Map
        const history = {};
        events.forEach(block => {
            const date = getDateId(block.timestamp);
            if (block.data.type === 'CHECK_IN') {
                history[date] = block.data.payload.status || 'trained';
            }
        });

        return history;
    }
}

export const firebaseRetentionService = new FirebaseRetentionService();
