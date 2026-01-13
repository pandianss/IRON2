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
 */

import crypto from 'crypto';

class LedgerService {
    constructor() {
        this.chain = [];
        this.genesisBlock();
    }

    /**
     * Create the anchor for the chain.
     */
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

    /**
     * Generate SHA-256 Hash of block contents.
     */
    calculateHash(index, prevHash, timestamp, data) {
        const payload = index + prevHash + timestamp + JSON.stringify(data);
        return crypto.createHash('sha256').update(payload).digest('hex');
    }

    /**
     * Write an Event to the Ledger.
     * @param {Object} eventData - The standardized BehaviorEvent
     * @returns {String} The hash of the new block
     */
    append(eventData) {
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

        // Commit to Memory (In real impl, write to disk/DB immediately)
        this.chain.push(newBlock);

        return hash;
    }

    /**
     * Verify the integrity of the entire chain.
     * @returns {Boolean} True if valid, False if tampered.
     */
    verify() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            // 1. Link Check
            if (currentBlock.prevHash !== prevBlock.hash) {
                console.error(`[LEDGER] Broken Link at Index ${i}`);
                return false;
            }

            // 2. Data Integrity Check
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
     * @param {String} uid 
     */
    getHistory(uid) {
        return this.chain
            .filter(block => block.data.uid === uid)
            .map(block => ({
                timestamp: block.timestamp,
                hash: block.hash,
                event: block.data
            }));
    }

    /**
     * debug: Dump chain size
     */
    size() {
        return this.chain.length;
    }
}

// Singleton Instance
export const InstitutionalLedger = new LedgerService();
