/**
 * SNAPSHOT GENERATOR
 * Authority: Institutional Layer (Memory)
 * 
 * The Projection Layer.
 * Deterministically compiles a User's State from their Ledger History.
 * 
 * Rules:
 * 1. Output must be identical for the same input Sequence.
 * 2. Must handle all Canonical Event Types.
 * 3. Does NOT mutate, only Reduces.
 */

import { EVENT_TYPES } from '../behavior/LogSchema.js';
import { INITIAL_USER_STATE, TIERS, RISK_STATES } from '../behavior/EngineSchema.js'; // Assuming we can import clean state

export class SnapshotGenerator {

    /**
     * Compress a History into a Single State.
     * @param {Array} history - Array of { timestamp, event } blocks from LedgerService
     * @param {Object} [baseState] - Optional starting state (for checkpoints)
     */
    reduce(history, baseState = null) {
        // deep copy initial state
        let currentState = baseState ? JSON.parse(JSON.stringify(baseState)) : JSON.parse(JSON.stringify(INITIAL_USER_STATE));

        // Sort by timestamp (chronological) - Ledger should usually be sorted, but safety first.
        // Assuming history is from LedgerService.getHistory() which is sorted.

        for (const block of history) {
            this.applyEvent(currentState, block.event);
        }

        return currentState;
    }

    /**
     * Apply a single event to the state.
     * This mirrors the logic in DailyEngine, but acts as a Replay/Projection.
     * Note: This logic must match the Engine's transition logic EXACTLY.
     * Ideally, the Engine uses THIS to calculate next state, or they share a "TransitionFunction".
     * For now, we simulate the major transitions.
     */
    applyEvent(state, event) {
        const { type, payload } = event;

        switch (type) {
            case EVENT_TYPES.CHECK_IN:
                state.streak.current++;
                state.streak.total_checkins++;
                state.last_checkin = event.timestamp;
                // If checking in from AT_RISK or RECOVERING, might trigger transition, 
                // but usually the Engine handles the logic and emits STATE_CHANGED events if we have them.
                // If we ONLY have atomic events, we must derive state.
                // If we have MOMENTUM_GAINED events, we use those.
                break;

            case EVENT_TYPES.MISSED_DAY:
                state.lifecycle.days_missed++;
                break;

            case EVENT_TYPES.FRACTURE:
                state.engagement_state = RISK_STATES.STREAK_FRACTURED;
                state.streak.current = 0;
                break;

            case EVENT_TYPES.MOMENTUM_GAINED:
                state.engagement_state = RISK_STATES.ENGAGED; // Or MOMENTUM if tiered
                break;

            case EVENT_TYPES.APPEAL_FILED:
                // Just log it in history? specific state doesn't change until decision.
                state.civil.ritual_history.appeals_filed++;
                break;

            case EVENT_TYPES.PARDON_GRANTED:
                // Restore state
                if (payload.restore_state) {
                    state.engagement_state = payload.restore_state;
                }
                state.civil.ritual_history.pardons_received++;
                break;

            case EVENT_TYPES.WITNESS_VOUCH:
                state.social.social_capital += 1;
                state.civil.service_history.witness_events++; // If actor was witness? Wait, payload usage.
                break;

            // ... handle other types
        }

        // Update Lifecycle
        state.lifecycle.total_actions++;
    }
}

export const StateProjector = new SnapshotGenerator();
