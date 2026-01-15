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
        if (actionType === 'APPEAL_SUBMITTED') {
            if (user.social.social_capital < 10) {
                // ... Audit ...
                throw new GovernanceError("STANDING VIOLATION: Insufficient Social Capital.", "INSOLVENT");
            }
            // Spam Check: Max 3 active appeals?
            const activeAppeals = Object.keys(user.civil?.active_appeals || {}).length;
            if (activeAppeals >= 3) {
                throw new GovernanceError("LIMIT REACHED: Maximum 3 active appeals allowed.", "RATE_LIMIT");
            }
        }

        // 2. Witness Authority (Conflict of Interest)
        if (actionType === 'WITNESS_VOTE') {
            // We need to know who the 'author' of the vote is vs the 'target' user.
            // enforceAction(actionType, targetUserState, actor?)
            // Currently generic signature `enforceAction(actionType, user)` assumes user is the ACTOR.
            // But for Witness Vote, the ACTOR (Witness) is acting on TARGET (User).
            // We might need to pass `payload` or `actor` to this function.
            // For now, let's assume `user` here is the TARGET state, and we need the ACTOR info.
            // Function signature update required or we handle it in `enforceTransition`?
            // `enforceTransition` has `currentUserState` and `proposedNextState`.
            // `enforceTransition` verifies the RESULT.
            // Creating a specific `canVote` helper usage below.
        }

        return true;
    },

    /**
     * Validate Witness Voting Rights
     * @param {Object} targetUserState 
     * @param {Object} actor { id, type }
     * @param {String} appealId 
     */
    canVote(targetUserState, actor, appealId) {
        const appeal = targetUserState.civil?.active_appeals?.[appealId];
        if (!appeal) throw new GovernanceError("Appeal not found", "NOT_FOUND");

        // 1. No Self-Vouching
        if (actor.id === appeal.uid) {
            throw new GovernanceError("CONFLICT: Self-Vouching Prohibited.", "CONFLICT_OF_INTEREST");
        }

        // 2. Witness Authority (Must be WITNESS or COURT)
        if (actor.type !== 'WITNESS' && actor.type !== 'COURT') {
            throw new GovernanceError("JURISDICTION: Actor lacks Witness Authority.", "UNAUTHORIZED");
        }

        // 3. One Vote Per Witness
        if (appeal.witnesses && appeal.witnesses[actor.id]) {
            throw new GovernanceError("DUPLICATE: Already voted.", "DUPLICATE_ACTION");
        }

        return true;
    },

    canDecide(state, appealId) {
        const appeal = state.civil?.active_appeals?.[appealId];
        if (!appeal) throw new GovernanceError("Appeal not found", "NOT_FOUND");

        if (!appeal.evidence_ids || appeal.evidence_ids.length === 0) {
            throw new GovernanceError("PROCEDURAL ERROR: No Evidence linked to Appeal.", "INCOMPLETE_CASE");
        }
        return true;
    }
};
