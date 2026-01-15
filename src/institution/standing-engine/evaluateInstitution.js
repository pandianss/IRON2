import { deriveStanding } from './derivation/deriveStanding';
import { deriveDayState } from './derivation/deriveDayState';
import { deriveObligations } from './derivation/deriveObligations';
import { deriveRisk } from './derivation/deriveRisk';
import { deriveScars } from './derivation/deriveScars';
import { derivePermissions } from './derivation/derivePermissions';
import { deriveRequiredSurface } from './derivation/deriveRequiredSurface';
import { assertInstitutionalInvariants } from './invariants/assertInstitutionalInvariants';
import { SURFACE } from './types';

/**
 * The only sovereign call.
 * @param {import('./types').LedgerEvent[]} ledger 
 * @param {number} now 
 * @returns {import('./types').InstitutionalState}
 */
export function evaluateInstitution(ledger, now) {

    const standing = deriveStanding(ledger);

    const day = deriveDayState(ledger, now);

    const obligations = deriveObligations(ledger, now);

    const risk = deriveRisk(ledger, day);

    const scars = deriveScars(ledger);

    const permissions = derivePermissions({
        standing,
        day,
        obligations,
        risk,
        scars
    });

    /** @type {import('./types').InstitutionalState} */
    const state = {
        standing,
        day,
        obligations,
        risk,
        scars,
        permissions,
        requiredSurface: SURFACE.SYSTEM_STATE // placeholder
    };

    state.requiredSurface = deriveRequiredSurface(state);

    assertInstitutionalInvariants(state, ledger);

    return state;
}
