import { EVENT_TYPE } from '../types';

/**
 * @param {import('../types').LedgerEvent[]} ledger 
 * @returns {import('../types').ScarRecord[]}
 */
export function deriveScars(ledger) {
    const scars = [];
    let era = 1;

    for (const event of ledger) {
        // Track Era if we had generic era events
        if (event.type === EVENT_TYPE.ERA_CLOSED) era++;

        if (event.type === EVENT_TYPE.VIOLATION_RECORDED) {
            scars.push({
                era: era,
                violationType: event.payload?.type || 'Unknown Violation',
                occurredAt: event.timestamp,
                recoveryCompleted: false
            });
        }

        if (event.type === EVENT_TYPE.RECOVERY_COMPLETED) {
            // Mark last scar as recovered? 
            // V1 logic: Just mark the most recent one?
            const lastScar = scars[scars.length - 1];
            if (lastScar) lastScar.recoveryCompleted = true;
        }
    }
    return scars;
}
