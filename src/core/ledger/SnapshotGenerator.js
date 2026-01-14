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
import { INITIAL_USER_STATE, TIERS, RISK_STATES } from '../behavior/EngineSchema.js';
import { getDateId, getDayDifference } from '../../utils/dateHelpers.js';

export class SnapshotGenerator {

    /**
     * Compress a History into a Single State.
     * @param {Array} history - Array of { timestamp, event } blocks from LedgerService
     * @param {Object} [baseState] - Optional starting state (for checkpoints)
     */
    reduce(history, baseState = null) {
        // deep copy initial state
        let currentState = baseState ? JSON.parse(JSON.stringify(baseState)) : JSON.parse(JSON.stringify(INITIAL_USER_STATE));

        for (const block of history) {
            this.applyEvent(currentState, block.event);
        }

        return currentState;
    }

    /**
     * Apply a single event to the state.
     */
    applyEvent(state, event) {
        const { type, payload, timestamp } = event;

        switch (type) {
            case EVENT_TYPES.CHECK_IN:
                this.handleCheckIn(state, event);
                break;

            case EVENT_TYPES.MISSED_DAY:
                state.lifecycle.days_missed++;
                // If explicit missed day event, break streak
                state.engagement_state = RISK_STATES.STREAK_FRACTURED; // Or similar
                state.streak.current = 0;
                break;

            case EVENT_TYPES.FRACTURE:
                state.engagement_state = RISK_STATES.STREAK_FRACTURED;
                state.streak.current = 0;
                break;

            case EVENT_TYPES.MOMENTUM_GAINED:
                state.engagement_state = RISK_STATES.ENGAGED;
                break;

            case EVENT_TYPES.APPEAL_FILED:
                state.civil.ritual_history.appeals_filed++;
                break;

            case EVENT_TYPES.PARDON_GRANTED:
                if (payload.restore_state) {
                    state.engagement_state = payload.restore_state;
                }
                state.civil.ritual_history.pardons_received++;
                break;

            case EVENT_TYPES.WITNESS_VOUCH:
                state.social.social_capital += 1;
                state.civil.service_history.witness_events++;
                break;
        }

        // Global Update
        state.lifecycle.total_actions++;
    }

    /**
     * Logic for CHECK_IN content
     */
    handleCheckIn(state, event) {
        const eventDate = getDateId(event.timestamp);
        const lastCheckInDate = state.last_checkin ? getDateId(state.last_checkin) : null;
        const status = event.payload?.status || 'COMPLETED'; // 'COMPLETED' (Trained) or 'RESTED' 

        // 1. Check Idempotency (Same Day)
        if (lastCheckInDate === eventDate) {
            // SCENARIO: UPGRADE (Rest -> Trained)
            if (state.today.status === 'RESTED' && status === 'COMPLETED') {
                state.today.status = 'COMPLETED';
                state.last_checkin = event.timestamp;
                // Streak logic: If it was Rested, streak might not have incremented? 
                // Iron Logic: Rest consumes freeze token or maintains streak? 
                // For MVP: We assume Rest maintains streak. So Upgrade just changes status.
                return;
            }

            // Otherwise, purely redundant
            state.last_checkin = event.timestamp;
            return;
        }

        // 2. Check Continuity
        if (lastCheckInDate) {
            const diff = getDayDifference(lastCheckInDate, eventDate);

            if (diff === 1) {
                // Consecutive Day
                state.streak.current++;
            } else if (diff > 1) {
                // Gap detected -> Reset
                state.streak.current = 1;
                state.engagement_state = RISK_STATES.RECOVERING;
            } else {
                // Time travel (negative diff)? strict ordering assumed.
                // If diff < 0, ignore or log error?
            }
        } else {
            // First check-in ever
            state.streak.current = 1;
            state.engagement_state = RISK_STATES.ENGAGED;
        }

        // Update High Score
        if (state.streak.current > state.streak.longest) {
            state.streak.longest = state.streak.current;
        }

        // Commit Update
        state.streak.total_checkins++;
        state.last_checkin = event.timestamp;

        // Update Daily Sandbox
        state.today.status = status;
        state.today.primary_action_done = true;
    }
}

export const StateProjector = new SnapshotGenerator();
