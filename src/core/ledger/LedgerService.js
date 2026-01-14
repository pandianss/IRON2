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
        this.chain = [];
        this.userIndex = {}; // uid -> [blockIndex]
        this.collectionName = 'ledger_blocks';
        // Note: Real system would async load genesis or latest block here.
    }

    calculateHash(index, prevHash, timestamp, data) {
        const payload = index + prevHash + timestamp + JSON.stringify(data);
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

        // 1. Fetch Tail (Network Call or Cache)
        // For simplicity/safety, we fetch the LAST block for this user (or global if single chain).
        // IRON Design: User-specific hash chains (Micro-chains) are more scalable.
        const lastBlock = await this.getLastBlock(eventData.userId); // Fetch authoritative tail

        const index = lastBlock ? (lastBlock.index + 1) : 0;
        const prevHash = lastBlock ? lastBlock.hash : "0000000000000000000000000000000000000000000000000000000000000000";
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
        // We write to Firestore.
        try {
            await addDoc(collection(db, this.collectionName), newBlock);

            // Update local cache
            this.chain.push(newBlock);
            if (!this.userIndex[eventData.userId]) this.userIndex[eventData.userId] = [];
            this.userIndex[eventData.userId].push(index);

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
        // Optimization: Local cache check?
        // Relying on Firestore for authority.
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
        return snapshot.docs.map(doc => {
            const block = doc.data();
            return {
                timestamp: block.timestamp,
                hash: block.hash,
                event: block.data
            };
        });
    }
}

export const InstitutionalLedger = new LedgerService();
