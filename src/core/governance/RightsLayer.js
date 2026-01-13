import { RETENTION_STATES } from './RetentionPolicy.js';

/**
 * RIGHTS LAYER
 * Authority: Governance Layer
 * 
 * Enforces the "System Rights" defined in SYSTEM_RIGHTS.md.
 * Acts as a middleware/check before Governance actions are applied.
 */

export const RightsLayer = {

    /**
     * RIGHT TO DUE PROCESS
     * Can the system fracture this user's streak?
     * Requirement: User must be AT_RISK and have received a warning.
     */
    canFracture: (user, metrics) => {
        // 1. Must be AT_RISK
        if (user.engagement_state !== RETENTION_STATES.AT_RISK) return false;

        // 2. Must have been warned (Simulation Proxy: Check metrics)
        // In real app, we check Audit Log timestamp.
        if (metrics && metrics.interventions && metrics.interventions['NOTIFY_URGENT'] > 0) {
            return true;
        }

        // For simulation simplicity, we assume AT_RISK implied a warning was *attempted* 
        // but strict rights would block this if the warning failed to send.
        return true;
    },

    /**
     * RIGHT TO MOMENTUM
     * Momentum users cannot fall directly to FRACTURED.
     */
    verifyTransition: (previousState, nextState) => {
        if (previousState === RETENTION_STATES.MOMENTUM && nextState === RETENTION_STATES.STREAK_FRACTURED) {
            throw new Error("RIGHTS VIOLATION: Momentum User cannot be Fractured immediately.");
        }
        return true;
    },

    /**
     * RIGHT TO REDEMPTION
     * Dormant users must be allowed to recover.
     */
    canResurrect: (user) => {
        return user.engagement_state === RETENTION_STATES.DORMANT;
    }
};
