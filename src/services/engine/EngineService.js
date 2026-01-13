
import { DbService, db } from '../../infrastructure/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { runDailyEngine } from '../../engine/DailyEngine.js';
import { INITIAL_USER_STATE, validateState } from '../../engine/EngineSchema.js';

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
            // Server Timestamp is crucial. We use Client Time for now as simplified mock, 
            // but in Prod this comes from Cloud Function or Server Time offset.
            const serverDate = new Date().toISOString().split('T')[0];

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
