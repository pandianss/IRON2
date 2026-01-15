/**
 * IRON Standing Engine
 * The Sovereign Interpreter of the Behavioural Ledger.
 * 
 * Design Constraints:
 * - Pure (No Side Effects)
 * - Deterministic (Same Ledger + Time -> Same Result)
 * - Total (Always returns valid state)
 */

// --- 1. CONSTANTS & ENUMS ---

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
    SYSTEM_STATE: 'SYSTEM_STATE',
    OBLIGATION: 'OBLIGATION',
    EVIDENCE: 'EVIDENCE',
    LEDGER_CLOSURE: 'LEDGER_CLOSURE',
    CONSEQUENCE: 'CONSEQUENCE',
    INDUCTION: 'INDUCTION'
};

const PROTOCOL = {
    DAY_LENGTH_MS: 24 * 60 * 60 * 1000,
    WARNING_THRESHOLD_MS: 20 * 60 * 60 * 1000,
    INTEGRITY_DECAY_PER_HOUR: 5,
    RECOVERY_WINDOW_MS: 48 * 60 * 60 * 1000 // Hypothetical 48h to recover
};

// --- 2. TYPES (JSDoc) ---

/**
 * @typedef {Object} LedgerEvent
 * @property {string} id
 * @property {string} type
 * @property {number} timestamp
 * @property {Object} payload
 */

/**
 * @typedef {Object} InstitutionalState
 * @property {string} standing - One of STANDING
 * @property {Object|null} day - Open day state
 * @property {Array} obligations - Active obligations
 * @property {Object} risk - Risk metrics
 * @property {Array} scars - Scar history
 * @property {Object} permissions - System permissions
 * @property {string} requiredSurface - Mandatory UI Surface
 */

// --- 3. CORE ENGINE ---

/**
 * The only sovereign call.
 * @param {LedgerEvent[]} ledger - Chronological history of events
 * @param {number} now - Institutional Time
 * @returns {InstitutionalState}
 */
export function evaluateInstitution(ledger, now) {
    // 0. Base State (Pre-Induction)
    let state = {
        standing: STANDING.PRE_INDUCTION,
        lastAction: null,
        contract: null,
        scars: [],
        currentEra: null,
        day: null
    };

    // 1. Replay History (Reducer)
    // In a production optimization, we would load a Snapshot and replay only recent events.
    for (const event of ledger) {
        state = applyEvent(state, event);
    }

    // 2. Project Current Reality (Time-based decay)
    const projection = projectReality(state, now);

    // 3. Determine Required Surface
    const requiredSurface = deriveRequiredSurface(projection);

    // 4. Construct Full Institutional State
    return {
        standing: projection.standing,
        day: projection.day,
        obligations: deriveObligations(projection, now),
        risk: deriveRisk(projection, now),
        scars: state.scars,
        permissions: derivePermissions(projection.standing),
        requiredSurface: requiredSurface
    };
}

// --- 4. REDUCER LOGIC (Internal) ---

function applyEvent(state, event) {
    switch (event.type) {
        case 'CONTRACT_CREATED':
            return {
                ...state,
                standing: STANDING.INDUCTED,
                contract: event.payload,
                currentEra: { start: event.timestamp, index: 1 }
            };

        case 'DAY_OPENED':
            return {
                ...state,
                day: {
                    index: event.payload.dayIndex,
                    openedAt: event.timestamp,
                    isOpen: true
                }
            };

        case 'OBLIGATION_MET': // e.g. Workout Done
            return {
                ...state,
                day: { ...state.day, isOpen: false }, // Close the day logic simplified
                lastAction: event.timestamp,
                standing: STANDING.COMPLIANT // Boost to compliant
            };

        case 'VIOLATION_RECORDED':
            return {
                ...state,
                standing: STANDING.VIOLATED,
                scars: [...state.scars, {
                    era: state.currentEra?.index || 0,
                    type: event.payload.type,
                    occurredAt: event.timestamp
                }]
            };

        case 'RECOVERY_COMPLETED':
            return {
                ...state,
                standing: STANDING.RECONSTITUTED, // Returned with scars
                day: null // Reset day state
            };

        default:
            return state;
    }
}

// --- 5. PROJECTION LOGIC (Time) ---

function projectReality(state, now) {
    // If Pre-Induction or Violated, time doesn't change standing (it's already floor)
    if (state.standing === STANDING.PRE_INDUCTION || state.standing === STANDING.VIOLATED) {
        return state;
    }

    // If day is closed, we are safe until next open window? 
    // Actually simplicity: We check time since last Obligation Met or Day Open.

    // Simple logic for V1 Engine:
    // If day is OPEN and time > 24h -> VIOLATED.
    if (state.day?.isOpen) {
        const elapsed = now - state.day.openedAt;

        if (elapsed > PROTOCOL.DAY_LENGTH_MS) {
            // Implicit Violation (Time-out)
            return { ...state, standing: STANDING.VIOLATED };
        }

        // Risk Calculation
        const timeLeft = PROTOCOL.DAY_LENGTH_MS - elapsed;
        if (timeLeft < (PROTOCOL.DAY_LENGTH_MS - PROTOCOL.WARNING_THRESHOLD_MS)) {
            return { ...state, standing: STANDING.BREACH_RISK };
        }
    }

    return state;
}

// --- 6. DERIVATIONS ---

function deriveObligations(state, now) {
    if (state.standing === STANDING.VIOLATED) {
        // Obligation: Pay Penance / Recover
        return [{ kind: 'RECOVERY', description: "Pay Penance to Restore Standing" }];
    }

    if (state.day?.isOpen) {
        return [{ kind: 'PRIMARY', description: "Submit Evidence of Consumption" }];
    }

    // Default: No obligation (Day Closed)
    return [];
}

function deriveRisk(state, now) {
    // TODO: Implement calculation based on logic in projectReality
    return {
        breachProbability: state.standing === STANDING.BREACH_RISK ? 0.9 : 0.1
    };
}

function derivePermissions(standing) {
    const isViolated = standing === STANDING.VIOLATED;
    return {
        mayCloseDay: !isViolated,
        mayOpenDay: !isViolated,
        mayEnterRecovery: isViolated
    };
}

function deriveRequiredSurface(state) {
    if (state.standing === STANDING.PRE_INDUCTION) return SURFACE.INDUCTION;
    if (state.standing === STANDING.VIOLATED) return SURFACE.CONSEQUENCE;

    // If Day is Open -> Obligation (or System State if we allow viewing)
    if (state.day?.isOpen) return SURFACE.SYSTEM_STATE; // User enters System State, then chooses Obligation

    return SURFACE.SYSTEM_STATE;
}
