/**
 * RIGHTS ENFORCEMENT GATE
 * Authority: Governance Layer (The Iron Spine)
 * 
 * This middleware sits between the UI/API and the State Engine.
 * It is the final check before any mutation is applied.
 * 
 * If an action violates the RightsLayer, it throws a non-negotiable Error.
 */

import { RightsLayer } from './RightsLayer.js';
import { RETENTION_STATES } from './RetentionPolicy.js';

export class GovernanceError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "GovernanceError";
        this.code = code;
    }
}

export const RightsGate = {

    /**
     * Pre-Flight Check for State Transitions
     * @param {Object} currentUserState
     * @param {Object} proposedNextState
     */
    enforceTransition(currentUserState, proposedNextState) {

        // 1. Right to Momentum
        // "Momentum users cannot fall directly to FRACTURED."
        if (currentUserState.engagement_state === RETENTION_STATES.MOMENTUM &&
            proposedNextState.engagement_state === RETENTION_STATES.STREAK_FRACTURED) {

            // Check if Shield Logic was applied? 
            // The Gate enforces the OUTCOME. If the outcome is Fracture, and origin was Momentum, 
            // and no intermediate risk state existed (e.g. they skipped AT_RISK), it's a violation.
            // (Note: In our sim, Momentum -> At Risk -> Fracture is valid. Direct is invalid.)

            throw new GovernanceError(
                "RIGHTS VIOLATION: Momentum Shield Bypass. User must degrade to AT_RISK first.",
                "MOMENTUM_VIOLATION"
            );
        }

        // 2. Right to Due Process (Fracture Check)
        if (proposedNextState.engagement_state === RETENTION_STATES.STREAK_FRACTURED) {
            // Check if metrics imply a warning was sent (proxy)
            // In a real system, we'd query the NotificationService log.
            const hasBeenWarned = currentUserState.civil?.active_rituals?.includes('AT_RISK_WARNING') ||
                currentUserState.engagement_state === RETENTION_STATES.AT_RISK;

            if (!hasBeenWarned) {
                // EXCEPTION: If the user manually requested a fracture (Honesty)
                // But generally, the system cannot fracture without warning.
                throw new GovernanceError(
                    "RIGHTS VIOLATION: Due Process. Cannot fracture without prior Warning State.",
                    "DUE_PROCESS_VIOLATION"
                );
            }
        }

        return true; // Approved
    },

    /**
     * Pre-Flight Check for User Actions
     * @param {String} actionType 
     * @param {Object} user 
     */
    enforceAction(actionType, user) {
        // 1. Right to Appeal
        if (actionType === 'APPEAL') {
            if (user.social.social_capital < 10) { // Should match AppealSystem cost logic
                throw new GovernanceError(
                    "STANDING VIOLATION: Insufficient Social Capital for Justice.",
                    "INSOLVENT"
                );
            }
        }

        return true;
    }
};
