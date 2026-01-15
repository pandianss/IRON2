/**
 * VERIFICATION AGENT
 * Authority: Auditor Class
 * 
 * A standalone agent that:
 * 1. Fetches the complete immutable ledger chain from Firestore.
 * 2. Cryptographically verifies every hash link.
 * 3. Replays every event (via StateProjector) to derive "True State".
 * 4. Compares "True State" vs "Current Cache".
 * 
 * If a mismatch is found, it raises a CRITICAL Institutional Alert.
 */

import { InstitutionalLedger } from '../../core/ledger/LedgerService.js';
import { StateProjector } from '../../core/ledger/SnapshotGenerator.js';
import { EngineService } from '../../services/engine/EngineService.js'; // used for reads
import { InstitutionalAudit, ALERT_TYPES, SEVERITY } from '../monitoring/InstitutionalAudit.js';
import { INITIAL_USER_STATE } from '../../core/behavior/EngineSchema.js';

export class VerificationAgent {

    /**
     * Run a Full Verification Audit on a User.
     * @param {String} uid 
     */
    static async auditUser(uid) {
        console.log(`🕵️ VERIFICATION AGENT: Auditing User ${uid}...`);

        try {
            // 1. Fetch Immutable History
            const history = await InstitutionalLedger.getHistory(uid);
            if (history.length === 0) {
                console.log("No history found. Skipping.");
                return { status: 'EMPTY' };
            }

            // 2. Fetch Current State (The Claim)
            const claimedState = await EngineService.getUserState(uid);

            // 3. Verify Cryptography (The Chain)
            const isChainValid = await InstitutionalLedger.verifyChain(uid);
            if (!isChainValid) {
                await InstitutionalAudit.log({
                    type: ALERT_TYPES.LEDGER_CORRUPTION,
                    severity: SEVERITY.FATAL,
                    message: `Hash Chain Broken for user ${uid}`,
                    userId: uid
                });
                return { status: 'CORRUPTED', reason: 'HASH_MISMATCH' };
            }

            // 4. Replay State (The Truth)
            // Reconstruct state from ZERO using ONLY the ledger.
            let trueState = INITIAL_USER_STATE(uid);

            // Optimization: In a real system we might snapshot every N blocks.
            // Here we replay from Genesis.
            for (const block of history) {
                // Wrap event in the structure SnapshotGenerator expects (timestamp, event)
                const timelineEvent = {
                    timestamp: block.timestamp,
                    event: block.data
                };
                trueState = StateProjector.applyEvent(trueState, block.data);
            }

            // 5. Compare (The Judgment)
            const mismatch = this.compareStates(claimedState, trueState);

            if (mismatch) {
                await InstitutionalAudit.log({
                    type: ALERT_TYPES.REPLAY_MISMATCH,
                    severity: SEVERITY.CRITICAL,
                    message: `State Divergence Detected for ${uid}`,
                    details: mismatch,
                    userId: uid
                });
                return { status: 'FAILED', divergence: mismatch }; // Divergence detected
            }

            console.log(`✅ VERIFICATION PASSED for ${uid}. Ledger Count: ${history.length}`);
            return { status: 'VERIFIED', eventCount: history.length };

        } catch (error) {
            console.error("VERIFICATION AGENT CRASHED:", error);
            await InstitutionalAudit.log({
                type: ALERT_TYPES.SYSTEM_FAILURE,
                severity: SEVERITY.WARNING,
                message: `Verification Agent crashed for ${uid}: ${error.message}`,
                userId: uid
            });
            throw error;
        }
    }

    /**
     * Deep compare critical fields.
     */
    static compareStates(claimed, truth) {
        // We only verify CRITICAL fields to allow for minor schema drift / cache lag on UI fields.
        const criticalPaths = [
            'streak.count',
            'streak.active',
            'engagement_state',
            'social.social_capital',
            'civil.authority_level'
        ];

        for (const path of criticalPaths) {
            const valClaimed = this.getValue(claimed, path);
            const valTruth = this.getValue(truth, path);

            if (JSON.stringify(valClaimed) !== JSON.stringify(valTruth)) {
                return { field: path, claimed: valClaimed, truth: valTruth };
            }
        }
        return null; // Match
    }

    static getValue(obj, path) {
        return path.split('.').reduce((o, i) => o ? o[i] : null, obj);
    }
}
