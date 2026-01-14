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
     * @param {object} [transaction] - Optional Firestore transaction for atomic coupling
     */
    processAction: async (uid, action, transaction = null) => {
        try {
            // 1. Fetch Current State (Cache)
            // We use the cache for speed, but rights checks depend on it.
            const userStateRef = doc(db, 'user_state', uid);

            let currentState;
            if (transaction) {
                // If in transaction, MUST read via transaction
                const stateDoc = await transaction.get(userStateRef);
                currentState = stateDoc.exists() ? stateDoc.data() : INITIAL_USER_STATE(uid);
            } else {
                const stateDoc = await getDoc(userStateRef);
                currentState = stateDoc.exists() ? stateDoc.data() : INITIAL_USER_STATE(uid);
            }

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
            await InstitutionalLedger.append(event, transaction);

            // 6. Update Cache (The Projection)
            // We write the Projected State to Firestore so the UI is fast.
            validateState(projectedState); // Ensure schema validity

            if (transaction) {
                transaction.set(userStateRef, projectedState);
            } else {
                await setDoc(userStateRef, projectedState);
            }

            // 7. Handle Side Effects (Projections)
            // Note: Side effects usually run *after* commit. 
            // If in strict transaction, we might want to defer these until after transaction resolves?
            // For now, we await them. If they fail, they shouldn't block the main transaction unless we want them to.
            // CAUTION: Side effects might write to other collections. If those key resources aren't in the transaction, it's fine.
            // But if we want 100% atomicity, side effects should also accept transaction.
            // For this phase, we let side effects run "best effort" or we'll need to refactor them too.
            // Ideally, side effects are effectively "event handlers" that run async after commit.
            // We kept await here for simplicity but they are logically decoupled.
            await this.handleSideEffects(event, projectedState);

            return projectedState;

        } catch (error) {
            console.error("[ENGINE FAILURE] Action Aborted:", error);
            throw error; // Propagate error (Rights Violation, Ledger Failure)
        }
    },

    /**
     * Handle External Projections (Feed, Global Stats, etc.)
     * @param {Object} event 
     * @param {Object} newState 
     */
    handleSideEffects: async (event, newState) => {
        try {
            const { collection, addDoc, doc, updateDoc, increment, arrayUnion, arrayRemove } = await import('firebase/firestore');

            if (event.type === 'POST_CREATED') {
                // Project to Feed Collection
                const postData = {
                    userId: event.uid,
                    userName: newState.profile?.name || "User",
                    userPhoto: newState.profile?.photoURL || null,
                    type: event.payload.postType || 'status',
                    content: event.payload.content,
                    mediaUrl: event.payload.mediaUrl || null,
                    likes: 0,
                    likedBy: [],
                    commentsCount: 0,
                    location: 'Iron Gym',
                    date: event.timestamp,
                    eventId: event.meta.narrativeId
                };
                await addDoc(collection(db, 'feed'), postData);
            }
            else if (event.type === 'POST_LIKED') {
                const { postId, action } = event.payload;
                const postRef = doc(db, 'feed', postId);

                if (action === 'UNLIKE') {
                    await updateDoc(postRef, {
                        likes: increment(-1),
                        likedBy: arrayRemove(event.uid)
                    });
                } else {
                    await updateDoc(postRef, {
                        likes: increment(1),
                        likedBy: arrayUnion(event.uid)
                    });
                }
            }
            else if (event.type === 'POST_LIKED') {
                const { postId, action } = event.payload;
                const postRef = doc(db, 'feed', postId);

                if (action === 'UNLIKE') {
                    await updateDoc(postRef, {
                        likes: increment(-1),
                        likedBy: arrayRemove(event.uid)
                    });
                } else {
                    await updateDoc(postRef, {
                        likes: increment(1),
                        likedBy: arrayUnion(event.uid)
                    });
                }
            }
            else if (event.type === 'LOG_ACTIVITY') {
                // Side Effect: Create Activity Record
                const activityData = {
                    userId: event.uid,
                    userName: newState.profile?.displayName || "User",
                    // ...map payload fields...
                    type: event.payload.activityType,
                    description: event.payload.description || '',
                    duration: event.payload.duration || 0,
                    xp: event.payload.xp || 0,
                    status: 'Pending', // Default verification status
                    timestamp: event.timestamp,
                    eventId: event.meta.narrativeId
                };
                await addDoc(collection(db, 'feed_activities'), activityData);
            }
            else if (event.type === 'ACTIVITY_VERIFIED') {
                // Side Effect: Update Activity Record
                const { activityId, verifierId, status } = event.payload;
                const activityRef = doc(db, 'feed_activities', activityId);
                await updateDoc(activityRef, {
                    status: status,
                    verifiedBy: verifierId,
                    verifiedAt: event.timestamp
                });
            }
            else if (event.type === 'USER_CREATED') {
                // Side Effect: Sync to 'users' collection (Identity Projection)
                // The payload contains the profile data.
                const userRef = doc(db, 'users', event.uid);
                await setDoc(userRef, {
                    uid: event.uid,
                    ...event.payload,
                    createdAt: event.timestamp,
                    lastActive: event.timestamp
                }, { merge: true });
            }
            else if (event.type === 'USER_UPDATED') {
                // Side Effect: Sync to 'users' collection
                const userRef = doc(db, 'users', event.uid);
                await updateDoc(userRef, {
                    ...event.payload,
                    updatedAt: event.timestamp
                });
            }
        } catch (e) {
            console.error("SIDE EFFECT FAILED:", e);
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
