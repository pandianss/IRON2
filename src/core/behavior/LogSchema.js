import { ROLES, RITUALS } from './EngineSchema.js';

export const EVENT_TYPES = {
    // PHYSICS EVENTS (The Engine)
    CHECK_IN: "CHECK_IN",
    MISSED_DAY: "MISSED_DAY",
    FRACTURE: "FRACTURE",
    MOMENTUM_GAINED: "MOMENTUM_GAINED",
    MOMENTUM_LOST: "MOMENTUM_LOST", // Decay

    // GENESIS & IDENTITY (New Sovereign Scope)
    USER_CREATED: "USER_CREATED",
    USER_UPDATED: "USER_UPDATED",

    // CONTENT & ACTIVITY
    LOG_ACTIVITY: "LOG_ACTIVITY",
    ACTIVITY_VERIFIED: "ACTIVITY_VERIFIED",
    POST_CREATED: "POST_CREATED",
    POST_LIKED: "POST_LIKED",

    // SOCIAL EVENTS (The People)
    PARTNER_LINKED: "PARTNER_LINKED",
    PARTNER_DISSOLVED: "PARTNER_DISSOLVED",
    WITNESS_VOUCH: "WITNESS_VOUCH",
    MENTOR_ASSIGNED: "MENTOR_ASSIGNED",
    GROUP_CHECKIN: "GROUP_CHECKIN",

    // GOVERNANCE EVENTS (The Institution)
    GOVERNANCE_ACTION: "GOVERNANCE_ACTION", // General bucket for Rights/Mercy
    SYSTEM_INTERVENTION: "SYSTEM_INTERVENTION", // Forced state change (e.g. Lockout)
    APPEAL_FILED: "APPEAL_FILED", // Legacy, prefer APPEAL_SUBMITTED
    APPEAL_DECISION: "APPEAL_DECISION", // Legacy, prefer APPEAL_DECIDED
    PARDON_GRANTED: "PARDON_GRANTED",

    // LEGAL & RIGHTS (Track I)
    APPEAL_SUBMITTED: "APPEAL_SUBMITTED",
    EVIDENCE_SUBMITTED: "EVIDENCE_SUBMITTED",
    WITNESS_VOTE: "WITNESS_VOTE",
    APPEAL_DECIDED: "APPEAL_DECIDED"
};

export const ACTOR_TYPES = {
    SYSTEM: "SYSTEM",
    USER: "USER",
    WITNESS: "WITNESS",
    COURT: "COURT"
};

/**
 * Creates a Canonical Behavioral Event.
 * This is the ATOM of the Institution.
 * 
 * @param {Object} params - The event parameters
 * @param {String} params.uid - User ID
 * @param {String} params.type - Event Type (from EVENT_TYPES)
 * @param {Object} params.actor - { type: ACTOR_TYPES.*, id: string }
 * @param {Object} params.payload - Schema-bound data specific to the event
 * @param {Object} params.meta - Traceability metadata { ruleIds, narrativeId, rightsChecked }
 * @param {String} [params.prevHash] - Optional hash of previous state (for verification)
 */
export const createBehaviorEvent = ({
    uid,
    type,
    actor,
    payload = {},
    meta = {},
    prevHash = null
}) => {
    if (!EVENT_TYPES[type]) throw new Error(`Invalid Event Type: ${type}`);
    if (!actor || !ACTOR_TYPES[actor.type]) throw new Error(`Invalid Actor: ${JSON.stringify(actor)}`);

    return {
        eventId: globalThis.crypto.randomUUID(), // Immutable ID
        userId: uid,
        type,
        timestamp: new Date().toISOString(), // Authoritative Time
        actor: {
            type: actor.type,
            id: actor.id
        },
        payload,
        integrity: {
            prevHash: prevHash, // Link to previous state hash if available
            hash: null // To be calculated by LedgerService
        },
        meta: {
            ruleIds: meta.ruleIds || [],          // 'Why' (Architecture Rule)
            narrativeId: meta.narrativeId || null, // 'How' (NarrativeService)
            rightsChecked: meta.rightsChecked || [] // 'Guard' (RightsGate)
        },
        // Legacy support (optional, can be phased out)
        context: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    };
};
