
import { InstitutionalLedger } from '../../core/ledger/LedgerService';
import { StateProjector } from '../../core/ledger/SnapshotGenerator';
import { DbService } from '../../infrastructure/firebase';
import { INITIAL_USER_STATE } from '../../core/behavior/EngineSchema';

export const ReplayService = {

    /**
     * REBUILD STATE FROM TRUTH
     * @param {string} uid 
     * @returns {Promise<Object>} The calculated state
     */
    rebuildState: async (uid) => {
        console.log(`[FORENSICS] Rebuilding state for ${uid}...`);

        // 1. Fetch Complete History
        const history = await InstitutionalLedger.getHistory(uid);
        if (!history || history.length === 0) {
            console.log("[FORENSICS] No history found. Returning Genesis State.");
            return {
                state: JSON.parse(JSON.stringify(INITIAL_USER_STATE(uid))),
                eventCount: 0,
                lastHash: null
            };
        }

        console.log(`[FORENSICS] Replaying ${history.length} events...`);

        // 2. Project
        // We assume StateProjector is stateless/pure
        const calculatedState = StateProjector.reduce(history);

        return {
            state: calculatedState,
            eventCount: history.length,
            lastHash: history[history.length - 1].hash
        };
    },

    /**
     * VERIFY INTEGRITY
     * Compares Cache vs Ledger
     */
    verifyIntegrity: async (uid) => {
        const cachedParams = await DbService.getDoc('user_state', uid);
        const rebuildResult = await ReplayService.rebuildState(uid);

        if (!rebuildResult && !cachedParams) return { status: 'CLEAN_EMPTY' };
        if (!rebuildResult && cachedParams) return { status: 'CACHE_WITHOUT_LEDGER' }; // Error

        const calculated = rebuildResult.state;

        // Deep Compare (Simplified)
        // We focus on critical fields: Streak, XP, Level, Status
        const audit = {
            streak_match: calculated.streak.current === cachedParams.streak.current,
            xp_match: calculated.xp === cachedParams.xp,
            status_match: calculated.engagement_state === cachedParams.engagement_state,
            ledger_events: rebuildResult.eventCount
        };

        if (audit.streak_match && audit.xp_match && audit.status_match) {
            return { status: 'VERIFIED', audit };
        } else {
            return { status: 'CORRUPTED', audit, calculated, cached: cachedParams };
        }
    }
};
