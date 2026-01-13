
/**
 * IRON — Immutable Behavior Log Schema
 * 
 * The Behavior Log is the single source of truth for user history.
 * All state is purely derived from these events.
 */

export const EVENT_TYPES = {
    CHECK_IN: 'CHECK_IN',       // Standard daily action
    REST: 'REST',               // Valid rest day
    WORKOUT_LOG: 'WORKOUT_LOG', // Detailed workout data
    SYSTEM_ADJUSTMENT: 'SYSTEM_ADJUSTMENT', // Admin/System fix
    MIGRATION: 'MIGRATION',      // Legacy data import
    WITNESS_WORKOUT: 'WITNESS_WORKOUT', // Partner validation
    SEND_SUPPORT: 'SEND_SUPPORT' // Partner encouragement
};

/**
 * Creates a standard Behavior Event object
 * @param {string} uid - User ID
 * @param {string} type - Event Type (from EVENT_TYPES)
 * @param {object} payload - Specific data (e.g. { status: 'trained', workoutId: '...' })
 * @param {object} context - Metadata (app_version, timezone, etc.)
 */
export const createBehaviorEvent = (uid, type, payload = {}, context = {}) => {
    if (!EVENT_TYPES[type]) throw new Error(`Invalid Event Type: ${type}`);

    return {
        uid,
        type,
        payload,
        context: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString(),
            ...context
        },
        // In a real system, we might hash previous event for blockchain-like integrity
        integrity: {
            schema_version: 1,
            hash: null
        }
    };
};
