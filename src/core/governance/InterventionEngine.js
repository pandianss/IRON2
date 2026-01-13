import { RETENTION_STATES } from './RetentionPolicy.js';

/**
 * INTERVENTION ENGINE
 * Authority: Governance Layer
 * 
 * "The Platform's Conscience."
 * Decides when to intervene based on State, Physics, and Social signals.
 */

export const INTERVENTION_TYPES = {
    NOTIFY_URGENT: 'NOTIFY_URGENT',      // Breaking Warning
    SUMMON_WITNESS: 'SUMMON_WITNESS',    // Trigger Social Notification
    LOCK_OUT: 'LOCK_OUT',                // Restrict Access (Fractured)
    OFFER_RESURRECTION: 'OFFER_RESURRECTION', // Dormant Recovery Path
    IDENTITY_REINFORCEMENT: 'IDENTITY_REINFORCEMENT' // Momentum Boost
};

export const evaluateInterventions = (previousState, newState, socialContext = {}) => {
    const interventions = [];

    // 1. AT_RISK Interventions
    if (newState.engagement_state === RETENTION_STATES.AT_RISK) {

        // SOCIAL LOAD TRANSFER LAYER
        // Logic: If user has strong social capital (witness count > 5), 
        // delegate the warning to the social graph.
        const socialCapital = socialContext.witness_count || 0;

        if (socialCapital > 5) {
            interventions.push({
                type: INTERVENTION_TYPES.SUMMON_WITNESS,
                target: 'PARTNERS',
                reason: 'AT_RISK',
                narrative: "Your friend is slipping. Give them a nudge."
            });
            // We do NOT send a system warning if we summon a witness (Social Transfer).
            // Or maybe we send both? "The Social Load Transfer Layer" suggests offloading.
            // Let's send a lower priority system note + High Priority Social Summon.
        } else {
            // Low Social Capital -> System must intervene directly.
            interventions.push({
                type: INTERVENTION_TYPES.NOTIFY_URGENT,
                message: "Streak at Risk. 24h to save progress."
            });
        }
    }

    // 2. FRACTURE Interventions
    if (newState.engagement_state === RETENTION_STATES.STREAK_FRACTURED &&
        previousState.engagement_state !== RETENTION_STATES.STREAK_FRACTURED) {

        interventions.push({
            type: INTERVENTION_TYPES.LOCK_OUT,
            mode: 'RECOVERY_ONLY',
            message: "Streak Fractured. Initiate Recovery Protocol."
        });
    }

    // 3. MOMENTUM Interventions
    if (newState.engagement_state === RETENTION_STATES.MOMENTUM &&
        previousState.engagement_state !== RETENTION_STATES.MOMENTUM) {

        interventions.push({
            type: INTERVENTION_TYPES.IDENTITY_REINFORCEMENT,
            message: "Momentum Achieved. High Stakes Mode Active."
        });
    }

    // 4. DORMANT Interventions (The Void)
    if (newState.engagement_state === RETENTION_STATES.DORMANT &&
        previousState.engagement_state !== RETENTION_STATES.DORMANT) {

        interventions.push({
            type: INTERVENTION_TYPES.OFFER_RESURRECTION,
            message: "System Exit. Pay Debt to Return."
        });
    }

    return interventions;
};
