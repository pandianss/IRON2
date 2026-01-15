import { STANDING, EVENT_TYPE } from '../types';

/**
 * Resolves the next standing based on the current standing and a ledger event.
 * @param {import('../types').Standing} current 
 * @param {import('../types').LedgerEvent} event 
 * @returns {import('../types').Standing}
 */
export function resolveStandingTransitions(current, event) {
    switch (current) {

        case STANDING.PRE_INDUCTION:
            if (event.type === EVENT_TYPE.CONTRACT_CREATED) return STANDING.INDUCTED;
            return current;

        case STANDING.INDUCTED:
            if (event.type === EVENT_TYPE.OBLIGATION_MET) return STANDING.COMPLIANT;
            if (event.type === EVENT_TYPE.VIOLATION_RECORDED) return STANDING.VIOLATED;
            return current;

        case STANDING.COMPLIANT:
            if (event.type === EVENT_TYPE.SOFT_FAILURE) return STANDING.STRAINED;
            if (event.type === EVENT_TYPE.HARD_FAILURE) return STANDING.VIOLATED;
            if (event.type === EVENT_TYPE.LONG_CONTINUITY) return STANDING.INSTITUTIONAL;
            return current;

        case STANDING.STRAINED:
            if (event.type === EVENT_TYPE.OBLIGATION_MET) return STANDING.COMPLIANT;
            if (event.type === EVENT_TYPE.WINDOW_EXPIRED) return STANDING.BREACH_RISK;
            if (event.type === EVENT_TYPE.HARD_FAILURE) return STANDING.VIOLATED;
            return current;

        case STANDING.BREACH_RISK:
            if (event.type === EVENT_TYPE.OBLIGATION_MET) return STANDING.STRAINED;
            if (event.type === EVENT_TYPE.VIOLATION_RECORDED) return STANDING.VIOLATED;
            return current;

        case STANDING.VIOLATED:
            if (event.type === EVENT_TYPE.RECOVERY_ACCEPTED) return STANDING.RECOVERY;
            return current;

        case STANDING.RECOVERY:
            if (event.type === EVENT_TYPE.RECOVERY_COMPLETED) return STANDING.RECONSTITUTED;
            if (event.type === EVENT_TYPE.VIOLATION_RECORDED) return STANDING.VIOLATED;
            return current;

        case STANDING.RECONSTITUTED:
            if (event.type === EVENT_TYPE.OBLIGATION_MET) return STANDING.COMPLIANT;
            if (event.type === EVENT_TYPE.VIOLATION_RECORDED) return STANDING.VIOLATED;
            return current;

        case STANDING.INSTITUTIONAL:
            if (event.type === EVENT_TYPE.VIOLATION_RECORDED) return STANDING.VIOLATED;
            return current;

        default:
            return current;
    }
}
