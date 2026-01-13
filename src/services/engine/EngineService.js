
import { DbService, db } from '../../infrastructure/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { runDailyEngine } from '../../core/behavior/DailyEngine';
import { INITIAL_USER_STATE, validateState } from '../../core/behavior/EngineSchema';

export const EngineService = {
    /**
     * The Single Entry Point for User Actions that affect State.
     * @param {string} uid 
     * @param {object} action { type: 'CHECK_IN' | 'WORKOUT', ...payload }
     */
    processAction: async (uid, action) => {
        const userStateRef = doc(db, 'user_state', uid);
        const logRef = doc(db, 'behavior_logs', `${uid}_${Date.now()}`); // Auto-ordered by TS roughly

        return await runTransaction(db, async (transaction) => {
            // 1. Fetch Current State
            const stateDoc = await transaction.get(userStateRef);
            let currentState;

            if (!stateDoc.exists()) {
                currentState = INITIAL_USER_STATE(uid);
            } else {
                currentState = stateDoc.data();
            }

            // 2. Prepare Immutable Event
            // We strip 'type' from action to avoid duping it if it's already there, 
            // but for safety we explicitly construct it.
            const eventPayload = { ...action };
            delete eventPayload.type; // Type is top-level in event

            const behaviorEvent = {
                uid,
                type: action.type,
                payload: eventPayload,
                server_ts: new Date().toISOString(),
                schema_version: 1
            };

            // 3. Run Deterministic Engine (Derive State)
            // Use User's Timezone if available, else UTC (server default)
            const timeZone = currentState.timezone || 'UTC';
            const serverDate = new Date().toLocaleDateString('en-CA', { timeZone });

            const newState = runDailyEngine(currentState, action, serverDate);

            // 4. Validate Result
            validateState(newState);

            // 5. Commit Writes (Log First, Then State)

            // A. Write to Immutable Log
            transaction.set(logRef, behaviorEvent);

            // B. Update Canonical State
            transaction.set(userStateRef, newState);

            // C. Legacy/Optimization Logs (Optional: streak_transitions)
            // We keep this for easy querying without replaying logs
            if (newState.streak.count !== currentState.streak.count) {
                const transitionRef = doc(db, 'streak_transitions', `${uid}_${Date.now()}`);
                transaction.set(transitionRef, {
                    uid,
                    from: currentState.streak.count,
                    to: newState.streak.count,
                    reason: action.type,
                    day: serverDate
                });
            }

            return newState;
        });
    },

    /**
     * Read-only projection
     */
    getUserState: async (uid) => {
        return await DbService.getDoc('user_state', uid);
    }
};
