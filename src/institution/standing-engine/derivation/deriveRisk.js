import { STANDING } from '../types';
import { deriveStanding } from './deriveStanding';

/**
 * @param {import('../types').LedgerEvent[]} ledger 
 * @param {import('../types').DayState} day 
 * @returns {import('../types').RiskProfile}
 */
export function deriveRisk(ledger, day) {
    const standing = deriveStanding(ledger);
    // Ideally accept standing as arg? evaluateInstitution passes (ledger, day).
    // Wait, evaluateInstitution passes (ledger, day). Good.

    let breachProbability = 0.0;
    if (standing === STANDING.BREACH_RISK) breachProbability = 0.8;
    if (standing === STANDING.STRAINED) breachProbability = 0.4;

    return {
        strainScore: 0,
        breachProbability,
        hoursToBreach: day && day.isOpen ? (day.closesAt - Date.now()) / 1000 / 60 / 60 : null,
        recentFailures: 0
    };
}
