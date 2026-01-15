// ContractService.js
// Manages the "Behavioral Contracts" signed by users.
// These are not just database entries; they are immutable agreements.

import { db } from '../../services/backend/firestoreClient';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export const ContractService = {
    // ERA 1: GENESIS CONTRACT
    TERMS: {
        id: 'genesis_001',
        version: '1.0',
        clauses: [
            "I accept that IRON is an authority, not a tool.",
            "I will submit proof of compliance every 24 hours.",
            "I understand that failure results in a permanent Scar.",
            "I acknowledge that Scars cannot be deleted."
        ]
    },

    // Sign a new contract for the user
    signContract: async (userId) => {
        if (!userId) throw new Error("User required for contract signature.");

        const contractRef = doc(db, 'user_contracts', userId);

        const contractData = {
            ...ContractService.TERMS,
            signedAt: serverTimestamp(),
            status: 'ACTIVE',
            signatures: {
                user: userId,
                authority: 'IRON_GENESIS_SYSTEM'
            }
        };

        await setDoc(contractRef, contractData);
        return contractData;
    },

    // Get the current active contract
    getActiveContract: async (userId) => {
        if (!userId) return null;
        const docSnap = await getDoc(doc(db, 'user_contracts', userId));
        if (docSnap.exists()) return docSnap.data();
        return null;
    }
};
