
/**
 * IRON — Deterministic Daily Engine Schema
 * 
 * This file defines the canonical structures for the engine.
 * These are the authoritative shapes that the system enforces.
 */

export const INITIAL_USER_STATE = (uid) => ({
    uid,
    engine_version: 1,

    current_day: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    last_evaluated_day: new Date().toISOString().split('T')[0],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

    // Streak Authority
    streak: {
        active: false,
        count: 0,
        longest: 0,
        freeze_tokens: 0,
        recovery_mode: false,
        last_action_date: null
    },

    // Engagement Metrics (Tier System)
    engagement: {
        score: 0,
        tier: "DORMANT", // DORMANT | ACTIVE | COMMITTED | DISCIPLINED | ELITE
        decay_risk: 0,   // 0-100%
        history_quality: 0 // Internal metric for tier promotion
    },

    // Social Mechanics (New P2)
    social: {
        pact_saves: 0,    // Times saved by a partner
        witness_count: 0  // Total times witnessed
    },

    // Retention State (Psychological Status)
    // ONBOARDING | ENGAGED | MOMENTUM | AT_RISK | STREAK_FRACTURED | RECOVERING | DORMANT
    engagement_state: "ONBOARDING",

    // Decay Physics (Entropy)
    retention: {
        decay: {
            last_active_timestamp: null, // For precise clock
            inactivity_days: 0,          // Distance from light
            decay_rate: 10               // Base score loss per day when broken
        }
    },

    // Recovery State
    recovery: {
        is_salvageable: false,
        window_remaining_hours: 0,
        missed_day_count: 0 // Track consecutive misses for recovery logic
    },

    // The Sandbox for Today (Reset daily)
    today: {
        status: "PENDING", // PENDING | COMPLETED | MISSED | RECOVERED | FROZEN | RESTED
        primary_action_done: false,
        secondary_actions: 0,
        action_log: [] // Array of action IDs specifically for today
    },

    // Lifetime Stats
    lifecycle: {
        days_active: 0,
        days_missed: 0,
        total_actions: 0,
        joined_date: new Date().toISOString()
    }
});

export const TIERS = {
    DORMANT: { min: 0, decay: 5 },
    ACTIVE: { min: 10, decay: 2 },
    COMMITTED: { min: 50, decay: 1 },
    DISCIPLINED: { min: 150, decay: 0.5 },
    ELITE: { min: 500, decay: 0.1 }
};

export const RISK_STATES = {
    ENGAGED: "ENGAGED",         // Healthy, maintaining flow
    AT_RISK: "AT_RISK",         // Missed yesterday, in grace period (if applicable)
    STREAK_BROKEN: "STREAK_BROKEN", // Officially lost streak, needs restart
    RECOVERING: "RECOVERING",   // Rebuilding (e.g., first 3 days after break)
    DORMANT: "DORMANT"          // Inactive for > 7 days
};

/**
 * Validates if a state object conforms to the schema.
 * In a real typed system (TS), this would be implicit. 
 * Here we do a runtime check for critical fields.
 */
export const validateState = (state) => {
    if (!state.uid) throw new Error("State missing UID");
    if (!state.current_day) throw new Error("State missing current_day");
    if (typeof state.streak?.count !== 'number') throw new Error("Invalid streak count");
    return true;
};
