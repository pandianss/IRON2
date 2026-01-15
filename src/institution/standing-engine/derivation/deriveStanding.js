import { STANDING } from '../types';
import { resolveStandingTransitions } from '../rules/standingTransitions';

/**
 * Derives the current standing from a history of ledger events.
 * @param {import('../types').LedgerEvent[]} events 
 * @returns {import('../types').Standing}
 */
export function deriveStanding(events) {
    let standing = STANDING.PRE_INDUCTION;

    for (const e of events) {
        standing = resolveStandingTransitions(standing, e);
    }

    return standing;
}
