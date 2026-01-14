/**
 * ENGINE SERVICE (The Pivot)
 * Authority: Behavioral Engine
 * 
 * Migrated to PHASE 22: Sovereign Ledger Integration.
 * - Writes are now explicit Append-Only events to the ledger.
 * - State is derived (Cached), not stored as authoritative.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase.js';

import { createBehaviorEvent, ACTOR_TYPES } from '../../core/behavior/LogSchema.js';
import { InstitutionalLedger } from '../../core/ledger/LedgerService.js';
import { StateProjector } from '../../core/ledger/SnapshotGenerator.js';
import { RightsGate } from '../../core/governance/RightsGate.js';
import { Voice } from '../../core/narrative/NarrativeEngine.js';
import { INITIAL_USER_STATE, validateState } from '../../core/behavior/EngineSchema.js';

export const EngineService = {

    /**
     * The Single Entry Point for User Actions.
     * Now in Sovereign Ledger Mode.
     * @param {string} uid 
     * @param {object} action { type: 'CHECK_IN', status: 'trained' | 'rest' }
     */
    processAction: async (uid, action) => {
        try {
            // 1. Fetch Current State (Cache)
            // We use the cache for speed, but rights checks depend on it.
            const userStateRef = doc(db, 'user_state', uid);
            const stateDoc = await getDoc(userStateRef);

            let currentState = stateDoc.exists() ? stateDoc.data() : INITIAL_USER_STATE(uid);

            // 2. Construct Canonical Event (The Atom)
            // Map Action to Event Type
            let eventType = action.type; // Default
            if (action.type === 'CHECK_IN') eventType = 'CHECK_IN';

            const eventPayload = {
                status: action.status || 'COMPLETED', // Default to COMPLETED (Trained) if not set
                ...action
            };

            const event = createBehaviorEvent({
                uid,
                type: eventType,
                actor: { type: ACTOR_TYPES.USER, id: uid },
                payload: eventPayload,
                meta: {}
            });

            // 3. Dry Run / Pre-Flight Check (RightsGate)
            // We simulate the next state to see if it's legal.
            const projectedState = StateProjector.reduce([{ timestamp: event.timestamp, event }], currentState);

            RightsGate.enforceTransition(currentState, projectedState);
            // Optionally enforce action-specific rights
            // RightsGate.enforceAction(eventType, currentState);

            // 4. Narrative Generation (The Voice)
            // "No Narrative = No Transition"
            const narrative = Voice.generate(event, {
                newState: projectedState.engagement_state,
                days: projectedState.streak.count,
                actorName: currentState.profile?.name || "User"
            });
            event.meta.narrativeId = narrative.id;

            // 5. COMMIT TO LEDGER (The Point of No Return)
            // This is the only "Write" that matters.
            await InstitutionalLedger.append(event);

            // 6. Update Cache (The Projection)
            // We write the Projected State to Firestore so the UI is fast.
            validateState(projectedState); // Ensure schema validity
            await setDoc(userStateRef, projectedState);

            return projectedState;

        } catch (error) {
            console.error("[ENGINE FAILURE] Action Aborted:", error);
            throw error; // Propagate error (Rights Violation, Ledger Failure)
        }
    },

    /**
     * Read-only projection
     */
    getUserState: async (uid) => {
        const docRef = doc(db, 'user_state', uid);
        const snapshot = await getDoc(docRef);
        return snapshot.exists() ? snapshot.data() : null;
    }
};
