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
     * @param {object} action { type: 'CHECK_IN', ... }
     */
    processAction: async (uid, action) => {
        try {
            // 1. Fetch Current State (Cache)
            // We use the cache for speed, but rights checks depend on it.
            // Ideally, we'd verify hash, but for v1.0, trusting cache is acceptable if Ledger is write-path.
            const userStateRef = doc(db, 'user_state', uid);
            const stateDoc = await getDoc(userStateRef);

            let currentState = stateDoc.exists() ? stateDoc.data() : INITIAL_USER_STATE(uid);

            // 2. Construct Canonical Event (The Atom)
            const event = createBehaviorEvent({
                uid,
                type: action.type,
                actor: { type: ACTOR_TYPES.USER, id: uid }, // Assuming User action for now
                payload: action,
                meta: {} // To be filled by detailed logic later?
            });

            // 3. Dry Run / Pre-Flight Check (RightsGate)
            // We simulate the next state to see if it's legal.
            // This requires the SnapshotGenerator to "peek" forward.
            const projectedState = StateProjector.reduce([{ timestamp: event.timestamp, event }], currentState); // Incremental Apply

            RightsGate.enforceTransition(currentState, projectedState);

            // 4. Narrative Generation (The Voice)
            // "No Narrative = No Transition"
            const narrative = Voice.generate(event, {
                newState: projectedState.engagement_state,
                days: projectedState.streak.count
            });
            event.meta.narrativeId = narrative.id;

            // 5. COMMIT TO LEDGER (The Point of No Return)
            // This is the only "Write" that matters.
            const blockHash = await InstitutionalLedger.append(event);

            // 6. Update Cache (The Projection)
            // We write the Projected State to Firestore so the UI is fast.
            // But this is technically just a cache of the Ledger.
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
