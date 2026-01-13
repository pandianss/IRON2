/**
 * IRON RETENTION POLICY
 * Authority: Governance Layer
 * 
 * Defines the immutable laws of the Retention State Machine.
 */

export const RETENTION_STATES = {
    ONBOARDING: 'ONBOARDING',          // Validated User, No First Action
    ENGAGED: 'ENGAGED',                // Active Streak < 7
    MOMENTUM: 'MOMENTUM',              // Active Streak >= 7
    AT_RISK: 'AT_RISK',                // Missed Yesterday (Grace Period)
    RECOVERING: 'RECOVERING',          // Returned from Fracture (Probation)
    STREAK_FRACTURED: 'STREAK_FRACTURED', // Streak Lost (Entropy Active)
    DORMANT: 'DORMANT'                 // System Exit (Total Entropy)
};

export const ALLOWED_TRANSITIONS = {
    [RETENTION_STATES.ONBOARDING]: [RETENTION_STATES.ENGAGED],
    [RETENTION_STATES.ENGAGED]: [RETENTION_STATES.MOMENTUM, RETENTION_STATES.AT_RISK],
    [RETENTION_STATES.MOMENTUM]: [RETENTION_STATES.AT_RISK], // Fall from grace is steep
    [RETENTION_STATES.AT_RISK]: [RETENTION_STATES.ENGAGED, RETENTION_STATES.STREAK_FRACTURED],
    [RETENTION_STATES.STREAK_FRACTURED]: [RETENTION_STATES.RECOVERING, RETENTION_STATES.DORMANT],
    [RETENTION_STATES.RECOVERING]: [RETENTION_STATES.ENGAGED, RETENTION_STATES.AT_RISK, RETENTION_STATES.STREAK_FRACTURED],
    [RETENTION_STATES.DORMANT]: [RETENTION_STATES.RECOVERING] // Requires Resurrection
};

export const OBLIGATIONS = {
    [RETENTION_STATES.AT_RISK]: {
        action_required: true,
        deadline_hours: 24,
        description: "Must complete Primary Action or Burn Freeze Token."
    },
    [RETENTION_STATES.RECOVERING]: {
        action_required: true,
        consistency_target: 3,
        description: "Must complete 3 consecutive days to restore trust."
    },
    [RETENTION_STATES.DORMANT]: {
        action_required: true,
        barrier: "RESURRECTION_COST",
        description: "Must pay Identity Debt to return."
    }
};
