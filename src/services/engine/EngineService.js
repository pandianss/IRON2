
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
        const actionRef = doc(db, 'daily_actions', `${uid}_${Date.now()}`);

        return await runTransaction(db, async (transaction) => {
            // 1. Fetch Current State
            const stateDoc = await transaction.get(userStateRef);
            let currentState;

            if (!stateDoc.exists()) {
                // Determine if we need migration or fresh start
                // For now, fresh start
                currentState = INITIAL_USER_STATE(uid);
            } else {
                currentState = stateDoc.data();
            }

            // 2. Run Deterministic Engine
            // Use User's Timezone if available, else UTC (server default)
            const timeZone = currentState.timezone || 'UTC';
            const serverDate = new Date().toLocaleDateString('en-CA', { timeZone }); // YYYY-MM-DD format in specific TZ

            const newState = runDailyEngine(currentState, action, serverDate);

            // Validate Result
            validateState(newState);

            // 3. Commit Writes

            // A. Update Canonical State
            transaction.set(userStateRef, newState);

            // B. Log Immutable Action
            transaction.set(actionRef, {
                uid,
                action,
                server_ts: new Date().toISOString(),
                day: serverDate,
                previous_state_hash: 'TODO_HASH', // simplified
                new_state_hash: 'TODO_HASH'
            });

            // C. Log Transitions (if Streak changed)
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
