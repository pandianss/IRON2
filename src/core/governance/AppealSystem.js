import { RETENTION_STATES } from './RetentionPolicy.js';
import { Institution } from '../memory/Institution.js';
import { createBehaviorEvent } from '../behavior/LogSchema.js';

/**
 * APPEAL SYSTEM (The Court)
 * Authority: Governance Layer
 * 
 * Adjudicates requests for specific relief (Pardons).
 */

const APPEAL_COST = 10; // Social Capital Cost (Verification Level)

export const AppealSystem = {

    /**
     * Can this user file an appeal?
     * Requires:
     * 1. Valid Fracture State.
     * 2. Sufficient Social Capital.
     */
    canAppeal: (user) => {
        if (user.engagement_state !== RETENTION_STATES.STREAK_FRACTURED) return false;
        if ((user.social.social_capital || 0) < APPEAL_COST) return false;
        return true;
    },

    /**
     * Process the Appeal.
     * 1. Deduct SC.
     * 2. Emit PARDON event.
     * 3. Return State Surgery Instructions.
     */
    processAppeal: (user, currentState, causalEventId) => {
        if (!AppealSystem.canAppeal(user)) {
            return {
                approved: false,
                reason: "Insufficient Capital or Invalid State"
            };
        }

        // Deduct Capital (Logic usually in Engine, but here we define the Transaction)
        const cost = APPEAL_COST;

        // Log the Appeal in the Institution
        const appealEvent = createBehaviorEvent(
            user.uid,
            'GOVERNANCE_ACTION', // Updated Type
            {
                subtype: 'APPEAL_GRANTED',
                cost,
                previous_state: currentState.engagement_state
            },
            {}, // context
            causalEventId // The Fracture Event ID we are appealing
        );

        Institution.record(appealEvent);

        return {
            approved: true,
            cost: cost,
            new_state: RETENTION_STATES.RECOVERING, // Pardons move you to Recovering, not Momentum immediately
            narrative: " The Court accepts your service. Fracture sealed."
        };
    }
};
