import { STANDING } from '../types';
import { deriveStanding } from './deriveStanding';

/**
 * @param {import('../types').LedgerEvent[]} ledger 
 * @param {number} now 
 * @returns {import('../types').Obligation[]}
 */
export function deriveObligations(ledger, now) {
    const standing = deriveStanding(ledger);
    // Note: In an optimized engine, passing 'standing' and 'day' as args (computed previously) 
    // is better than re-deriving. But following the user's `evaluateInstitution` signature, 
    // this function takes (ledger, now). 
    // Wait, the user's `evaluateInstitution.ts` passes `(ledger, now)` to `deriveObligations`.
    // It does NOT pass the already-computed `standing` or `day`.
    // This implies `deriveObligations` might re-derive standing or we change the signature to be efficient.
    // For purity/strictness, I will re-derive or (better) import the derived state if possible? 
    // No, I will blindly re-derive 'standing' inside here using the shared helper, 
    // OR I will assume `evaluateInstitution` passed `(ledger, now)` but we can change the signature?
    // User: "evaluateInstitution(ledger, now) ... deriveObligations(ledger, now)".
    // I will stick to the signature. Re-deriving is cheap for MVP.

    // We need DayState too.
    // I won't re-import deriveDayState to avoid circular deps if any. 
    // I'll implementation-detail check the ledger for open day.

    let isDayOpen = false;
    for (const e of ledger) {
        if (e.type === 'DAY_OPENED') isDayOpen = true;
        if (e.type === 'OBLIGATION_MET') isDayOpen = false;
        if (e.type === 'RECOVERY_COMPLETED') isDayOpen = false;
    }

    const obligations = [];

    if (standing === STANDING.VIOLATED) {
        obligations.push({
            id: 'recovery-1',
            kind: 'RECOVERY',
            openedAt: now, // Placeholder
            dueBy: now + (7 * 24 * 60 * 60 * 1000), // 7 Days to recover?
            strictness: 'SEVERE',
            status: 'OPEN'
        });
    } else if (isDayOpen) {
        obligations.push({
            id: 'daily-1',
            kind: 'PRIMARY',
            openedAt: now,
            dueBy: now + (24 * 60 * 60 * 1000),
            strictness: 'NORMAL',
            status: 'OPEN'
        });
    }

    return obligations;
}
