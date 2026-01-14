/**
 * LEDGER SERVICE
 * Authority: Architecture Layer (The Iron Spine)
 * 
 * This service implements the "append-only" cryptographic ledger.
 * It is the single source of truth for the Institution.
 * 
 * Features:
 * - Hash Chaining (Blockchain-lite) ensures immutability.
 * - Append-Only semantics.
 * - Integrity Verification.
 * - Indexed by User.
 */

import crypto from 'crypto';

class LedgerService {
    constructor() {
        this.chain = [];
        this.userIndex = {}; // uid -> [blockIndex]
        this.genesisBlock();
    }

    genesisBlock() {
        const timestamp = new Date().toISOString();
        const genesisData = { type: 'SYSTEM_EVENT', payload: 'LEDGER_INITIALIZED' };
        this.chain.push({
            index: 0,
            timestamp: timestamp,
            data: genesisData,
            prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
            hash: this.calculateHash(0, "0000000000000000000000000000000000000000000000000000000000000000", timestamp, genesisData)
        });
    }

    calculateHash(index, prevHash, timestamp, data) {
        const payload = index + prevHash + timestamp + JSON.stringify(data);
        return crypto.createHash('sha256').update(payload).digest('hex');
    }

    /**
     * Write an Event to the Ledger.
     * @param {Object} eventData - The Canonical BehavioralEvent
     * @returns {String} The hash of the new block
     */
    append(eventData) {
        // Validation: Ensure Event is Canonical
        // Note: In JS, simple check. 
        if (!eventData.userId) {
            throw new Error("LEDGER VALIDATION FAILED: Event missing userId.");
        }
        // In a strictly typed system, we would validate instanceOf CanonicalEvent

        const lastBlock = this.chain[this.chain.length - 1];

        const index = lastBlock.index + 1;
        const timestamp = new Date().toISOString();
        const prevHash = lastBlock.hash;

        // Calculate Authoritative Hash
        const hash = this.calculateHash(index, prevHash, timestamp, eventData);

        const newBlock = {
            index,
            timestamp,
            data: eventData,
            prevHash,
            hash
        };

        // COMMIT
        this.chain.push(newBlock);

        // UPDATING INDICES
        if (!this.userIndex[eventData.userId]) {
            this.userIndex[eventData.userId] = [];
        }
        this.userIndex[eventData.userId].push(index);

        return hash;
    }

    verify() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if (currentBlock.prevHash !== prevBlock.hash) {
                console.error(`[LEDGER] Broken Link at Index ${i}`);
                return false;
            }

            const recalculatedHash = this.calculateHash(
                currentBlock.index,
                currentBlock.prevHash,
                currentBlock.timestamp,
                currentBlock.data
            );

            if (currentBlock.hash !== recalculatedHash) {
                console.error(`[LEDGER] Corrupted Data at Index ${i}`);
                return false;
            }
        }
        return true;
    }

    /**
     * Get the full case file (history) for a user.
     * Uses the Index for O(1) lookup of range.
     * @param {String} uid 
     */
    getHistory(uid) {
        const indices = this.userIndex[uid] || [];
        return indices.map(idx => {
            const block = this.chain[idx];
            return {
                timestamp: block.timestamp,
                hash: block.hash,
                event: block.data
            };
        });
    }

    // NO UPDATE method.
    // NO DELETE method.
}

export const InstitutionalLedger = new LedgerService();
