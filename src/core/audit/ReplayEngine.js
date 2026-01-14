/**
 * REPLAY ENGINE (Forensics)
 * Authority: Institutional Layer
 * 
 * Capability: Rebuilds User State from Zero.
 * Validates consistency between the Ledger and the Current State.
 */

import { InstitutionalLedger } from '../ledger/LedgerService.js';
import { StateProjector } from '../ledger/SnapshotGenerator.js';

export class ReplayEngine {

    /**
     * Rebuild a user's state from the Genesis Block to Now.
     * @param {String} uid 
     * @returns {Object} Reconstructed State
     */
    rebuildState(uid) {
        // 1. Fetch Immutable History
        const historyChain = InstitutionalLedger.getHistory(uid);

        console.log(`[REPLAY] Rebuilding User ${uid} from ${historyChain.length} events...`);

        // 2. Project State (Deterministically)
        const reconstructedState = StateProjector.reduce(historyChain);

        return reconstructedState;
    }

    /**
     * Rebuild state up to a specific point in time.
     * Useful for debugging "What was the state on Tuesday?"
     * @param {String} uid 
     * @param {Date} targetDate 
     */
    rebuildStateAt(uid, targetDate) {
        const historyChain = InstitutionalLedger.getHistory(uid);

        const filteredHistory = historyChain.filter(block =>
            new Date(block.timestamp) <= targetDate
        );

        return StateProjector.reduce(filteredHistory);
    }

    /**
     * Audit: Compare Current DB State vs Ledger Truth
     * @param {Object} dbState - The state currently used by the App
     */
    validateState(dbState) {
        const truthState = this.rebuildState(dbState.uid);

        // Simple Deep Equal Check (conceptual)
        const isClean = JSON.stringify(dbState) === JSON.stringify(truthState);

        if (!isClean) {
            console.error(`[AUDIT FAILURE] State Mismatch for ${dbState.uid}`);
            // In a real system, we would calculate diffs
        }

        return isClean;
    }
}

export const Forensics = new ReplayEngine();
