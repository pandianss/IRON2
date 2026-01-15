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
        let currentState;
        if (baseState) {
            currentState = JSON.parse(JSON.stringify(baseState));
        } else {
            // Try to deduce UID from history, else arbitrary. LedgerService uses 'data' field.
            const uid = history.length > 0 ? (history[0].data?.userId || history[0].event?.userId) : 'unknown_user';
            currentState = JSON.parse(JSON.stringify(INITIAL_USER_STATE(uid)));
        }

        for (const block of history) {
            // LedgerService blocks have 'data'. Legacy might have 'event'.
            const event = block.data || block.event;
            if (event) this.applyEvent(currentState, event);
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
                this.handleAppealFiled(state, event);
                break;
            case EVENT_TYPES.PARDON_GRANTED:
                this.handlePardonGranted(state, event);
                break;
            case EVENT_TYPES.WITNESS_VOUCH:
                this.handleWitnessVouch(state, event);
                break;
            case EVENT_TYPES.PARTNER_LINKED:
                this.handlePartnerLinked(state, event);
                break;
            case EVENT_TYPES.PARTNER_DISSOLVED:
                this.handlePartnerDissolved(state, event);
                break;
            case EVENT_TYPES.USER_CREATED:
                this.handleUserCreated(state, event);
                break;
            case EVENT_TYPES.USER_UPDATED:
                this.handleUserUpdated(state, event);
                break;
            case EVENT_TYPES.LOG_ACTIVITY:
                this.handleLogActivity(state, event);
                break;
            case EVENT_TYPES.APPEAL_SUBMITTED:
                this.handleAppealSubmitted(state, event);
                break;
            case EVENT_TYPES.EVIDENCE_SUBMITTED:
                this.handleEvidenceSubmitted(state, event);
                break;
            case EVENT_TYPES.WITNESS_VOTE:
                this.handleWitnessVote(state, event);
                break;
            case EVENT_TYPES.APPEAL_DECIDED:
                this.handleAppealDecided(state, event);
                break;
        }

        // Global Update
        state.lifecycle.total_actions++;
        return state;
    }

    /**
     * APPEAL SUBMITTED
     * Payload: { appealId, type, reason }
     */
    handleAppealSubmitted(state, event) {
        state.civil.active_appeals = state.civil.active_appeals || {};
        state.civil.active_appeals[event.payload.appealId] = {
            id: event.payload.appealId,
            uid: event.userId,
            type: event.payload.type, // 'STREAK_RESTORE' etc
            reason: event.payload.reason,
            evidence_ids: [],
            witnesses: {},
            status: "PENDING_WITNESS",
            created_at: event.timestamp
        };
        state.civil.ritual_history.appeals_filed++;
    }

    /**
     * EVIDENCE SUBMITTED
     * Payload: { appealId, evidenceId, type, url }
     */
    handleEvidenceSubmitted(state, event) {
        const appeal = state.civil.active_appeals?.[event.payload.appealId];
        if (appeal) {
            appeal.evidence_ids.push(event.payload.evidenceId);
        }
    }

    /**
     * WITNESS VOTE
     * Payload: { appealId, vote, commentary }
     */
    handleWitnessVote(state, event) {
        const appeal = state.civil.active_appeals?.[event.payload.appealId];
        if (appeal) {
            appeal.witnesses[event.actor.id] = {
                vote: event.payload.vote, // 'VOUCH' | 'REJECT'
                commentary: event.payload.commentary,
                timestamp: event.timestamp
            };
            // Auto-transition if enough witnesses? (Logic for later)
        }
        // Also track service history for the witness (if we had access to witness state, but we only have Subject State here)
        // Note: Witness Service History is tracked on the WITNESS's own chain.
    }

    /**
     * APPEAL DECIDED
     * Payload: { appealId, verdict, narrative }
     */
    handleAppealDecided(state, event) {
        const appeal = state.civil.active_appeals?.[event.payload.appealId];
        if (!appeal) return;

        appeal.status = event.payload.verdict; // APPROVED | REJECTED
        appeal.decision_narrative = event.payload.narrative;
        appeal.closed_at = event.timestamp;

        // Apply Consequence
        if (appeal.status === 'APPROVED' && appeal.type === 'STREAK_RESTORE') {
            state.engagement_state = 'ENGAGED';
            state.streak.current = state.streak.freeze_tokens; // Or logic to restore
            // Simplified for now:
            state.streak.current += 1; // Mercy +1
        }

        // Archive
        state.civil.appeal_history.push(appeal);
        delete state.civil.active_appeals[event.payload.appealId];

        if (appeal.status === 'APPROVED') {
            state.civil.ritual_history.pardons_received++;
        }
    }

    /**
     * PARTNER LINKED
     */
    handlePartnerLinked(state, event) {
        // payload: { partnerUid, partnerName, pactId }
        state.social.partner = {
            uid: event.payload.partnerUid,
            name: event.payload.partnerName,
            pactId: event.payload.pactId,
            joinedAt: event.timestamp
        };
        // Social Capital boost?
        state.social.social_capital += 10;
    }

    /**
     * PARTNER DISSOLVED
     */
    handlePartnerDissolved(state, event) {
        state.social.partner = null;
        // Decay?
        state.social.social_capital = Math.max(0, state.social.social_capital - 5);
    }

    /**
     * GENESIS: Initialize User State from Event
     */
    handleUserCreated(state, event) {
        // payload contains { email, displayName, role, ... }
        state.profile = {
            ...state.profile,
            ...event.payload
        };
        // Reset or Init Stats if forced?
        // Usually creation implies fresh state, which INITIAL_USER_STATE provides.
        // So we just overlay payload data.
    }

    /**
     * PROFILE UPDATE
     */
    handleUserUpdated(state, event) {
        // payload contains updates
        state.profile = {
            ...state.profile,
            ...event.payload
        };
    }

    /**
     * ACTIVITY LOGGED -> XP Gain
     */
    handleLogActivity(state, event) {
        const { xp = 0, activityType } = event.payload;

        // Update XP/Level
        state.xp = (state.xp || 0) + xp;
        // Simple Level Logic: Level = 1 + floor(XP / 1000)
        state.level = 1 + Math.floor(state.xp / 1000);

        // Update Activity Timestamp
        state.last_activity = event.timestamp;
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

    /**
     * Logic for MISSED_DAY event
     */
    handleMissedDay(state, event) {
        state.lifecycle.days_missed++;
        // If explicit missed day event, break streak
        state.engagement_state = RISK_STATES.STREAK_FRACTURED; // Or similar
        state.streak.current = 0;
    }

    /**
     * Logic for FRACTURE event
     */
    handleFracture(state, event) {
        state.engagement_state = RISK_STATES.STREAK_FRACTURED;
        state.streak.current = 0;
    }

    /**
     * Logic for MOMENTUM_GAINED event
     */
    handleMomentumGained(state, event) {
        state.engagement_state = RISK_STATES.ENGAGED;
    }

    /**
     * Logic for APPEAL_FILED event
     */
    handleAppealFiled(state, event) {
        state.civil.ritual_history.appeals_filed++;
    }

    /**
     * Logic for PARDON_GRANTED event
     */
    handlePardonGranted(state, event) {
        const { payload } = event;
        if (payload.restore_state) {
            state.engagement_state = payload.restore_state;
        }
        state.civil.ritual_history.pardons_received++;
    }

    /**
     * Logic for WITNESS_VOUCH event
     */
    handleWitnessVouch(state, event) {
        state.social.social_capital += 1;
        state.civil.service_history.witness_events++;
    }
}

export const StateProjector = new SnapshotGenerator();
