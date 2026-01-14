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
 * - Persistence: Writes to 'ledger_blocks' collection in Firestore.
 * - Caching: Maintains local chain for speed, but Authority is Remote.
 */

import crypto from 'crypto';
import { db } from '../../infrastructure/firebase.js'; // Infrastructure Layer
import { collection, addDoc, query, where, orderBy, getDocs, limit } from 'firebase/firestore';

class LedgerService {
    constructor() {
        this.collectionName = 'ledger_blocks';
    }

    calculateHash(index, prevHash, timestamp, data) {
        const payload = `${index}|${prevHash}|${timestamp}|${JSON.stringify(data)}`;
        return crypto.createHash('sha256').update(payload).digest('hex');
    }

    /**
     * Write an Event to the Ledger.
     * @param {Object} eventData - The Canonical BehavioralEvent
     * @returns {Promise<String>} The hash of the new block
     */
    async append(eventData) {
        // Validation: Ensure Event is Canonical
        if (!eventData.userId) {
            throw new Error("LEDGER VALIDATION FAILED: Event missing userId.");
        }
        if (!eventData.narrativeId) {
            throw new Error("LEDGER VALIDATION FAILED: Event missing narrativeId (Constitutional Violation).");
        }

        // 1. Fetch Tail (Authoritative)
        const lastBlock = await this.getLastBlock(eventData.userId);

        const index = lastBlock ? (lastBlock.index + 1) : 0;
        const prevHash = lastBlock ? lastBlock.hash : "0".repeat(64);
        const timestamp = new Date().toISOString();

        // 2. Calculate Authoritative Hash
        const hash = this.calculateHash(index, prevHash, timestamp, eventData);

        const newBlock = {
            uid: eventData.userId, // Indexing Key
            index,
            timestamp,
            data: eventData, // Payload
            prevHash,
            hash
        };

        // 3. PERSIST (The One Write)
        try {
            await addDoc(collection(db, this.collectionName), newBlock);
            return hash;
        } catch (e) {
            console.error("LEDGER WRITE FAILED (CRITICAL)", e);
            throw new Error("CRITICAL: Ledger Write Failed. State mutation aborted.");
        }
    }

    /**
     * Fetch the authoritative tail of the chain for a user.
     * @param {String} uid 
     */
    async getLastBlock(uid) {
        const q = query(
            collection(db, this.collectionName),
            where("uid", "==", uid),
            orderBy("index", "desc"),
            limit(1)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        return snapshot.docs[0].data();
    }

    /**
     * Verify the integrity of a user's chain.
     * @param {String} uid 
     * @returns {Promise<boolean>}
     */
    async verifyChain(uid) {
        const history = await this.getHistory(uid);
        if (history.length === 0) return true;

        let prevHash = "0".repeat(64);
        let prevIndex = -1;

        for (const block of history) {
            // Check Index Continuity
            if (block.index !== prevIndex + 1) {
                console.error(`CHAIN BROKEN: Index mismatch at ${block.index}`);
                return false;
            }

            // Check Hash Link
            if (block.prevHash !== prevHash) {
                console.error(`CHAIN BROKEN: Hash mismatch at ${block.index}`);
                return false;
            }

            // Recompute Hash
            const computedHash = this.calculateHash(block.index, block.prevHash, block.timestamp, block.data);
            if (computedHash !== block.hash) {
                console.error(`CHAIN BROKEN: Data tampering detected at ${block.index}`);
                return false;
            }

            prevHash = block.hash;
            prevIndex = block.index;
        }

        return true;
    }

    /**
     * Get the full case file (history) for a user.
     * @param {String} uid 
     */
    async getHistory(uid) {
        const q = query(
            collection(db, this.collectionName),
            where("uid", "==", uid),
            orderBy("index", "asc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    }
}

export const InstitutionalLedger = new LedgerService();
