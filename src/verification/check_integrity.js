/**
 * TEST: Institutional Verification
 * Checks if the VerificationAgent correctly reads and validates a user's ledger.
 */

import { VerificationAgent } from '../infrastructure/verification/VerificationAgent.js';
import { db } from '../infrastructure/firebase.js';

// MOCK USER ID or REAL USER ID from previous tests
const SUBJECT_ID = 'subject-alpha';

const run = async () => {
    console.log("RUNNING INSTITUTIONAL VERIFICATION CHECKS...");

    try {
        const result = await VerificationAgent.auditUser(SUBJECT_ID);
        console.log("AUDIT RESULT:", result);

        if (result.status === 'VERIFIED') {
            console.log("SUCCESS: User ledger integrity verified.");
        } else if (result.status === 'EMPTY') {
            console.log("NOTICE: User has no ledger yet.");
        } else {
            console.error("FAILURE: Audit failed", result);
            process.exit(1);
        }

    } catch (e) {
        console.error("CRASH:", e);
        process.exit(1);
    }

    // Force exit as firebase keeps connection open
    process.exit(0);
};

run();
