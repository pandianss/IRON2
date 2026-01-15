/**
 * IRON Canonical Types (Authority Contracts)
 * @module types
 */

// --- ENUMS (Runtime Constants) ---

export const STANDING = {
    PRE_INDUCTION: 'PRE_INDUCTION',
    INDUCTED: 'INDUCTED',
    COMPLIANT: 'COMPLIANT',
    STRAINED: 'STRAINED',
    BREACH_RISK: 'BREACH_RISK',
    VIOLATED: 'VIOLATED',
    RECOVERY: 'RECOVERY',
    RECONSTITUTED: 'RECONSTITUTED',
    INSTITUTIONAL: 'INSTITUTIONAL'
};

export const SURFACE = {
    INDUCTION: 'INDUCTION',
    SYSTEM_STATE: 'SYSTEM_STATE',
    OBLIGATION: 'OBLIGATION',
    EVIDENCE: 'EVIDENCE',
    LEDGER_CLOSURE: 'LEDGER_CLOSURE',
    CONSEQUENCE: 'CONSEQUENCE'
};

export const EVENT_TYPE = {
    CONTRACT_CREATED: 'CONTRACT_CREATED',
    DAY_OPENED: 'DAY_OPENED',
    OBLIGATION_CREATED: 'OBLIGATION_CREATED',
    OBLIGATION_MET: 'OBLIGATION_MET',
    SOFT_FAILURE: 'SOFT_FAILURE',
    HARD_FAILURE: 'HARD_FAILURE',
    WINDOW_EXPIRED: 'WINDOW_EXPIRED',
    VIOLATION_RECORDED: 'VIOLATION_RECORDED',
    RECOVERY_ACCEPTED: 'RECOVERY_ACCEPTED',
    RECOVERY_COMPLETED: 'RECOVERY_COMPLETED',
    ERA_CLOSED: 'ERA_CLOSED',
    LONG_CONTINUITY: 'LONG_CONTINUITY'
};

// --- TYPES (JSDoc) ---

/**
 * @typedef {('PRE_INDUCTION'|'INDUCTED'|'COMPLIANT'|'STRAINED'|'BREACH_RISK'|'VIOLATED'|'RECOVERY'|'RECONSTITUTED'|'INSTITUTIONAL')} Standing
 */

/**
 * @typedef {('INDUCTION'|'SYSTEM_STATE'|'OBLIGATION'|'EVIDENCE'|'LEDGER_CLOSURE'|'CONSEQUENCE')} SystemSurface
 */

/**
 * @typedef {('CONTRACT_CREATED'|'DAY_OPENED'|'OBLIGATION_CREATED'|'OBLIGATION_MET'|'SOFT_FAILURE'|'HARD_FAILURE'|'WINDOW_EXPIRED'|'VIOLATION_RECORDED'|'RECOVERY_ACCEPTED'|'RECOVERY_COMPLETED'|'ERA_CLOSED'|'LONG_CONTINUITY')} LedgerEventType
 */

/**
 * @typedef {Object} LedgerEvent
 * @property {string} id
 * @property {LedgerEventType} type
 * @property {number} timestamp
 * @property {Record<string, any>} payload
 */

/**
 * @typedef {Object} Obligation
 * @property {string} id
 * @property {'PRIMARY'|'RECOVERY'|'ESCALATED'} kind
 * @property {number} openedAt
 * @property {number} dueBy
 * @property {'NORMAL'|'TIGHT'|'SEVERE'} strictness
 * @property {'OPEN'|'SATISFIED'|'FAILED'} status
 */

/**
 * @typedef {Object} DayState
 * @property {number} index
 * @property {number} openedAt
 * @property {number} closesAt
 * @property {boolean} isOpen
 * @property {number} unresolvedObligations
 */

/**
 * @typedef {Object} RiskProfile
 * @property {number} strainScore
 * @property {number} breachProbability
 * @property {number|null} hoursToBreach
 * @property {number} recentFailures
 */

/**
 * @typedef {Object} ScarRecord
 * @property {number} era
 * @property {string} violationType
 * @property {number} occurredAt
 * @property {boolean} recoveryCompleted
 */

/**
 * @typedef {Object} SystemPermissions
 * @property {boolean} mayOpenDay
 * @property {boolean} mayCloseDay
 * @property {boolean} maySubmitEvidence
 * @property {boolean} mayEnterRecovery
 * @property {boolean} mayExitInstitution
 * @property {boolean} mayViewHistory
 */

/**
 * @typedef {Object} InstitutionalState
 * @property {Standing} standing
 * @property {DayState|null} day
 * @property {Obligation[]} obligations
 * @property {RiskProfile} risk
 * @property {ScarRecord[]} scars
 * @property {SystemPermissions} permissions
 * @property {SystemSurface} requiredSurface
 */
