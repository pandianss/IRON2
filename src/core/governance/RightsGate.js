/**
 * RIGHTS ENFORCEMENT GATE
 * Authority: Governance Layer (The Iron Spine)
 * 
 * This middleware sits between the UI/API and the State Engine.
 * It is the final check before any mutation is applied.
 * 
 * If an action violates the RightsLayer, it throws a non-negotiable Error.
 * It also logs every denial to the Constitutional Audit.
 */

import { RightsLayer } from './RightsLayer.js';
import { RETENTION_STATES } from './RetentionPolicy.js';
import { ConstitutionalAudit } from './ViolationRegistry.js';

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
     * @param {Object} [proofs] - Evidence required for transition (e.g. warning log)
     */
    enforceTransition(currentUserState, proposedNextState, proofs = {}) {

        // 1. Right to Momentum
        // "Momentum users cannot fall directly to FRACTURED."
        if (currentUserState.engagement_state === RETENTION_STATES.MOMENTUM &&
            proposedNextState.engagement_state === RETENTION_STATES.STREAK_FRACTURED) {

            ConstitutionalAudit.record({
                type: "MOMENTUM_VIOLATION",
                actorId: "SYSTEM",
                targetId: currentUserState.uid, // Assuming uid is on state
                rule: "Rights.Momentum",
                details: { from: currentUserState.engagement_state, to: proposedNextState.engagement_state }
            });

            throw new GovernanceError(
                "RIGHTS VIOLATION: Momentum Shield Bypass. User must degrade to AT_RISK first.",
                "MOMENTUM_VIOLATION"
            );
        }

        // 2. Right to Due Process (Fracture Check)
        if (proposedNextState.engagement_state === RETENTION_STATES.STREAK_FRACTURED) {
            // PROOF REQUIREMENT: Warning Existence
            // The Gate demands "Proof" (e.g., a Log ID of the warning).

            const hasExplicitProof = proofs.warningLogId;
            const hasImplicitProof = currentUserState.civil?.active_rituals?.includes('AT_RISK_WARNING') ||
                currentUserState.engagement_state === RETENTION_STATES.AT_RISK;

            if (!hasExplicitProof && !hasImplicitProof) {
                ConstitutionalAudit.record({
                    type: "DUE_PROCESS_VIOLATION",
                    actorId: "SYSTEM",
                    targetId: currentUserState.uid,
                    rule: "Rights.DueProcess",
                    details: { reason: "Fracture attempted without Warning Proof" }
                });

                throw new GovernanceError(
                    "RIGHTS VIOLATION: Due Process. Cannot fracture without prior Warning Proof.",
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
            if (user.social.social_capital < 10) {
                ConstitutionalAudit.record({
                    type: "STANDING_VIOLATION",
                    actorId: user.uid,
                    targetId: user.uid,
                    rule: "Rights.Appeal",
                    details: { capital: user.social.social_capital, required: 10 }
                });

                throw new GovernanceError(
                    "STANDING VIOLATION: Insufficient Social Capital for Justice.",
                    "INSOLVENT"
                );
            }
        }

        return true;
    }
};
