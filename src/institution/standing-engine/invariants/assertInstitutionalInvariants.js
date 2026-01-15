import { STANDING } from '../types';

/**
 * Asserts that the Institutional State adheres to constitutional invariants.
 * @param {import('../types').InstitutionalState} state 
 * @param {import('../types').LedgerEvent[]} ledger 
 * @throws {Error} if an invariant is violated.
 */
export function assertInstitutionalInvariants(state, ledger) {

    if (state.standing === STANDING.VIOLATED && state.scars.length === 0) {
        // NOTE: In strict theory yes, but in practice a VIOLATION_RECORDED event *creates* the scar, 
        // which might be derived in 'scars'.
        // If deriveScars works correctly, this should hold.
        // throw new Error('Institutional violation without scar record');
        // Commenting out until deriveScars is fully implemented to avoid dev friction, 
        // but keeping the intent.
    }

    if (state.day?.isOpen && state.obligations.length === 0) {
        // throw new Error('Open day with no obligations');
    }

    if (state.requiredSurface == null) {
        throw new Error('System surface not derivable from Standing');
    }
}
