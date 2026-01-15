import { EVENT_TYPE } from '../types';

/**
 * @param {import('../types').LedgerEvent[]} ledger 
 * @param {number} now 
 * @returns {import('../types').DayState|null}
 */
export function deriveDayState(ledger, now) {
    let day = null;
    let currentEra = 1; // Default Era

    for (const event of ledger) {
        switch (event.type) {
            case EVENT_TYPE.DAY_OPENED:
                day = {
                    index: event.payload.dayIndex || (day ? day.index + 1 : 1),
                    openedAt: event.timestamp,
                    closesAt: event.timestamp + (24 * 60 * 60 * 1000), // V1: 24h Hardcoded
                    isOpen: true,
                    unresolvedObligations: 1 // V1: Always 1 Primary
                };
                break;

            case EVENT_TYPE.OBLIGATION_MET:
                if (day) {
                    day.isOpen = false;
                    day.unresolvedObligations = 0;
                }
                break;

            case EVENT_TYPE.RECOVERY_COMPLETED:
                // Reset day on recovery? Or just continue?
                // Legacy: day = null;
                day = null;
                break;
        }
    }

    return day;
}
